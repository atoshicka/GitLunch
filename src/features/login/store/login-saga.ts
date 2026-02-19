import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosInstance } from 'axios';
import { call, delay, put, select, takeLatest } from 'redux-saga/effects';
import { LoginResponse } from '../../../entities/api/types/login-types';
import { validateLoginForm } from '../validation';
import { loginFailure, loginSuccess, submitLogin } from './login-slice';
import { selectLogin, selectPassword } from './selectors';

// сага для обработки сабмита - принимаем api как параметр
function* handleSubmitLogin(api: AxiosInstance) {
  try {
    const login: string = yield select(selectLogin);
    const password: string = yield select(selectPassword);

    const errors = validateLoginForm({ login, password });

    if (Object.keys(errors).length > 0) {
      yield put(loginFailure(errors));
      return;
    }

    yield delay(1000);
    const response: { data: LoginResponse } = {
      data: {
        success: true,
        token: 'mock-token-123',
      },
    };

    if (response.data.token) {
      yield call([AsyncStorage, 'setItem'], 'token', response.data.token);
      // передаем токен в loginSuccess
      yield put(loginSuccess({ token: response.data.token }));
    } else {
      // если токена нет
      yield put(loginFailure({ general: 'Ошибка авторизации' }));
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка сервера';
    yield put(loginFailure({ general: errorMessage })); // general а не login
  }
}

export function* watchLogin(api: AxiosInstance) {
  yield takeLatest(submitLogin.type, handleSubmitLogin, api);
}
