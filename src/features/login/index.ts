import { watchLogin } from './login-saga';
import { LOGIN_SLICE_NAME, actions, reducer as loginReducer } from './login-slice';
import * as loginSelectors from './selectors';
import { LoginForm } from './ui/login-form';
import { validateLoginForm } from './utils';

export const LoginFeature = {
  actions,
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
