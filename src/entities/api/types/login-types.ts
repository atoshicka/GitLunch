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
