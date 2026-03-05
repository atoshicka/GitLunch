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
