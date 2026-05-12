import { watchLogin } from './saga';
import { selectors } from './selectors';
import { actions, name, reducer } from './slice';
import { LoginForm } from './ui/login-form';
import { validateLoginForm } from './utils';

export const LOGIN_SLICE_NAME = name;

export const LoginFeature = {
  actions,
  sagas: {
    watchLogin,
  },
  reducer: {
    [name]: reducer,
  },
  selectors,
  ui: {
    LoginForm,
  },
  utils: {
    validateLoginForm,
  },
};
