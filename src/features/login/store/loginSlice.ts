import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoginState {
  login: string;
  password: string;
  errors: {
    login?: string;
    password?: string;
  };
  isLoading: boolean;
  isAuthenticated: boolean;
}

const initialState: LoginState = {
  login: '',
  password: '',
  errors: {},
  isLoading: false,
  isAuthenticated: false,
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
    loginSuccess: (state) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.login = '';
      state.password = '';
    },
    //ошибка валидации/входа
    loginFailure: (state, action: PayloadAction<{ login?: string; password?: string }>) => {
      state.isLoading = false;
      state.errors = action.payload;
    },
    // Выход
    logout: (state) => {
      state.isAuthenticated = false;
    },
  },
});

export const { setLogin, setPassword, submitLogin, loginSuccess, loginFailure, logout } =
  loginSlice.actions;

export default loginSlice.reducer;
