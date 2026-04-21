import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError } from 'axios';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { ApiService } from '../../entities/api';
import { BackendRestaurantProfile } from '../../entities/api/types/restaurant-types';
import { LoginFeature } from './';
import { actions } from './slice';

function* handleSubmitLogin(apiService: ApiService) {
  try {
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

    yield put(
      actions.loginSuccess({
        token: result.token,
        userName: result.user.full_name,
        role: result.user.role,
      })
    );

    if (result.user.role === 'admin') {
      try {
        const profile: BackendRestaurantProfile = yield call([
          apiService,
          apiService.getRestaurantProfile,
        ]);
        console.log('RESTAURANT PROFILE:', JSON.stringify(profile, null, 2));
        yield put(actions.setRestaurantDescription(profile.description ?? null));
      } catch (e) {
        console.log('RESTAURANT PROFILE ERROR:', e);
      }
    }
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

function* handleRestoreSession(apiService: ApiService) {
  try {
    const token: string | null = yield call([AsyncStorage, 'getItem'], 'token');
    const userJson: string | null = yield call([AsyncStorage, 'getItem'], 'user');

    if (!token || !userJson) {
      yield put(actions.restoreSessionFailure());
      return;
    }

    const user = JSON.parse(userJson);
    yield put(
      actions.restoreSessionSuccess({
        token,
        userName: user.full_name,
        role: user.role,
      })
    );

    if (user.role === 'admin') {
      try {
        const profile: BackendRestaurantProfile = yield call([
          apiService,
          apiService.getRestaurantProfile,
        ]);
        yield put(actions.setRestaurantDescription(profile.description ?? null));
      } catch {}
    }
  } catch {
    yield call([AsyncStorage, 'removeItem'], 'token');
    yield call([AsyncStorage, 'removeItem'], 'user');
    yield put(actions.restoreSessionFailure());
  }
}

export function* watchLogin(apiService: ApiService) {
  yield takeLatest(actions.submitLogin.type, handleSubmitLogin, apiService);
  yield takeLatest(actions.logoutRequest.type, handleLogout);
  yield takeLatest(actions.restoreSession.type, handleRestoreSession, apiService);
}
