import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginFormErrors, LoginState } from './types';

const initialState: LoginState = {
  login: '',
  password: '',
  userName: null,
  role: null,
  restaurantDescription: null,
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
      if (state.errors.login) state.errors.login = undefined;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
      if (state.errors.password) state.errors.password = undefined;
    },
    submitLogin: (state) => {
      state.isLoading = true;
      state.errors = {};
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ token: string; userName: string; role: string }>
    ) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.userName = action.payload.userName;
      state.role = action.payload.role;
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
    setRestaurantDescription: (state, action: PayloadAction<string | null>) => {
      state.restaurantDescription = action.payload;
    },
    logoutRequest: () => {},
    logout: (state) => {
      state.isAuthenticated = false;
      state.userName = null;
      state.role = null;
      state.restaurantDescription = null;
      state.token = null;
      state.isRestoring = false;
    },
    restoreSession: () => {},
    restoreSessionSuccess: (
      state,
      action: PayloadAction<{ token: string; userName: string; role: string }>
    ) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.userName = action.payload.userName;
      state.role = action.payload.role;
      state.isRestoring = false;
    },
    restoreSessionFailure: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.userName = null;
      state.role = null;
      state.restaurantDescription = null;
      state.isRestoring = false;
    },
  },
});
