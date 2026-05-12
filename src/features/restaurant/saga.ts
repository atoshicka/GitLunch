import { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';
import { ApiService } from '../../entities/api';
import { BackendRestaurantProfile } from '../../entities/api/types/restaurant-types';
import { actions } from './slice';

function* handleFetchRestaurantProfile(apiService: ApiService): SagaIterator {
  try {
    const profile: BackendRestaurantProfile = yield call([
      apiService,
      apiService.getRestaurantProfile,
    ]);
    yield put(actions.fetchRestaurantProfileSuccess(profile));
  } catch (error) {
    console.log('RESTAURANT PROFILE ERROR:', error);
  }
}

export function* watchRestaurant(apiService: ApiService): SagaIterator {
  yield takeLatest(actions.fetchRestaurantProfile.type, handleFetchRestaurantProfile, apiService);
}
