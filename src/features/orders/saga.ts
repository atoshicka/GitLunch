import { PayloadAction } from '@reduxjs/toolkit';
import { Task } from 'redux-saga';
import {
  call,
  cancel,
  delay,
  fork,
  put,
  select,
  take,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import { ApiService } from '../../entities/api/api-interface';
import {
  BackendOrder,
  CreateOrderResponse,
  OrderStatus,
} from '../../entities/api/types/order-types';
import { showOrderReadyNotification } from '../../shared/utils/notifications';
import { actions as loginActions } from '../login/slice';
import { ordersPersistence, PersistedOrdersState } from './orders-persistence';
import { selectors } from './selectors';
import { actions } from './slice';
import { CreateOrderPayload, Order, OrdersState } from './types';

const POLL_INTERVAL = __DEV__ ? 10_000 : 30_000;

const normalizeStatus = (status: number | string): OrderStatus => {
  const num = typeof status === 'string' ? parseInt(status, 10) : status;
  if (num === 1) return 'ready';
  if (num === 2) return 'delivered';
  if (status === 'ready') return 'ready';
  if (status === 'delivered') return 'delivered';
  return 'pending';
};

const isTerminal = (status: OrderStatus): boolean => status === 'delivered';

const mapBackendOrder = (order: BackendOrder): Order => ({
  id: order.id,
  orderNumber: order.order_number,
  pickupCode: order.pickup_code,
  status: normalizeStatus(order.status),
  statusLabel: order.status_label,
  totalAmount:
    typeof order.total_amount === 'string' ? parseFloat(order.total_amount) : order.total_amount,
  deliveryInfo: order.delivery_info,
  deliveryAddress: order.delivery_address,
  itemsCount: order.items_count,
  createdAt: order.created_at,
  updatedAt: order.updated_at ?? order.created_at,
  cancelledAt: order.cancelled_at,
  items: (order.items ?? []).map((item) => ({
    id: String(item.id),
    menuItemId: item.menu_item_id,
    name: item.name,
    price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
    quantity: item.quantity,
    total: typeof item.total === 'string' ? parseFloat(item.total) : item.total,
    imageUrl: item.image_url,
  })),
});

function getHttpStatus(error: unknown): number | null {
  if (error && typeof error === 'object') {
    const r = (error as Record<string, unknown>).response;
    if (r && typeof r === 'object') {
      const status = (r as Record<string, unknown>).status;
      if (typeof status === 'number') return status;
    }
  }
  return null;
}

function* savePersistedState() {
  const state: OrdersState = yield select((s: { orders: OrdersState }) => s.orders);

  const lastKnownStatuses: Record<number, OrderStatus> = {};
  for (const order of state.orders) {
    lastKnownStatuses[order.id] = order.status;
  }

  yield call(ordersPersistence.save, {
    removedOrderIds: state.removedOrderIds,
    localStatuses: state.localStatuses,
    lastKnownStatuses,
    notifiedOrderIds: state.notifiedOrderIds,
    lastSyncAt: state.lastSyncAt,
  });
}

function* fetchOrdersSaga(apiService: ApiService) {
  try {
    yield put(actions.fetchOrdersStart());
    const persisted: PersistedOrdersState = yield call(ordersPersistence.load);
    yield put(
      actions.restorePersistedState({
        removedOrderIds: persisted.removedOrderIds,
        localStatuses: persisted.localStatuses,
        notifiedOrderIds: persisted.notifiedOrderIds,
        lastSyncAt: persisted.lastSyncAt,
      })
    );

    try {
      const backendOrders: BackendOrder[] = yield call([apiService, apiService.getOrders]);

      console.log(
        'RAW ORDERS:',
        JSON.stringify(
          backendOrders.map((o) => ({
            id: o.id,
            status: o.status,
            status_label: o.status_label,
            updated_at: o.updated_at,
          }))
        )
      );

      const mappedOrders = backendOrders.map(mapBackendOrder);
      yield put(actions.fetchOrdersSuccess(mappedOrders));

      const notifiedIds: number[] = persisted.notifiedOrderIds ?? [];
      const lastKnownStatuses = persisted.lastKnownStatuses ?? {};

      for (const order of mappedOrders) {
        const alreadyNotified = notifiedIds.includes(order.id);
        const oldStatus = lastKnownStatuses[order.id];

        if (!alreadyNotified && oldStatus === 'pending' && order.status === 'ready') {
          console.log('🔔 Уведомление при загрузке для заказа', order.orderNumber);
          yield call(showOrderReadyNotification, order.orderNumber);
          yield put(actions.markOrderAsNotified(order.id));
        }
      }

      if (backendOrders.length > 0) {
        const latestUpdatedAt = backendOrders.reduce((max, o) => {
          const t = o.updated_at ?? o.created_at ?? '';
          return t > max ? t : max;
        }, '');
        if (latestUpdatedAt) {
          yield put(actions.setLastSyncAt(latestUpdatedAt));
        }
      }

      yield call(savePersistedState);

      const activeOrders: Order[] = yield select(selectors.selectActiveOrders);
      if (activeOrders.length > 0) {
        yield put(actions.startGlobalPolling());
      }
    } catch (fetchError: unknown) {
      const message = fetchError instanceof Error ? fetchError.message : 'Ошибка загрузки заказов';
      yield put(actions.fetchOrdersFailure(message));
    }
  } catch (error: unknown) {
    console.error('fetchOrdersSaga outer error:', error);
  }
}

function* fetchOrderDetailsSaga(apiService: ApiService, action: PayloadAction<number>) {
  try {
    yield put(actions.fetchOrderDetailsStart());
    const backendOrder: BackendOrder = yield call(
      [apiService, apiService.getOrderDetails],
      action.payload
    );
    yield put(actions.fetchOrderDetailsSuccess(mapBackendOrder(backendOrder)));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка загрузки деталей заказа';
    yield put(actions.fetchOrderDetailsFailure(message));
  }
}

function* createOrderSaga(apiService: ApiService, action: PayloadAction<CreateOrderPayload>) {
  try {
    yield put(actions.createOrderStart());

    const response: CreateOrderResponse = yield call(
      [apiService, apiService.createOrder],
      action.payload
    );

    if (!response.orders || response.orders.length === 0) {
      yield put(actions.createOrderFailure('Не удалось получить данные заказов'));
      return;
    }

    for (const backendOrder of response.orders) {
      const order = mapBackendOrder(backendOrder);
      yield put(actions.createOrderSuccess(order));
      yield call(savePersistedState);
      yield put(actions.setOrderLocalStart(order.id));
    }

    yield put(actions.startGlobalPolling());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка создания заказа';
    yield put(actions.createOrderFailure(message));
  }
}

function* globalPollingWorker(apiService: ApiService) {
  console.log('🔄 Глобальный поллинг запущен');

  while (true) {
    yield delay(POLL_INTERVAL);

    const activeOrders: Order[] = yield select(selectors.selectActiveOrders);
    if (activeOrders.length === 0) {
      console.log('✅ Нет активных заказов, поллинг останавливается');
      return;
    }

    const lastSyncAt: string | null = yield select(selectors.selectLastSyncAt);

    try {
      let updatedOrders: BackendOrder[];

      if (lastSyncAt && apiService.getOrdersSince) {
        updatedOrders = yield call([apiService, apiService.getOrdersSince], lastSyncAt);
        console.log(`📡 Поллинг since ${lastSyncAt}: получено ${updatedOrders.length} заказов`);
      } else {
        updatedOrders = yield call([apiService, apiService.getOrders]);
        console.log(`📡 Поллинг (full): получено ${updatedOrders.length} заказов`);
      }

      if (updatedOrders.length === 0) continue;

      const currentOrders: Order[] = yield select(selectors.selectOrders);
      const currentOrderMap = new Map(currentOrders.map((o) => [o.id, o]));

      const state: OrdersState = yield select((s: { orders: OrdersState }) => s.orders);
      const removedIds = new Set(state.removedOrderIds);
      const notifiedIds = new Set(state.notifiedOrderIds);

      let hasChanges = false;
      let latestUpdatedAt = lastSyncAt ?? '';

      for (const backendOrder of updatedOrders) {
        if (removedIds.has(backendOrder.id)) continue;

        const newStatus = normalizeStatus(backendOrder.status);
        const currentOrder = currentOrderMap.get(backendOrder.id);
        const oldStatus = currentOrder?.status;

        const orderUpdatedAt = backendOrder.updated_at ?? backendOrder.created_at ?? '';
        if (orderUpdatedAt > latestUpdatedAt) {
          latestUpdatedAt = orderUpdatedAt;
        }

        if (oldStatus !== newStatus) {
          console.log(`📦 Заказ #${backendOrder.order_number}: ${oldStatus} → ${newStatus}`);

          yield put(
            actions.updateOrderStatus({
              orderId: backendOrder.id,
              status: newStatus,
              statusLabel: backendOrder.status_label,
            })
          );

          hasChanges = true;

          const alreadyNotified = notifiedIds.has(backendOrder.id);
          if (oldStatus === 'pending' && newStatus === 'ready' && !alreadyNotified) {
            console.log('🔔 Показываем уведомление для заказа', backendOrder.order_number);
            yield call(showOrderReadyNotification, backendOrder.order_number);
            yield put(actions.markOrderAsNotified(backendOrder.id));
            notifiedIds.add(backendOrder.id);
          }
        }
      }

      if (latestUpdatedAt && latestUpdatedAt !== lastSyncAt) {
        yield put(actions.setLastSyncAt(latestUpdatedAt));
      }

      if (hasChanges) {
        yield call(savePersistedState);
      }
    } catch (error: unknown) {
      const httpStatus = getHttpStatus(error);
      if (httpStatus === 401) {
        console.log('🚫 Поллинг: 401, останавливаемся');
        return;
      }
      console.warn('⚠️ Поллинг ошибка:', error);
    }
  }
}

let globalPollingTask: Task | null = null;

function* globalPollingManagerSaga(apiService: ApiService) {
  while (true) {
    yield take(actions.startGlobalPolling.type);

    if (globalPollingTask) {
      yield cancel(globalPollingTask);
      globalPollingTask = null;
    }

    globalPollingTask = yield fork(globalPollingWorker, apiService);

    yield take([
      actions.stopGlobalPolling.type,
      loginActions.logout.type,
      loginActions.logoutRequest.type,
    ]);

    if (globalPollingTask) {
      yield cancel(globalPollingTask);
      globalPollingTask = null;
      console.log('⏹️ Глобальный поллинг остановлен');
    }
  }
}

function* removeOrderSaga() {
  yield call(savePersistedState);
}

function* destroyAllOrdersSaga(apiService: ApiService) {
  try {
    yield call([apiService, apiService.destroyAllOrders]);
    yield put(actions.destroyAllOrdersSuccess());
    yield put(actions.stopGlobalPolling());
    yield call(savePersistedState);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка удаления заказов';
    yield put(actions.destroyAllOrdersFailure(message));
  }
}

export function* watchOrders(apiService: ApiService) {
  yield fork(globalPollingManagerSaga, apiService);

  yield takeLatest(actions.fetchOrders.type, fetchOrdersSaga, apiService);
  yield takeEvery(actions.fetchOrderDetails.type, fetchOrderDetailsSaga, apiService);
  yield takeEvery(actions.createOrder.type, createOrderSaga, apiService);
  yield takeEvery(actions.removeOrder.type, removeOrderSaga);
  yield takeLatest(actions.destroyAllOrders.type, destroyAllOrdersSaga, apiService);
}
