//асинхронные операции
import { all } from 'redux-saga/effects';
import { watchLogin } from '../features/login/store/loginSaga';

export function* rootSaga() {
  yield all([watchLogin()]);
}
