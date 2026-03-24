import { watchLogin } from './saga';
import {
  selectErrors,
  selectGeneralError,
  selectIsAuthenticated,
  selectIsLoading,
  selectLogin,
  selectLoginError,
  selectPassword,
  selectPasswordError,
  selectToken,
  selectUserName,
} from './selectors';
import { name, actions, reducer } from './slice';
import { LoginForm } from './ui/login-form';
import { validateLoginForm } from './utils';

// export { watchLogin } from './saga';
// export {
//   selectErrors,
//   selectGeneralError,
//   selectIsAuthenticated,
//   selectIsLoading,
//   selectLogin,
//   selectLoginError,
//   selectPassword,
//   selectPasswordError,
//   selectToken,
//   selectUserName,
// } from './selectors';
// export { LOGIN_SLICE_NAME } from './slice';
// export { LoginForm } from './ui/login-form';
// export { validateLoginForm } from './utils';

export const LoginFeature = {
  actions,
  sagas: {
    init: watchLogin,
  },
  reducer: {
    [name]: reducer,
  },
  selectors: {
    selectLogin,
    selectPassword,
    selectUserName,
    selectErrors,
    selectLoginError,
    selectPasswordError,
    selectGeneralError,
    selectIsLoading,
    selectIsAuthenticated,
    selectToken,
  },
  ui: {
    LoginForm,
  },
  utils: {
    validateLoginForm,
  },
};
