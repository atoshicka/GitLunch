import { call, getContext, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { ApiService } from '../../entities/api/api-interface';
import { BackendCartItem } from '../../entities/api/types/cart-types';
import { selectCartItems } from './cart-selectors';
import {
  addToCart,
  clearCart,
  decreaseQuantity,
  removeFromCart,
  setCartError,
  setCartFromBackend,
  setCartItemBackendId,
  setCartLoading,
} from './cart-slice';
import { CartItem } from './types';

const BASE_URL = 'https://gitlunch-backend-production.up.railway.app';

interface BackendCartResponse {
  id: number;
  items: BackendCartItem[];
  total_items: number;
  total_price: string;
}

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
    yield put(setCartLoading(true));
    const apiService: ApiService = yield getContext('apiService');
    const cart: BackendCartResponse = yield call([apiService, apiService.getCart]);

    console.log('CART RESPONSE:', JSON.stringify(cart));

    const items: CartItem[] = cart.items.map(mapBackendItem);
    yield put(setCartFromBackend(items));
  } catch (e) {
    console.error('fetchCartSaga error:', e);
    yield put(setCartError('Не удалось загрузить корзину'));
  }
}

function* syncAddToCartSaga(action: ReturnType<typeof addToCart>) {
  try {
    const apiService: ApiService = yield getContext('apiService');
    const { id, cartItemId } = action.payload;

    const items: CartItem[] = yield select(selectCartItems);
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
        yield put(setCartItemBackendId({ menuItemId: id, cartItemId: addedItem.id }));
      }
    }
  } catch (e) {
    console.error('syncAddToCartSaga error:', e);
    yield call(fetchCartSaga);
  }
}

function* syncDecreaseSaga(action: ReturnType<typeof decreaseQuantity>) {
  try {
    const apiService: ApiService = yield getContext('apiService');
    const { id, cartItemId } = action.payload;

    if (!cartItemId) {
      console.warn('decreaseQuantity: cartItemId не передан, пропускаем синк с бэком');
      return;
    }

    const items: CartItem[] = yield select(selectCartItems);
    const item = items.find((i) => i.id === id);

    if (!item) {
      yield call([apiService, apiService.deleteCartItem], cartItemId);
    } else {
      yield call([apiService, apiService.updateCartItem], cartItemId, item.quantity);
    }
  } catch (e) {
    console.error('syncDecreaseSaga error:', e);
    yield call(fetchCartSaga);
  }
}

function* syncRemoveSaga(action: ReturnType<typeof removeFromCart>) {
  try {
    const apiService: ApiService = yield getContext('apiService');
    const { cartItemId } = action.payload;

    if (!cartItemId) {
      console.warn('removeFromCart: cartItemId не передан, пропускаем синк с бэком');
      return;
    }

    yield call([apiService, apiService.deleteCartItem], cartItemId);
  } catch (e) {
    console.error('syncRemoveSaga error:', e);
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
  yield takeLatest('FETCH_CART', fetchCartSaga);
  yield takeEvery(addToCart.type, syncAddToCartSaga);
  yield takeEvery(decreaseQuantity.type, syncDecreaseSaga);
  yield takeEvery(removeFromCart.type, syncRemoveSaga);
  yield takeEvery(clearCart.type, syncClearCartSaga);
}
