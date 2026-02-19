import { all } from 'redux-saga/effects';
import { api } from '../entities/api/axios-config';
import { watchLogin } from '../features/login/store/login-saga';

export function* rootSaga() {
  yield all([watchLogin(api)]);
}
