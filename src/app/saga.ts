import { all, call } from 'redux-saga/effects';
import { createApiService } from '../entities/api/api-interface';
import { api } from '../entities/api/axios-config';
import { HomeFeature } from '../features/home';
import { LoginFeature } from '../features/login';

const apiService = createApiService(api);

export function* rootSaga() {
  yield all([
    call(LoginFeature.sagas.watchLogin, apiService),
    call(HomeFeature.sagas.watchHome, apiService),
  ]);
}
