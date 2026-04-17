import { PayloadAction } from '@reduxjs/toolkit';
import { call, delay, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { ApiService } from '../../entities/api/api-interface';
import {
  BackendOrder,
  BackendOrderStatus,
  OrderStatus,
} from '../../entities/api/types/order-types';
import { ordersPersistence, PersistedOrdersState } from './orders-persistence';
import { selectors } from './selectors';
import { actions } from './slice';
import { Order, OrderItem, OrdersState } from './types';

// бэк присылает числа, в коде работаем со строками
const STATUS_MAP: Record<number, OrderStatus> = {
  0: 'pending',
  1: 'confirmed',
  2: 'preparing',
  3: 'ready',
  4: 'delivered',
  5: 'cancelled',
};

const isTerminalOrReady = (status: OrderStatus) =>
  status === 'ready' || status === 'delivered' || status === 'cancelled';

const mapBackendOrder = (order: BackendOrder): Order => ({
  id: order.id,
  orderNumber: order.order_number,
  status: STATUS_MAP[order.status] ?? 'pending',
  statusLabel: order.status_label,
  totalAmount:
    typeof order.total_amount === 'string' ? parseFloat(order.total_amount) : order.total_amount,
  deliveryDate: order.delivery_date,
  deliveryAddress: order.delivery_address,
  itemsCount: order.items_count,
  createdAt: order.created_at,
  cancelledAt: order.cancelled_at,
  items: (order.items ?? []).map(
    (item): OrderItem => ({
      id: String(item.id),
      menuItemId: item.menu_item_id,
      name: item.name,
      price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
      quantity: item.quantity,
      total: typeof item.total === 'string' ? parseFloat(item.total) : item.total,
      imageUrl: item.image_url,
    })
  ),
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

function is500Error(error: unknown): boolean {
  if (getHttpStatus(error) === 500) return true;
  if (error instanceof Error) {
    return error.message.includes('500') || error.message.includes('Internal Server Error');
  }
  return false;
}

function* savePersistedState() {
  const state: OrdersState = yield select((s: { orders: OrdersState }) => s.orders);
  yield call(ordersPersistence.save, {
    removedOrderIds: state.removedOrderIds,
    localStatuses: state.localStatuses,
  });
}

function* fetchOrdersSaga(apiService: ApiService) {
  try {
    yield put(actions.fetchOrdersStart());
    const persisted: PersistedOrdersState = yield call(ordersPersistence.load);
    yield put(actions.restorePersistedState(persisted));
    const backendOrders: BackendOrder[] = yield call([apiService, apiService.getOrders]);
    yield put(actions.fetchOrdersSuccess(backendOrders.map(mapBackendOrder)));

    const activeOrders: Order[] = yield select(selectors.selectOrders);
    for (const order of activeOrders) {
      if (!isTerminalOrReady(order.status)) {
        yield put(actions.pollOrderStatus(order.id));
      }
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка загрузки заказов';
    yield put(actions.fetchOrdersFailure(message));
  }
}

function* createOrderSaga(apiService: ApiService) {
  try {
    yield put(actions.createOrderStart());
    let order: Order | null = null;

    try {
      const backendOrder: BackendOrder = yield call([apiService, apiService.createOrder]);
      order = mapBackendOrder(backendOrder);
    } catch (postError: unknown) {
      if (!is500Error(postError)) {
        const msg = postError instanceof Error ? postError.message : 'Ошибка создания заказа';
        yield put(actions.createOrderFailure(msg));
        return;
      }

      yield delay(1500);

      try {
        const list: BackendOrder[] = yield call([apiService, apiService.getOrders]);
        const mapped = list.map(mapBackendOrder);
        const known: Order[] = yield select(selectors.selectOrders);
        const knownIds = new Set(known.map((o) => o.id));
        const fresh = mapped.filter((o) => !knownIds.has(o.id)).sort((a, b) => b.id - a.id);
        order = fresh[0] ?? mapped.sort((a, b) => b.id - a.id)[0] ?? null;
      } catch {}

      if (!order) {
        yield put(
          actions.createOrderFailure(
            'Не удалось получить данные заказа. Проверьте раздел "Мои заказы".'
          )
        );
        return;
      }
    }

    yield put(actions.createOrderSuccess(order));

    if (!order.items || order.items.length === 0) {
      for (let attempt = 0; attempt < 3; attempt++) {
        yield delay(attempt === 0 ? 800 : 2000);
        try {
          const list: BackendOrder[] = yield call([apiService, apiService.getOrders]);
          const fresh = list.map(mapBackendOrder).find((o) => o.id === order!.id);
          if (fresh && fresh.items.length > 0) {
            yield put(
              actions.updateOrderItems({
                orderId: fresh.id,
                items: fresh.items,
                totalAmount: fresh.totalAmount,
              })
            );
            break;
          }
        } catch {}
      }
    }

    yield call(savePersistedState);
    yield put(actions.setOrderLocalStart(order.id));
    yield put(actions.pollOrderStatus(order.id));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка создания заказа';
    yield put(actions.createOrderFailure(message));
  }
}

function* pollOrderStatusSaga(apiService: ApiService, action: PayloadAction<number>) {
  const orderId = action.payload;

  while (true) {
    yield delay(30_000);

    const freshOrders: Order[] = yield select(selectors.selectOrders);
    const freshOrder = freshOrders.find((o) => o.id === orderId);
    if (!freshOrder || isTerminalOrReady(freshOrder.status)) return;

    try {
      const statusData: BackendOrderStatus = yield call(
        [apiService, apiService.getOrderStatus],
        orderId
      );
      const realStatus = STATUS_MAP[statusData.status] ?? null;
      if (realStatus) {
        yield put(
          actions.updateOrderStatus({
            orderId,
            status: realStatus,
            statusLabel: statusData.status_label,
          })
        );
        yield call(savePersistedState);
        if (isTerminalOrReady(realStatus)) return;
      }
    } catch {}
  }
}

function* confirmPickupSaga(apiService: ApiService, action: PayloadAction<number>) {
  try {
    yield call([apiService, apiService.confirmPickup], action.payload);
    yield put(actions.confirmPickupSuccess(action.payload));
    yield call(savePersistedState);
  } catch (error: unknown) {
    const httpStatus = getHttpStatus(error);
    const message =
      httpStatus === 422
        ? 'Заказ ещё не готов к выдаче'
        : error instanceof Error
          ? error.message
          : 'Ошибка подтверждения получения';
    yield put(actions.confirmPickupFailure(message));
  }
}

function* removeOrderSaga() {
  yield call(savePersistedState);
}

export function* watchOrders(apiService: ApiService) {
  yield takeLatest(actions.fetchOrders.type, fetchOrdersSaga, apiService);
  yield takeEvery(actions.createOrder.type, createOrderSaga, apiService);
  yield takeEvery(actions.pollOrderStatus.type, pollOrderStatusSaga.bind(null, apiService));
  yield takeEvery(actions.confirmPickup.type, confirmPickupSaga.bind(null, apiService));
  yield takeEvery(actions.removeOrder.type, removeOrderSaga);
}
