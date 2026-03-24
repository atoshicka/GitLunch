import { all, fork } from 'redux-saga/effects';
import { CartFeature } from '../features/cart';
import { HomeFeature } from '../features/home';
import { LoginFeature } from '../features/login';
import { MenuFeature } from '../features/menu';

export function* rootSaga() {
  yield all([
    fork(LoginFeature.sagas.watchLogin),
    fork(HomeFeature.sagas.watchHome),
    fork(MenuFeature.sagas.watchMenu),
    fork(CartFeature.sagas.watchCart),
  ]);
}
