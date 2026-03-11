import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError } from 'axios';
import { call, getContext, put, select, takeLatest } from 'redux-saga/effects';
import { ApiService } from '../../entities/api';
import { selectLogin, selectPassword } from './selectors';
import { actions } from './slice';

const { loginFailure, loginSuccess, submitLogin } = actions;

function* handleSubmitLogin() {
  try {
    const apiService: ApiService = yield getContext('apiService');
    const login: string = yield select(selectLogin);
    const password: string = yield select(selectPassword);

    const result: { success: boolean; token: string; user: { full_name: string } } = yield call(
      apiService.login,
      login,
      password
    );

    if (!result.token || !result.success) {
      yield put(loginFailure({ general: 'Ошибка при выполнении запроса' }));
      return;
    }

    yield call([AsyncStorage, 'setItem'], 'token', result.token);
    yield call([AsyncStorage, 'setItem'], 'user', JSON.stringify(result.user));

    yield put(loginSuccess({ token: result.token, userName: result.user.full_name }));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof AxiosError && error.response?.status === 401
        ? 'Неправильный логин или пароль'
        : 'Ошибка при выполнении запроса';

    yield put(loginFailure({ general: errorMessage }));
  }
}

export function* watchLogin() {
  yield takeLatest(submitLogin, handleSubmitLogin);
}
