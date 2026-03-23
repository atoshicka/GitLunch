import { call, getContext, put, takeLatest } from 'redux-saga/effects';
import { ApiService } from '../../entities/api';
import { PromoDish, Restaurant } from '../../entities/api/types/home-types';
import {
  fetchPromoDishesSuccess,
  fetchRestaurantsFailure,
  fetchRestaurantsStart,
  fetchRestaurantsSuccess,
} from './slice';

function* fetchRestaurantsSaga() {
  try {
    const apiService: ApiService = yield getContext('apiService');

    yield put(fetchRestaurantsStart());

    const restaurants: Restaurant[] = yield call([apiService, apiService.getRestaurants]);
    yield put(fetchRestaurantsSuccess(restaurants));

    const promoDishes: PromoDish[] = yield call([apiService, apiService.getPromoDishes]);
    yield put(fetchPromoDishesSuccess(promoDishes));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки данных';
    yield put(fetchRestaurantsFailure(errorMessage));
  }
}

export function* watchHome() {
  yield takeLatest('home/fetchRestaurants', fetchRestaurantsSaga);
}
