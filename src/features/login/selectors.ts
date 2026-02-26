import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

const selectLoginSlice = (state: RootState) => state.login;

export const selectLogin = createSelector(selectLoginSlice, (loginSlice) => loginSlice.login);

export const selectPassword = createSelector(selectLoginSlice, (loginSlice) => loginSlice.password);

export const selectUserName = createSelector(selectLoginSlice, (loginSlice) => loginSlice.userName);

export const selectErrors = createSelector(selectLoginSlice, (loginSlice) => loginSlice.errors);

export const selectIsLoading = createSelector(
  selectLoginSlice,
  (loginSlice) => loginSlice.isLoading
);

export const selectIsAuthenticated = createSelector(
  selectLoginSlice,
  (loginSlice) => loginSlice.isAuthenticated
);
