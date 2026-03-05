import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoginState {
  login: string;
  password: string;
  userName: string;
  errors: {
    login?: string;
    password?: string;
    general?: string;
  };
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
}

const initialState: LoginState = {
  login: '',
  password: '',
  userName: '',
  errors: {},
  isLoading: false,
  isAuthenticated: false,
  token: null,
};

const loginSlice = createSlice({
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
    },
    loginFailure: (
      state,
      action: PayloadAction<{ login?: string; password?: string; general?: string }>
    ) => {
      state.isLoading = false;
      state.errors = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userName = '';
      state.token = null;
    },
  },
});

export const { name: LOGIN_SLICE_NAME, actions, reducer } = loginSlice;

export const { setLogin, setPassword, submitLogin, loginSuccess, loginFailure, logout } = actions;
