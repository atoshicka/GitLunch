export interface RegisterFormData {
  login: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface RegisterFormErrors {
  login?: string;
  password?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess: () => void;
}
