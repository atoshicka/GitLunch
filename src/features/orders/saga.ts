import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { SagaIterator, Task } from 'redux-saga';
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

export const normalizeStatus = (status: number | string): OrderStatus => {
  const num = typeof status === 'string' ? parseInt(status, 10) : status;
  if (num === 1) return 'ready';
  if (num === 2) return 'delivered';
  return status === 'ready' || status === 'delivered' ? status : 'pending';
};

export const mapBackendOrder = (order: BackendOrder): Order => ({
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

function* savePersistedState(): SagaIterator {
  const state: OrdersState = yield select((s: { orders: OrdersState }) => s.orders);
  const lastKnownStatuses: Record<number, OrderStatus> = {};
  state.orders.forEach((order) => {
    lastKnownStatuses[order.id] = order.status;
  });

  yield call(ordersPersistence.save, {
    removedOrderIds: state.removedOrderIds,
    localStatuses: state.localStatuses,
    lastKnownStatuses,
    notifiedOrderIds: state.notifiedOrderIds,
    lastSyncAt: state.lastSyncAt,
  });
}

export function* fetchOrdersSaga(apiService: ApiService): SagaIterator {
  try {
    yield put(actions.fetchOrdersStart());
    const persisted: PersistedOrdersState = yield call(ordersPersistence.load);

    yield put(
      actions.restorePersistedState({
        removedOrderIds: persisted.removedOrderIds ?? [],
        localStatuses: persisted.localStatuses ?? {},
        notifiedOrderIds: persisted.notifiedOrderIds ?? [],
        lastSyncAt: persisted.lastSyncAt ?? null,
      })
    );

    try {
      const backendOrders: BackendOrder[] = yield call([apiService, apiService.getOrders]);
      const mappedOrders: Order[] = backendOrders.map(mapBackendOrder);
      yield put(actions.fetchOrdersSuccess(mappedOrders));

      const notifiedIds = persisted.notifiedOrderIds ?? [];
      const lastKnown = persisted.lastKnownStatuses ?? {};

      for (const order of mappedOrders) {
        if (
          !notifiedIds.includes(order.id) &&
          lastKnown[order.id] === 'pending' &&
          order.status === 'ready'
        ) {
          yield call(showOrderReadyNotification, order.orderNumber);
          yield put(actions.markOrderAsNotified(order.id));
        }
      }

      yield call(savePersistedState);
      const activeOrders: Order[] = yield select(selectors.selectActiveOrders);
      if (activeOrders.length > 0) yield put(actions.startGlobalPolling());
    } catch (e: unknown) {
      if (e instanceof AxiosError && e.response?.status === 401) return;
      const message = e instanceof Error ? e.message : 'Unknown error';
      yield put(actions.fetchOrdersFailure(message));
    }
  } catch (err: unknown) {
    console.error('fetchOrdersSaga critical error', err);
  }
}

export function* fetchOrderDetailsSaga(
  apiService: ApiService,
  action: PayloadAction<number>
): SagaIterator {
  try {
    yield put(actions.fetchOrderDetailsStart());
    const backendOrder: BackendOrder = yield call(
      [apiService, apiService.getOrderDetails],
      action.payload
    );
    yield put(actions.fetchOrderDetailsSuccess(mapBackendOrder(backendOrder)));
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Ошибка загрузки деталей заказа';
    yield put(actions.fetchOrderDetailsFailure(message));
  }
}

export function* createOrderSaga(
  apiService: ApiService,
  action: PayloadAction<CreateOrderPayload>
): SagaIterator {
  try {
    yield put(actions.createOrderStart());
    const response: CreateOrderResponse = yield call(
      [apiService, apiService.createOrder],
      action.payload
    );

    if (response.orders && response.orders.length > 0) {
      for (const border of response.orders) {
        const order = mapBackendOrder(border);
        yield put(actions.createOrderSuccess(order));
        yield put(actions.setOrderLocalStart(order.id));
      }
      yield call(savePersistedState);
      yield put(actions.startGlobalPolling());
    } else {
      yield put(actions.createOrderFailure('Не удалось получить данные заказов'));
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Ошибка создания заказа';
    yield put(actions.createOrderFailure(message));
  }
}

export function* globalPollingWorker(apiService: ApiService): SagaIterator {
  while (true) {
    yield delay(POLL_INTERVAL);
    const activeOrders: Order[] = yield select(selectors.selectActiveOrders);
    if (activeOrders.length === 0) return;

    const lastSyncAt: string | null = yield select(selectors.selectLastSyncAt);

    try {
      const updatedOrders: BackendOrder[] =
        lastSyncAt && apiService.getOrdersSince
          ? yield call([apiService, apiService.getOrdersSince], lastSyncAt)
          : yield call([apiService, apiService.getOrders]);

      if (updatedOrders.length === 0) continue;

      const state: OrdersState = yield select((s: { orders: OrdersState }) => s.orders);
      const notifiedIds = new Set(state.notifiedOrderIds);
      let latestTime = lastSyncAt ?? '';

      for (const border of updatedOrders) {
        const newStatus = normalizeStatus(border.status);
        const orderTime = border.updated_at ?? border.created_at ?? '';
        if (orderTime > latestTime) latestTime = orderTime;

        yield put(
          actions.updateOrderStatus({
            orderId: border.id,
            status: newStatus,
            statusLabel: border.status_label,
            deliveryInfo: border.delivery_info,
          })
        );

        if (newStatus === 'ready' && !notifiedIds.has(border.id)) {
          yield call(showOrderReadyNotification, border.order_number);
          yield put(actions.markOrderAsNotified(border.id));
        }
      }

      yield put(actions.setLastSyncAt(latestTime));
      yield call(savePersistedState);
    } catch (e: unknown) {
      if (e instanceof AxiosError && e.response?.status === 401) return;
    }
  }
}

let pollingTask: Task | null = null;

function* pollingManager(apiService: ApiService): SagaIterator {
  while (true) {
    yield take(actions.startGlobalPolling.type);
    if (pollingTask) yield cancel(pollingTask);
    pollingTask = yield fork(globalPollingWorker, apiService);

    yield take([actions.stopGlobalPolling.type, loginActions.logout.type]);
    if (pollingTask) {
      yield cancel(pollingTask);
      pollingTask = null;
    }
  }
}

export function* watchOrders(apiService: ApiService): SagaIterator {
  yield fork(pollingManager, apiService);
  yield takeLatest(actions.fetchOrders.type, fetchOrdersSaga, apiService);
  yield takeEvery(actions.fetchOrderDetails.type, fetchOrderDetailsSaga, apiService);
  yield takeEvery(actions.createOrder.type, createOrderSaga, apiService);
}
