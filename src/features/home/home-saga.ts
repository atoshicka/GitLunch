import { put, takeLatest } from 'redux-saga/effects';
import { MOCK_DISHES } from '../../../mocks';
import { ApiService } from '../../entities/api';
import {
  fetchPromoDishesSuccess,
  fetchRestaurantsFailure,
  fetchRestaurantsStart,
  fetchRestaurantsSuccess,
} from './home-slice';

const MOCK_RESTAURANTS = [
  { id: '1', name: 'Цезарь' },
  { id: '2', name: 'Ресторан 2' },
];

function* fetchRestaurantsSaga(apiService: ApiService) {
  try {
    yield put(fetchRestaurantsStart());

    // const { data } = yield call(apiService.getRestaurants);
    // yield put(fetchRestaurantsSuccess(data));

    // const { data: promoData } = yield call(apiService.getPromoDishes);
    // yield put(fetchPromoDishesSuccess(promoData));

    // мок - временно
    yield put(fetchRestaurantsSuccess(MOCK_RESTAURANTS));

    const promoDishes = MOCK_DISHES.filter((dish) => dish.isPromo).map((dish) => ({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      isPromo: true,
    }));

    yield put(fetchPromoDishesSuccess(promoDishes));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки данных';
    yield put(fetchRestaurantsFailure(errorMessage));
  }
}

export function* watchHome(apiService: ApiService) {
  yield takeLatest('home/fetchRestaurants', fetchRestaurantsSaga, apiService);
}
