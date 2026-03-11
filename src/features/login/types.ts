// Данные формы логина
export interface LoginFormData {
  login: string;
  password: string;
}

// Ошибки формы логина
export interface LoginFormErrors {
  login?: string;
  password?: string;
  general?: string;
}

export interface LoginState {
  login: string;
  password: string;
  userName: string | null;
  errors: LoginFormErrors;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
}
