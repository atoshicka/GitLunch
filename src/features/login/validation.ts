import { LoginFormData, LoginFormErrors } from './types';

export const validateLoginForm = (formData: LoginFormData): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  if (!formData.login.trim()) {
    errors.login = 'Это обязательное поле';
  }

  if (!formData.password.trim()) {
    errors.password = 'Это обязательное поле';
  } else if (formData.password.length < 6) {
    errors.password = 'Пароль должен быть не менее 6 символов';
  }

  return errors;
};
