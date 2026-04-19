// features/orders/sagas.ts
import { PayloadAction } from '@reduxjs/toolkit';
import { call, delay, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { ApiService } from '../../entities/api/api-interface';
import {
  BackendOrder,
  BackendOrderStatus,
  CreateOrderResponse,
  OrderStatus,
} from '../../entities/api/types/order-types';
import { ordersPersistence, PersistedOrdersState } from './orders-persistence';
import { selectors } from './selectors';
import { actions } from './slice';
import { CreateOrderPayload, Order, OrderItem, OrdersState } from './types';

const STATUS_MAP: Record<number, OrderStatus> = {
  0: 'pending',
  1: 'confirmed',
  2: 'preparing',
  3: 'ready',
  4: 'delivered',
  5: 'cancelled',
};

const normalizeStatus = (status: number | string): OrderStatus => {
  if (typeof status === 'number') return STATUS_MAP[status] ?? 'pending';
  const strMap: Record<string, OrderStatus> = {
    pending: 'pending',
    confirmed: 'confirmed',
    preparing: 'preparing',
    ready: 'ready',
    delivered: 'delivered',
    cancelled: 'cancelled',
  };
  return strMap[status] ?? 'pending';
};

const isTerminalOrReady = (status: OrderStatus) =>
  status === 'ready' || status === 'delivered' || status === 'cancelled';

const mapBackendOrder = (order: BackendOrder): Order => ({
  id: order.id,
  orderNumber: order.order_number,
  pickupCode: order.pickup_code,
  status: normalizeStatus(order.status),
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

    try {
      const backendOrders: BackendOrder[] = yield call([apiService, apiService.getOrders]);
      yield put(actions.fetchOrdersSuccess(backendOrders.map(mapBackendOrder)));

      const activeOrders: Order[] = yield select(selectors.selectOrders);
      const toPool = activeOrders.filter((o) => o.id && !isTerminalOrReady(o.status)).slice(0, 3);

      for (const order of toPool) {
        yield put(actions.pollOrderStatus(order.id));
      }
    } catch (fetchError: unknown) {
      console.error('fetchOrdersSaga fetch error:', fetchError);
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
    console.error('fetchOrderDetailsSaga error:', error);
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

    const backendOrder = response.orders?.[0];

    if (!backendOrder?.id) {
      yield put(actions.createOrderFailure('Не удалось получить данные заказа'));
      return;
    }

    const order = mapBackendOrder(backendOrder);
    yield put(actions.createOrderSuccess(order));
    yield call(savePersistedState);
    yield put(actions.setOrderLocalStart(order.id));

    if (!isTerminalOrReady(order.status)) {
      yield put(actions.pollOrderStatus(order.id));
    }
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
      const realStatus = normalizeStatus(statusData.status);
      yield put(
        actions.updateOrderStatus({
          orderId,
          status: realStatus,
          statusLabel: statusData.status_label,
        })
      );
      yield call(savePersistedState);
      if (isTerminalOrReady(realStatus)) return;
    } catch (error: unknown) {
      if (getHttpStatus(error) === 404) return;
    }
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
  yield takeEvery(actions.fetchOrderDetails.type, fetchOrderDetailsSaga, apiService);
  yield takeEvery(actions.createOrder.type, createOrderSaga, apiService);
  yield takeEvery(actions.pollOrderStatus.type, pollOrderStatusSaga.bind(null, apiService));
  yield takeEvery(actions.confirmPickup.type, confirmPickupSaga.bind(null, apiService));
  yield takeEvery(actions.removeOrder.type, removeOrderSaga);
}
