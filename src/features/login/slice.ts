import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginFormErrors, LoginState } from './types';

const initialState: LoginState = {
  login: '',
  password: '',
  userName: null,
  errors: {},
  isLoading: false,
  isAuthenticated: false,
  token: null,
  isRestoring: true,
};

export const { name, actions, reducer } = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<string>) => {
      state.login = action.payload;
      if (state.errors.login) {
        state.errors.login = undefined;
      }
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
      if (state.errors.password) {
        state.errors.password = undefined;
      }
    },
    submitLogin: (state) => {
      state.isLoading = true;
      state.errors = {};
    },
    loginSuccess: (state, action: PayloadAction<{ token: string; userName: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.userName = action.payload.userName;
      state.login = '';
      state.password = '';
      state.errors = {};
      state.isRestoring = false;
    },
    loginFailure: (state, action: PayloadAction<LoginFormErrors>) => {
      state.isLoading = false;
      state.errors = action.payload;
      state.isRestoring = false;
    },
    logoutRequest: () => {},
    logout: (state) => {
      state.isAuthenticated = false;
      state.userName = null;
      state.token = null;
      state.isRestoring = false;
    },
    restoreSessionSuccess: (state, action: PayloadAction<{ token: string; userName: string }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.userName = action.payload.userName;
      state.isRestoring = false;
    },
    restoreSessionFailure: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.userName = null;
      state.isRestoring = false;
    },
  },
});
