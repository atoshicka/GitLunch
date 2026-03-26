import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError } from 'axios';
import { call, getContext, put, select, takeLatest } from 'redux-saga/effects';
import { ApiService } from '../../entities/api';
import { LoginFeature } from './';
import { actions } from './slice';

function* handleSubmitLogin() {
  try {
    const apiService: ApiService = yield getContext('apiService');
    const login: string = yield select(LoginFeature.selectors.selectLogin);
    const password: string = yield select(LoginFeature.selectors.selectPassword);

    const result: Awaited<ReturnType<ApiService['login']>> = yield call(
      [apiService, apiService.login],
      login,
      password
    );

    if (!result.token) {
      yield put(actions.loginFailure({ general: 'Ошибка при выполнении запроса' }));
      return;
    }

    yield call([AsyncStorage, 'setItem'], 'token', result.token);
    yield call([AsyncStorage, 'setItem'], 'user', JSON.stringify(result.user));

    yield put(actions.loginSuccess({ token: result.token, userName: result.user.full_name }));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof AxiosError && error.response?.status === 401
        ? 'Неправильный логин или пароль'
        : 'Ошибка при выполнении запроса';

    yield put(actions.loginFailure({ general: errorMessage }));
  }
}

function* handleLogout() {
  yield call([AsyncStorage, 'removeItem'], 'token');
  yield call([AsyncStorage, 'removeItem'], 'user');
  yield put(actions.logout());
}

export function* watchLogin() {
  yield takeLatest(actions.submitLogin.type, handleSubmitLogin);
  yield takeLatest(actions.logout.type, handleLogout);
}
