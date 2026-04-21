export interface LoginFormData {
  login: string;
  password: string;
}

export interface LoginFormErrors {
  login?: string;
  password?: string;
  general?: string;
}

export interface LoginState {
  login: string;
  password: string;
  userName: string | null;
  restaurantName: string | null;
  role: string | null;
  restaurantDescription: string | null;
  errors: LoginFormErrors;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
  isRestoring: boolean;
}
