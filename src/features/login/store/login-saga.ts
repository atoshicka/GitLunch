import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError } from 'axios';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { ApiService } from '../../../entities/api';
import { validateLoginForm } from '../validation';
import { loginFailure, loginSuccess, submitLogin } from './login-slice';
import { selectLogin, selectPassword } from './selectors';

function* handleSubmitLogin(apiService: ApiService) {
  try {
    const login: string = yield select(selectLogin);
    const password: string = yield select(selectPassword);

    const errors = validateLoginForm({ login, password });

    if (Object.keys(errors).length > 0) {
      yield put(loginFailure(errors));
      return;
    }

    const result: { success: boolean; token: string; user: { full_name: string } } = yield call(
      apiService.login,
      login,
      password
    );

    if (result.token) {
      yield call([AsyncStorage, 'setItem'], 'token', result.token);
      yield call([AsyncStorage, 'setItem'], 'user', JSON.stringify(result.user));

      yield put(
        loginSuccess({
          token: result.token,
          userName: result.user.full_name,
        })
      );
    } else {
      yield put(loginFailure({ general: 'Ошибка при выполнении запроса' }));
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      yield put(loginFailure({ general: 'Неправильный логин или пароль' }));
    } else {
      yield put(loginFailure({ general: 'Ошибка при выполнении запроса' }));
    }
  }
}

export function* watchLogin(apiService: ApiService) {
  yield takeLatest(submitLogin.type, handleSubmitLogin, apiService);
}
