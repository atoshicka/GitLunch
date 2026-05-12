import { createSelector } from '@reduxjs/toolkit';
import { name } from './slice';
import { LoginState } from './types';

interface State {
  [name]: LoginState;
}

const root = (state: State) => state[name];

const selectLogin = createSelector(root, (rootData) => rootData.login);
const selectPassword = createSelector(root, (rootData) => rootData.password);
const selectUserName = createSelector(root, (rootData) => rootData.userName);
const selectRestaurantName = createSelector(root, (rootData) => rootData.restaurantName);
const selectRole = createSelector(root, (rootData) => rootData.role);
const selectRestaurantDescription = createSelector(
  root,
  (rootData) => rootData.restaurantDescription
);
const selectErrors = createSelector(root, (rootData) => rootData.errors);
const selectLoginError = createSelector(root, (rootData) => rootData.errors.login);
const selectPasswordError = createSelector(root, (rootData) => rootData.errors.password);
const selectGeneralError = createSelector(root, (rootData) => rootData.errors.general);
const selectIsLoading = createSelector(root, (rootData) => rootData.isLoading);
const selectIsAuthenticated = createSelector(root, (rootData) => rootData.isAuthenticated);
const selectToken = createSelector(root, (rootData) => rootData.token);
const selectIsRestoring = createSelector(root, (rootData) => rootData.isRestoring);

export const selectors = {
  selectLogin,
  selectPassword,
  selectUserName,
  selectRestaurantName,
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
