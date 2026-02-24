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

// Пропсы компонента LoginForm
export interface LoginFormProps {
  onLoginSuccess: () => void;
}

// типы для ответа от сервера
export interface LoginResponse {
  token: string;
  user: {
    id: number;
    login: string;
    full_name: string;
    role: string;
  };
}

// типы для запроса
export interface LoginRequest {
  login: string;
  password: string;
}
