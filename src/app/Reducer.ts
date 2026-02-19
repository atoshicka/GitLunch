import { combineReducers } from '@reduxjs/toolkit';
import loginReducer from '../features/login/store/login-slice';

export const rootReducer = combineReducers({
  login: loginReducer,
});
