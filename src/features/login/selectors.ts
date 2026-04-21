import { createSelector } from '@reduxjs/toolkit';
import { name } from './slice';
import { LoginState } from './types';

interface State {
  [name]: LoginState;
}

const root = (state: State) => state[name];

const selectLogin = createSelector(root, (s) => s.login);
const selectPassword = createSelector(root, (s) => s.password);
const selectUserName = createSelector(root, (s) => s.userName);
const selectRole = createSelector(root, (s) => s.role);
const selectRestaurantDescription = createSelector(root, (s) => s.restaurantDescription);
const selectErrors = createSelector(root, (s) => s.errors);
const selectLoginError = createSelector(root, (s) => s.errors.login);
const selectPasswordError = createSelector(root, (s) => s.errors.password);
const selectGeneralError = createSelector(root, (s) => s.errors.general);
const selectIsLoading = createSelector(root, (s) => s.isLoading);
const selectIsAuthenticated = createSelector(root, (s) => s.isAuthenticated);
const selectToken = createSelector(root, (s) => s.token);
const selectIsRestoring = createSelector(root, (s) => s.isRestoring);

export const selectors = {
  selectLogin,
  selectPassword,
  selectUserName,
  selectRole,
  selectRestaurantDescription,
  selectErrors,
  selectLoginError,
  selectPasswordError,
  selectGeneralError,
  selectIsLoading,
  selectIsAuthenticated,
  selectToken,
  selectIsRestoring,
};
