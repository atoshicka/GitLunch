import { combineReducers } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/store/cart-slice';
import loginReducer from '../features/login/store/login-slice';

export const rootReducer = combineReducers({
  login: loginReducer,
  cart: cartReducer,
});
