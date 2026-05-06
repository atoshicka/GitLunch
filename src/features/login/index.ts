import { LoginForm } from '../../screens/login-screen/login-form';
import { watchLogin } from './saga';
import { selectors } from './selectors';
import { actions, name, reducer } from './slice';

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
};
