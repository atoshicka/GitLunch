import { delay, put, select, takeLatest } from 'redux-saga/effects';
import { RootState } from '../../../app/store';
import { loginFailure, loginSuccess, submitLogin } from './authSlice';

//валидация формы
const validateForm = (login: string, password: string) => {
  const errors: { login?: string; password?: string } = {};

  if (!login.trim()) {
    errors.login = 'Это обязательное поле';
  }

  if (!password.trim()) {
    errors.password = 'Это обязательное поле';
  } else if (password.length < 6) {
    errors.password = 'Пароль должен быть не менее 6 символов';
  }

  return errors;
};

//сага для обработки сабмита
function* handleSubmitLogin() {
  try {
    //получаем текущие значения из Redux state
    const login: string = yield select((state: RootState) => state.auth.login);
    const password: string = yield select((state: RootState) => state.auth.password);

    //валидация
    const errors = validateForm(login, password);
    if (Object.keys(errors).length > 0) {
      yield put(loginFailure(errors));
      return;
    }
    yield delay(1000);
    yield put(loginSuccess());
  } catch (error) {
    yield put(loginFailure({ login: 'Ошибка сервера' }));
  }
}

export function* watchAuth() {
  yield takeLatest(submitLogin.type, handleSubmitLogin);
}
