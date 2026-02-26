import { all, call } from 'redux-saga/effects';
import { createApiService } from '../entities/api/api-interface';
import { api } from '../entities/api/axios-config';
import { watchLogin } from '../features/login/login-saga';

const apiService = createApiService(api);

export function* rootSaga() {
  yield all([call(watchLogin, apiService)]);
}
