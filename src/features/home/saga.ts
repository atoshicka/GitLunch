import { call, getContext, put, takeLatest } from 'redux-saga/effects';
import { ApiService } from '../../entities/api';
import { PromoDish, Restaurant } from '../../entities/api/types/home-types';
import { actions } from './slice';

function* fetchRestaurantsSaga() {
  try {
    const apiService: ApiService = yield getContext('apiService');

    yield put(actions.fetchRestaurantsStart());

    const restaurants: Restaurant[] = yield call([apiService, apiService.getRestaurants]);
    yield put(actions.fetchRestaurantsSuccess(restaurants));

    const promoDishes: PromoDish[] = yield call([apiService, apiService.getPromoDishes]);
    yield put(actions.fetchPromoDishesSuccess(promoDishes));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка загрузки данных';
    yield put(actions.fetchRestaurantsFailure(message));
  }
}

export function* watchHome() {
  yield takeLatest(actions.fetchRestaurants.type, fetchRestaurantsSaga);
}
