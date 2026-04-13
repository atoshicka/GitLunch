import { PayloadAction } from '@reduxjs/toolkit';
import { call, delay, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { ApiService } from '../../entities/api/api-interface';
import {
  BackendOrder,
  BackendOrderStatus,
  ORDER_STATUS_LABEL,
  OrderStatus,
} from '../../entities/api/types/order-types';
import { ordersPersistence, PersistedOrdersState } from './orders-persistence';
import { selectors } from './selectors';
import { actions } from './slice';
import { Order, OrderItem, OrdersState } from './types';

const STATUS_MAP: Record<number, OrderStatus> = {
  0: 'pending',
  1: 'confirmed',
  2: 'preparing',
  3: 'ready',
  4: 'delivered',
  5: 'cancelled',
};

const STATUS_SEQUENCE: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready'];
const ACTIVE_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready'];
const TERMINAL_STATUSES: OrderStatus[] = ['delivered', 'cancelled'];

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
    const orders = backendOrders.map(mapBackendOrder);
    yield put(actions.fetchOrdersSuccess(orders));
    const activeOrders: Order[] = yield select(selectors.selectOrders);
    for (const order of activeOrders) {
      const localStatus = persisted.localStatuses[order.id];
      const effectiveStatus = localStatus ? localStatus.status : order.status;
      if (
        ACTIVE_STATUSES.includes(effectiveStatus) &&
        effectiveStatus !== 'ready' &&
        !TERMINAL_STATUSES.includes(effectiveStatus)
      ) {
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
    const backendOrder: BackendOrder = yield call([apiService, apiService.createOrder]);
    const order = mapBackendOrder(backendOrder);

    yield put(actions.createOrderSuccess(order));
    try {
      const backendOrders: BackendOrder[] = yield call([apiService, apiService.getOrders]);
      const freshOrder = backendOrders.map(mapBackendOrder).find((o) => o.id === order.id);
      if (freshOrder && freshOrder.items.length > 0) {
        yield put(
          actions.updateOrderItems({
            orderId: freshOrder.id,
            items: freshOrder.items,
            totalAmount: freshOrder.totalAmount,
          })
        );
      }
    } catch {}
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

  const orders: Order[] = yield select(selectors.selectOrders);
  const currentOrder = orders.find((o) => o.id === orderId);
  if (!currentOrder) return;
  if (TERMINAL_STATUSES.includes(currentOrder.status)) return;
  if (currentOrder.status === 'ready') return;

  let currentIndex = Math.max(0, STATUS_SEQUENCE.indexOf(currentOrder.status));

  while (currentIndex < STATUS_SEQUENCE.length - 1) {
    yield delay(60_000);
    const freshOrders: Order[] = yield select(selectors.selectOrders);
    const freshOrder = freshOrders.find((o) => o.id === orderId);
    if (!freshOrder) return;
    if (TERMINAL_STATUSES.includes(freshOrder.status)) return;
    if (freshOrder.status === 'ready') return;
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

        const idx = STATUS_SEQUENCE.indexOf(realStatus);
        if (idx !== -1) currentIndex = idx;

        if (TERMINAL_STATUSES.includes(realStatus) || realStatus === 'ready') return;
        continue;
      }
    } catch {}

    currentIndex += 1;
    const nextStatus = STATUS_SEQUENCE[currentIndex];
    yield put(
      actions.updateOrderStatus({
        orderId,
        status: nextStatus,
        statusLabel: ORDER_STATUS_LABEL[nextStatus],
      })
    );
    yield call(savePersistedState);

    if (nextStatus === 'ready') return;
  }
}
function* cancelOrderSaga(_apiService: ApiService, action: PayloadAction<number>) {
  try {
    yield put(actions.cancelOrderSuccess(action.payload));
    yield call(savePersistedState);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка отмены заказа';
    yield put(actions.fetchOrdersFailure(message));
  }
}

function* confirmPickupSaga(apiService: ApiService, action: PayloadAction<number>) {
  try {
    try {
      yield call([apiService, apiService.confirmPickup], action.payload);
    } catch {}
    yield put(actions.confirmPickupSuccess(action.payload));
    yield call(savePersistedState);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка подтверждения получения';
    yield put(actions.fetchOrdersFailure(message));
  }
}

function* removeOrderSaga() {
  yield call(savePersistedState);
}

export function* watchOrders(apiService: ApiService) {
  yield takeLatest(actions.fetchOrders.type, fetchOrdersSaga, apiService);
  yield takeEvery(actions.createOrder.type, createOrderSaga, apiService);
  yield takeEvery(actions.pollOrderStatus.type, pollOrderStatusSaga.bind(null, apiService));
  yield takeEvery(actions.cancelOrder.type, cancelOrderSaga.bind(null, apiService));
  yield takeEvery(actions.confirmPickup.type, confirmPickupSaga.bind(null, apiService));
  yield takeEvery(actions.removeOrder.type, removeOrderSaga);
}
