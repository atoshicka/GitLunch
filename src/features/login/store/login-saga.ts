import AsyncStorage from '@react-native-async-storage/async-storage';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { validateLoginForm } from '../validation';
import { loginFailure, loginSuccess, submitLogin } from './login-slice';
import { selectLogin, selectPassword } from './selectors';

// Типы для ответа от сервера
interface LoginResponse {
  token: string;
  user: {
    id: number;
    login: string;
    full_name: string;
    role: string;
  };
}

// Функция для запроса к бэкенду
async function fetchLogin(login: string, password: string) {
  try {
    const response = await fetch('http://192.168.31.142:3000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        token: data.token,
        user: data.user,
      };
    } else {
      throw new Error(data.error || 'Неправильный логин или пароль');
    }
  } catch (error) {
    throw new Error('Ошибка подключения к серверу');
  }
}

// Сага для обработки сабмита
function* handleSubmitLogin() {
  try {
    const login: string = yield select(selectLogin);
    const password: string = yield select(selectPassword);

    const errors = validateLoginForm({ login, password });

    if (Object.keys(errors).length > 0) {
      yield put(loginFailure(errors));
      return;
    }

    const result: { success: boolean; token: string; user: LoginResponse['user'] } = yield call(
      fetchLogin,
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
      yield put(loginFailure({ general: 'Ошибка авторизации' }));
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка сервера';
    yield put(loginFailure({ general: errorMessage }));
  }
}

export function* watchLogin() {
  yield takeLatest(submitLogin.type, handleSubmitLogin);
}
