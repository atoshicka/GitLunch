import type {
  LoginFormData,
  LoginFormErrors,
  LoginFormProps,
} from '../entities/api/types/login-types';
import { watchLogin } from './login/store/login-saga';
import loginReducer from './login/store/login-slice';
import { LoginForm } from './login/ui/login-form';
import { validateLoginForm } from './login/validation';

export const LoginFeature = {
  LoginForm,
  reducer: loginReducer,
  saga: watchLogin,
  validate: validateLoginForm,
};

export { LoginForm, loginReducer, validateLoginForm, watchLogin };

export type { LoginFormData, LoginFormErrors, LoginFormProps };
