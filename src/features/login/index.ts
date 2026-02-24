import type {
  LoginFormData,
  LoginFormErrors,
  LoginFormProps,
} from '../../entities/api/types/login-types';
import { watchLogin } from './store/login-saga';
import loginReducer from './store/login-slice';
import { LoginForm } from './ui/login-form';
import { validateLoginForm } from './validation';

export const LOGIN_SLICE_NAME = 'login';

export const LoginFeature = {
  LoginForm,
  reducer: {
    [LOGIN_SLICE_NAME]: loginReducer,
  },
  saga: watchLogin,
  validate: validateLoginForm,
};

export { LoginForm, loginReducer, validateLoginForm, watchLogin };
export type { LoginFormData, LoginFormErrors, LoginFormProps };
