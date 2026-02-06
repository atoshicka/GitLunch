export interface LoginData {
  login: string;
  password: string;
}

export interface RegisterData extends LoginData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export type AuthMode = 'login' | 'register';
