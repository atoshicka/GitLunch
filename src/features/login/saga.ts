import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError } from 'axios';
import { getContext, put } from 'redux-saga/effects';
import { call, select, takeLatest } from 'typed-redux-saga';

import { ApiService } from '../../entities/api';
import { LoginFeature } from './';
import { actions } from './slice';

function* handleSubmitLogin() {
  try {
    const apiService: ApiService = yield getContext('apiService');
    const login = yield* select(LoginFeature.selectors.selectLogin);
    const password = yield* select(LoginFeature.selectors.selectPassword);

    const result = yield* call(apiService.login, login, password);

    if (!result.token) {
      yield put(actions.loginFailure({ general: 'Ошибка при выполнении запроса' }));
      return;
    }

    yield* call([AsyncStorage, 'setItem'], 'token', result.token);
    yield* call([AsyncStorage, 'setItem'], 'user', JSON.stringify(result.user));

    yield put(actions.loginSuccess({ token: result.token, userName: result.user.full_name }));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof AxiosError && error.response?.status === 401
        ? 'Неправильный логин или пароль'
        : 'Ошибка при выполнении запроса';

    yield put(actions.loginFailure({ general: errorMessage }));
  }
}

export function* watchLogin() {
  yield* takeLatest(actions.submitLogin.type, handleSubmitLogin);
}
