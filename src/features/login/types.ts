export interface LoginFormErrors {
  login?: string;
  password?: string;
  general?: string;
}

export interface LoginState {
  login: string;
  password: string;
  userName: string | null;
  role: string | null;
  errors: LoginFormErrors;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
  isRestoring: boolean;
}
