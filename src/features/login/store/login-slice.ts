import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoginState {
  login: string;
  password: string;
  userName: string;
  errors: {
    login?: string;
    password?: string;
    general?: string; // для ошибок сервера
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
    //экшены для полей ввода
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

    //экшен сабмита (обрабатывается в saga)
    submitLogin: (state) => {
      state.isLoading = true;
      state.errors = {};
    },

    //успешный вход
    loginSuccess: (state, action: PayloadAction<{ token: string; userName: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.userName = action.payload.userName;
      state.login = '';
      state.password = '';
      state.errors = {};
    },
    //ошибка валидации/входа
    loginFailure: (
      state,
      action: PayloadAction<{ login?: string; password?: string; general?: string }>
    ) => {
      state.isLoading = false;
      state.errors = action.payload;
    },
    // Выход
    logout: (state) => {
      state.isAuthenticated = false;
      state.userName = '';
      state.token = null;
    },
  },
});

export const { setLogin, setPassword, submitLogin, loginSuccess, loginFailure, logout } =
  loginSlice.actions;

export default loginSlice.reducer;
