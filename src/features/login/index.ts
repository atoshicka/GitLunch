import { watchLogin } from './saga';
import { selectors } from './selectors';
import { actions, name, reducer } from './slice';
import { LoginForm } from './ui/login-form';
import { validateLoginForm } from './utils';

export const LoginFeature = {
  actions,
  sagas: {
    watchLogin,
  },
  reducer,
  sliceName: name,
  selectors,
  ui: {
    LoginForm,
  },
  utils: {
    validateLoginForm,
  },
};
