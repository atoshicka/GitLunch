import { createSelector } from '@reduxjs/toolkit';
import { name } from './slice';
import { LoginState } from './types';

interface State {
  [name]: LoginState;
}

const root = (state: State) => state[name];

export const selectLogin = createSelector(root, (loginSlice) => loginSlice.login);
export const selectPassword = createSelector(root, (loginSlice) => loginSlice.password);
export const selectUserName = createSelector(root, (loginSlice) => loginSlice.userName);
export const selectErrors = createSelector(root, (loginSlice) => loginSlice.errors);
export const selectLoginError = createSelector(root, (loginSlice) => loginSlice.errors.login);
export const selectPasswordError = createSelector(root, (loginSlice) => loginSlice.errors.password);
export const selectGeneralError = createSelector(root, (loginSlice) => loginSlice.errors.general);
export const selectIsLoading = createSelector(root, (loginSlice) => loginSlice.isLoading);
export const selectIsAuthenticated = createSelector(
  root,
  (loginSlice) => loginSlice.isAuthenticated
);
export const selectToken = createSelector(root, (loginSlice) => loginSlice.token);
