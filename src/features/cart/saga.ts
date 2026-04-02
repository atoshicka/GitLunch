import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { ApiService, BASE_URL } from '../../entities/api/api-interface';
import { BackendCartItem, BackendCartResponse } from '../../entities/api/types/cart-types';
import { selectors } from './selectors';
import { actions } from './slice';
import { CartItem } from './types';

const mapBackendItem = (item: BackendCartItem): CartItem => ({
  id: String(item.menu_item_id),
  cartItemId: item.id,
  name: item.name ?? '',
  price: typeof item.price === 'string' ? parseFloat(item.price) : (item.price ?? 0),
  quantity: item.quantity,
  imageUrl: item.image_url ? `${BASE_URL}${item.image_url}` : undefined,
});

function* fetchCartSaga(apiService: ApiService) {
  try {
    yield put(actions.setCartLoading(true));
    const cart: BackendCartResponse = yield call([apiService, apiService.getCart]);
    const items: CartItem[] = cart.items.map(mapBackendItem);
    yield put(actions.setCartFromBackend(items));
  } catch (error) {
    console.error('fetchCartSaga error:', error);
    yield put(actions.setCartError('Не удалось загрузить корзину'));
  }
}

function* syncAddToCartSaga(apiService: ApiService, action: ReturnType<typeof actions.addToCart>) {
  try {
    const { id, cartItemId } = action.payload;
    const items: CartItem[] = yield select(selectors.selectCartItems);
    const existing = items.find((i) => i.id === id);
    const resolvedCartItemId = cartItemId ?? existing?.cartItemId;

    if (resolvedCartItemId && existing) {
      yield call([apiService, apiService.updateCartItem], resolvedCartItemId, existing.quantity);
    } else {
      const cart: BackendCartResponse = yield call(
        [apiService, apiService.addCartItem],
        Number(id),
        1
      );
      const addedItem = cart.items.find((i) => String(i.menu_item_id) === id);
      if (addedItem) {
        yield put(actions.setCartItemBackendId({ menuItemId: id, cartItemId: addedItem.id }));
      }
    }
  } catch (error) {
    console.error('syncAddToCartSaga error:', error);
    yield call(fetchCartSaga, apiService);
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
    yield call(fetchCartSaga, apiService);
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
    yield call(fetchCartSaga, apiService);
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
