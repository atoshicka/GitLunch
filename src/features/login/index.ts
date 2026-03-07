import { watchLogin } from './login-saga';
import { LOGIN_SLICE_NAME, actions, reducer as loginReducer } from './login-slice';
import * as loginSelectors from './selectors';
import { LoginForm } from './ui/login-form';
import { validateLoginForm } from './utils';

export { watchLogin } from './login-saga';
export { LOGIN_SLICE_NAME } from './login-slice';
export { LoginForm } from './ui/login-form';
export { validateLoginForm } from './utils';

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
