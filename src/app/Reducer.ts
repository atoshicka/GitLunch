import { combineReducers } from '@reduxjs/toolkit';
import loginReducer from '../features/login/store/loginSlice';

export const rootReducer = combineReducers({
  login: loginReducer,
});
