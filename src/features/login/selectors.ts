import { createSelector } from '@reduxjs/toolkit';
import { name } from './slice';
import { LoginState } from './types';

interface State {
  [name]: LoginState;
}

const root = (state: State) => state[name];

 const selectLogin = createSelector(root, (loginSlice) => loginSlice.login);
 const selectPassword = createSelector(root, (loginSlice) => loginSlice.password);
 const selectUserName = createSelector(root, (loginSlice) => loginSlice.userName);
 const selectErrors = createSelector(root, (loginSlice) => loginSlice.errors);
 const selectLoginError = createSelector(root, (loginSlice) => loginSlice.errors.login);
 const selectPasswordError = createSelector(root, (loginSlice) => loginSlice.errors.password);
 const selectGeneralError = createSelector(root, (loginSlice) => loginSlice.errors.general);
export const selectIsLoading = createSelector(root, (loginSlice) => loginSlice.isLoading);
export const selectIsAuthenticated = createSelector(
  root,
  (loginSlice) => loginSlice.isAuthenticated
);
 const selectToken = createSelector(root, (loginSlice) => loginSlice.token);

export const selectors = {
  //
}
