import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError } from 'axios';
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { ApiService } from '../../entities/api';
import { api } from '../../entities/api/axios-config';
import { RestaurantFeature } from '../restaurant';
import { LoginFeature } from './';
import { actions, VALIDATION_MESSAGES } from './slice';

function* handleSubmitLogin(apiService: ApiService): SagaIterator {
  try {
    const login: string = yield select(LoginFeature.selectors.selectLogin);
    const password: string = yield select(LoginFeature.selectors.selectPassword);

    const errors: Record<string, string> = {};
    if (!login.trim()) errors.login = VALIDATION_MESSAGES.REQUIRED_LOGIN;
    if (!password.trim()) errors.password = VALIDATION_MESSAGES.REQUIRED_PASSWORD;

    if (Object.keys(errors).length > 0) {
      yield put(actions.loginFailure(errors));
      return;
    }

    const result: Awaited<ReturnType<ApiService['login']>> = yield call(
      [apiService, apiService.login],
      login,
      password
    );

    if (!result.token) {
      yield put(actions.loginFailure({ general: VALIDATION_MESSAGES.REQUEST_ERROR }));
      return;
    }

    yield call([AsyncStorage, 'setItem'], 'token', result.token);
    yield call([AsyncStorage, 'setItem'], 'user', JSON.stringify(result.user));

    api.defaults.headers.Authorization = `Bearer ${result.token}`;

    yield put(
      actions.loginSuccess({
        token: result.token,
        userName: result.user.full_name,
        role: result.user.role,
      })
    );

    if (result.user.role === 'admin') {
      yield put(RestaurantFeature.actions.fetchRestaurantProfile());
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof AxiosError && error.response?.status === 401
        ? VALIDATION_MESSAGES.INVALID_CREDENTIALS
        : VALIDATION_MESSAGES.REQUEST_ERROR;
    yield put(actions.loginFailure({ general: errorMessage }));
  }
}

function* handleLogout(): SagaIterator {
  yield call([AsyncStorage, 'removeItem'], 'token');
  yield call([AsyncStorage, 'removeItem'], 'user');
  delete api.defaults.headers.Authorization;
  yield put(actions.logout());
  yield put(RestaurantFeature.actions.resetRestaurant());
}

function* handleRestoreSession(): SagaIterator {
  try {
    const token: string | null = yield call([AsyncStorage, 'getItem'], 'token');
    const userJson: string | null = yield call([AsyncStorage, 'getItem'], 'user');

    if (!token || !userJson) {
      yield put(actions.restoreSessionFailure());
      return;
    }

    const user = JSON.parse(userJson);
    api.defaults.headers.Authorization = `Bearer ${token}`;

    yield put(
      actions.restoreSessionSuccess({
        token,
        userName: user.full_name,
        role: user.role,
      })
    );

    if (user.role === 'admin') {
      yield put(RestaurantFeature.actions.fetchRestaurantProfile());
    }
  } catch {
    yield call([AsyncStorage, 'removeItem'], 'token');
    yield call([AsyncStorage, 'removeItem'], 'user');
    delete api.defaults.headers.Authorization;
    yield put(actions.restoreSessionFailure());
    yield put(RestaurantFeature.actions.resetRestaurant());
  }
}

export function* watchLogin(apiService: ApiService): SagaIterator {
  yield takeLatest(actions.submitLogin.type, handleSubmitLogin, apiService);
  yield takeLatest(actions.logoutRequest.type, handleLogout);
  yield takeLatest(actions.restoreSession.type, handleRestoreSession);
}
