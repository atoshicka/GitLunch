import { all, call } from 'redux-saga/effects';
import { createApiService } from '../entities/api/api-interface';
import { api } from '../entities/api/axios-config';
import { watchHome } from '../features/home';
import { watchLogin } from '../features/login';

const apiService = createApiService(api);

export function* rootSaga() {
  yield all([call(watchLogin, apiService), call(watchHome, apiService)]);
}
