import { RootState } from '../../../app';

export const selectLogin = (state: RootState) => state.login.login;
export const selectPassword = (state: RootState) => state.login.password;
export const selectUserName = (state: RootState) => state.login.userName;
export const selectErrors = (state: RootState) => state.login.errors;
export const selectIsLoading = (state: RootState) => state.login.isLoading;
export const selectIsAuthenticated = (state: RootState) => state.login.isAuthenticated;
