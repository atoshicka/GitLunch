import { all, fork } from 'redux-saga/effects';
import { HomeFeature } from '../features/home';
import { LoginFeature } from '../features/login';
import { MenuFeature } from '../screens/menu-screen';

export function* rootSaga() {
  yield all([
    fork(LoginFeature.sagas.watchLogin),
    fork(HomeFeature.sagas.watchHome),
    fork(MenuFeature.sagas.watchMenu),
  ]);
}
