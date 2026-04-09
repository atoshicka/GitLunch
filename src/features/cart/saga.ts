import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { ApiService, BASE_URL } from '../../entities/api/api-interface';
import { BackendCartItem, BackendCartResponse } from '../../entities/api/types/cart-types';
import { Weekday } from '../../entities/api/types/menu-types';
import { selectors } from './selectors';
import { actions } from './slice';
import { CartItem } from './types';

const WEEKDAY_VALUES: Weekday[] = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'];

const isWeekday = (value: unknown): value is Weekday =>
  typeof value === 'string' && (WEEKDAY_VALUES as string[]).includes(value);

const mapBackendItem = (item: BackendCartItem): CartItem => ({
  id: String(item.menu_item_id),
  cartItemId: item.id,
  name: item.name ?? '',
  price: typeof item.price === 'string' ? parseFloat(item.price) : (item.price ?? 0),
  quantity: item.quantity,
  imageUrl: item.image_url ? `${BASE_URL}${item.image_url}` : undefined,
  weekday: isWeekday((item as BackendCartItem & { weekday?: unknown }).weekday)
    ? (item as BackendCartItem & { weekday: Weekday }).weekday
    : 'Понедельник',
});

function* fetchCartSaga(apiService: ApiService) {
  try {
    yield put(actions.setCartLoading(true));
    const cart: BackendCartResponse = yield call([apiService, apiService.getCart]);
    const items: CartItem[] = cart.items.map(mapBackendItem);
    yield put(actions.setCartFromBackend(items));
  } catch (error) {
    console.error('fetchCartSaga error:', error);
    yield put(actions.setCartInitialized());
    yield put(actions.setCartError('Не удалось загрузить корзину'));
  } finally {
    yield put(actions.setCartLoading(false));
  }
}

function* syncAddToCartSaga(apiService: ApiService, action: ReturnType<typeof actions.addToCart>) {
  try {
    const { id } = action.payload;
    const items: CartItem[] = yield select(selectors.selectCartItems);
    const existing = items.find((i) => i.id === id);
    if (!existing) return;

    if (existing.cartItemId) {
      yield call([apiService, apiService.updateCartItem], existing.cartItemId, existing.quantity);
      return;
    }

    const cart: BackendCartResponse = yield call([apiService, apiService.getCart]);
    const backendItem = cart.items.find((i) => String(i.menu_item_id) === id);

    if (backendItem) {
      yield put(actions.setCartItemBackendId({ menuItemId: id, cartItemId: backendItem.id }));
      const freshItems: CartItem[] = yield select(selectors.selectCartItems);
      const freshItem = freshItems.find((i) => i.id === id);
      const targetQty = freshItem?.quantity ?? existing.quantity;
      yield call([apiService, apiService.updateCartItem], backendItem.id, targetQty);
    } else {
      const updatedCart: BackendCartResponse = yield call(
        [apiService, apiService.addCartItem],
        Number(id),
        1
      );
      const created = updatedCart.items.find((i) => String(i.menu_item_id) === id);
      if (!created) return;

      yield put(actions.setCartItemBackendId({ menuItemId: id, cartItemId: created.id }));
      const freshItems: CartItem[] = yield select(selectors.selectCartItems);
      const freshItem = freshItems.find((i) => i.id === id);
      const targetQty = freshItem?.quantity ?? 1;
      if (targetQty !== 1) {
        yield call([apiService, apiService.updateCartItem], created.id, targetQty);
      }
    }
  } catch (error) {
    console.error('syncAddToCartSaga error:', error);
    yield put(actions.fetchCart());
  }
}

function* syncDecreaseSaga(
  apiService: ApiService,
  action: ReturnType<typeof actions.decreaseQuantity>
) {
  try {
    const { id, cartItemId } = action.payload;
    if (!cartItemId) return;
    const items: CartItem[] = yield select(selectors.selectCartItems);
    const item = items.find((i) => i.id === id);
    if (!item) {
      yield call([apiService, apiService.deleteCartItem], cartItemId);
    } else {
      yield call([apiService, apiService.updateCartItem], cartItemId, item.quantity);
    }
  } catch (error) {
    console.error('syncDecreaseSaga error:', error);
    yield put(actions.fetchCart());
  }
}

function* syncRemoveSaga(
  apiService: ApiService,
  action: ReturnType<typeof actions.removeFromCart>
) {
  try {
    const { cartItemId } = action.payload;
    if (!cartItemId) return;
    yield call([apiService, apiService.deleteCartItem], cartItemId);
  } catch (error) {
    console.error('syncRemoveSaga error:', error);
    yield put(actions.fetchCart());
  }
}

function* syncClearCartSaga(apiService: ApiService) {
  try {
    const cart: BackendCartResponse = yield call([apiService, apiService.getCart]);
    for (const item of cart.items) {
      yield call([apiService, apiService.deleteCartItem], item.id);
    }
  } catch (error) {
    console.error('syncClearCartSaga error:', error);
  }
}

export function* watchCart(apiService: ApiService) {
  yield takeLatest(actions.fetchCart.type, fetchCartSaga, apiService);
  yield takeEvery(actions.addToCart.type, syncAddToCartSaga, apiService);
  yield takeEvery(actions.decreaseQuantity.type, syncDecreaseSaga, apiService);
  yield takeEvery(actions.removeFromCart.type, syncRemoveSaga, apiService);
  yield takeEvery(actions.clearCart.type, syncClearCartSaga, apiService);
}
