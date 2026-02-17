// features/login/index.ts

import { watchLogin } from './login/store/loginSaga';
import loginReducer from './login/store/loginSlice';
import type { LoginFormData, LoginFormErrors, LoginFormProps } from './login/types';
import { LoginForm } from './login/ui/login-form';
import { useLoginForm } from './login/use-login-form';
import { validateLoginForm } from './login/validation';

// Единый объект для логина
export const LoginFeature = {
  LoginForm,
  useLoginForm,
  reducer: loginReducer,
  saga: watchLogin,
  validate: validateLoginForm,
};

export { LoginForm, loginReducer, useLoginForm, validateLoginForm, watchLogin };

export type { LoginFormData, LoginFormErrors, LoginFormProps };
