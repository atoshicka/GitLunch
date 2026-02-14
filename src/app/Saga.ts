//асинхронные операции

import { all } from 'redux-saga/effects';
import { watchAuth } from '../features/auth/store/authSaga';

export function* rootSaga() {
  yield all([watchAuth()]);
}
