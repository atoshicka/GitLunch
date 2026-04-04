import { all, call, put, takeLatest } from 'redux-saga/effects';
import { ApiService } from '../../entities/api';
import { PromoDish, Restaurant } from '../../entities/api/types/home-types';
import { actions } from './slice';

function* fetchRestaurantsSaga(apiService: ApiService) {
  try {
    yield put(actions.fetchRestaurantsStart());

    const [restaurants, promoDishes]: [Restaurant[], PromoDish[]] = yield all([
      call([apiService, apiService.getRestaurants]),
      call([apiService, apiService.getPromoDishes]),
    ]);

    yield put(actions.fetchRestaurantsSuccess(restaurants));
    yield put(actions.fetchPromoDishesSuccess(promoDishes));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка загрузки данных';
    yield put(actions.fetchRestaurantsFailure(message));
  }
}

export function* watchHome(apiService: ApiService) {
  yield takeLatest(actions.fetchRestaurants.type, fetchRestaurantsSaga, apiService);
}
