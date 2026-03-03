import { watchLogin } from './login-saga';
import loginReducer, * as loginActions from './login-slice';
import * as loginSelectors from './selectors';
import type { LoginFormData, LoginFormErrors, LoginFormProps } from './types';
import { LoginForm } from './ui/login-form';
import { validateLoginForm } from './validation';

export const LOGIN_SLICE_NAME = 'login';

export const LoginFeature = {
  actions: loginActions,
  sagas: {
    watchLogin,
  },
  reducer: {
    [LOGIN_SLICE_NAME]: loginReducer,
  },
  selectors: loginSelectors,
  ui: {
    LoginForm,
  },
  utils: {
    validateLoginForm,
  },
};

export * from './login-slice';
export * from './selectors';
export { LoginForm, loginReducer, validateLoginForm, watchLogin };
export type { LoginFormData, LoginFormErrors, LoginFormProps };
