import { call, getContext, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { ApiService } from '../../entities/api/api-interface';
import { BackendCartItem, BackendCartResponse } from '../../entities/api/types/cart-types';
import { selectors } from './selectors';
import { actions } from './slice';
import { CartItem } from './types';

const BASE_URL = 'https://gitlunch-backend-production.up.railway.app';

const mapBackendItem = (item: BackendCartItem): CartItem => ({
  id: String(item.menu_item_id),
  cartItemId: item.id,
  name: item.name ?? '',
  price: typeof item.price === 'string' ? parseFloat(item.price) : (item.price ?? 0),
  quantity: item.quantity,
  imageUrl: item.image_url ? `${BASE_URL}${item.image_url}` : undefined,
});

function* fetchCartSaga() {
  try {
    yield put(actions.setCartLoading(true));
    const apiService: ApiService = yield getContext('apiService');
    const cart: BackendCartResponse = yield call([apiService, apiService.getCart]);
    const items: CartItem[] = cart.items.map(mapBackendItem);
    yield put(actions.setCartFromBackend(items));
  } catch {
    yield put(actions.setCartError('Не удалось загрузить корзину'));
  }
}

function* syncAddToCartSaga(action: ReturnType<typeof actions.addToCart>) {
  try {
    const apiService: ApiService = yield getContext('apiService');
    const { id, cartItemId } = action.payload;

    const items: CartItem[] = yield select(selectors.selectCartItems);
    const existing = items.find((i) => i.id === id);
    const resolvedCartItemId = cartItemId ?? existing?.cartItemId;

    if (resolvedCartItemId) {
      const newQuantity = existing?.quantity ?? 1;
      yield call([apiService, apiService.updateCartItem], resolvedCartItemId, newQuantity);
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
  } catch {
    yield call(fetchCartSaga);
  }
}

function* syncDecreaseSaga(action: ReturnType<typeof actions.decreaseQuantity>) {
  try {
    const apiService: ApiService = yield getContext('apiService');
    const { id, cartItemId } = action.payload;

    if (!cartItemId) return;

    const items: CartItem[] = yield select(selectors.selectCartItems);
    const item = items.find((i) => i.id === id);

    if (!item) {
      yield call([apiService, apiService.deleteCartItem], cartItemId);
    } else {
      yield call([apiService, apiService.updateCartItem], cartItemId, item.quantity);
    }
  } catch {
    yield call(fetchCartSaga);
  }
}

function* syncRemoveSaga(action: ReturnType<typeof actions.removeFromCart>) {
  try {
    const apiService: ApiService = yield getContext('apiService');
    const { cartItemId } = action.payload;
    if (!cartItemId) return;
    yield call([apiService, apiService.deleteCartItem], cartItemId);
  } catch {
    yield call(fetchCartSaga);
  }
}

function* syncClearCartSaga() {
  try {
    const apiService: ApiService = yield getContext('apiService');
    const cart: BackendCartResponse = yield call([apiService, apiService.getCart]);
    for (const item of cart.items) {
      yield call([apiService, apiService.deleteCartItem], item.id);
    }
  } catch (e) {
    console.error('syncClearCartSaga error:', e);
  }
}

export function* watchCart() {
  yield takeLatest(actions.fetchCart.type, fetchCartSaga);
  yield takeEvery(actions.addToCart.type, syncAddToCartSaga);
  yield takeEvery(actions.decreaseQuantity.type, syncDecreaseSaga);
  yield takeEvery(actions.removeFromCart.type, syncRemoveSaga);
  yield takeEvery(actions.clearCart.type, syncClearCartSaga);
}
