import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { ApiService } from '../../entities/api/api-interface';
import { BackendCartDayGroup, BackendCartResponse } from '../../entities/api/types/cart-types';
import { BASE_URL } from '../../shared/constants/api/api';
import { actions } from './slice';
import { CartDayGroup, CartItem } from './types';

const mapBackendGroup = (group: BackendCartDayGroup): CartDayGroup => {
  return {
    date: group.date,
    dayName: group.day_name,
    total: parseFloat(group.total),
    selected: false,
    items: group.items.map(
      (item): CartItem => ({
        id: String(item.menu_item_id),
        cartItemId: item.id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
        imageUrl: item.image_url
          ? item.image_url.startsWith('http')
            ? item.image_url
            : `${BASE_URL}${item.image_url}`
          : undefined,
      })
    ),
  };
};

function* fetchCartSaga(apiService: ApiService) {
  try {
    yield put(actions.setCartLoading(true));
    const cart: BackendCartResponse = yield call([apiService, apiService.getCart]);
    const dayGroups: CartDayGroup[] = cart.items_by_day.map(mapBackendGroup);
    yield put(actions.setCartFromBackend(dayGroups));
  } catch (error) {
    console.error('fetchCartSaga error:', error);
    yield put(actions.setCartInitialized());
    yield put(actions.setCartError('Не удалось загрузить корзину'));
  } finally {
    yield put(actions.setCartLoading(false));
  }
}

function* fetchCartSilentSaga(apiService: ApiService) {
  try {
    const cart: BackendCartResponse = yield call([apiService, apiService.getCart]);
    const dayGroups: CartDayGroup[] = cart.items_by_day.map(mapBackendGroup);
    yield put(actions.setCartFromBackend(dayGroups));
  } catch (error) {
    console.error('fetchCartSilentSaga error:', error);
  }
}

function* syncAddToCartSaga(apiService: ApiService, action: ReturnType<typeof actions.addToCart>) {
  try {
    const { id } = action.payload;
    yield call([apiService, apiService.addCartItem], Number(id), 1);
    yield put(actions.fetchCartSilent());
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

    const dayGroups: CartDayGroup[] = yield select(
      (state: { cart: { dayGroups: CartDayGroup[] } }) => state.cart.dayGroups
    );
    const item = dayGroups.flatMap((g) => g.items).find((i) => i.id === id);

    if (!item || item.quantity <= 1) {
      yield call([apiService, apiService.deleteCartItem], cartItemId);
    } else {
      yield call([apiService, apiService.updateCartItem], cartItemId, item.quantity - 1);
    }

    yield put(actions.fetchCartSilent());
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
    yield put(actions.fetchCartSilent());
  } catch (error) {
    console.error('syncRemoveSaga error:', error);
    yield put(actions.fetchCart());
  }
}

export function* watchCart(apiService: ApiService) {
  yield takeLatest(actions.fetchCart.type, fetchCartSaga, apiService);
  yield takeLatest(actions.fetchCartSilent.type, fetchCartSilentSaga, apiService);
  yield takeEvery(actions.addToCart.type, syncAddToCartSaga, apiService);
  yield takeEvery(actions.decreaseQuantity.type, syncDecreaseSaga, apiService);
  yield takeEvery(actions.removeFromCart.type, syncRemoveSaga, apiService);
}
