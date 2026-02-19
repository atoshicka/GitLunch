import { LoginFormData, LoginFormErrors } from '../../entities/api/types/login-types';

export const validateLoginForm = (formData: LoginFormData): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  if (!formData.login.trim()) {
    errors.login = 'Это обязательное поле';
  }

  if (!formData.password.trim()) {
    errors.password = 'Это обязательное поле';
  }

  return errors;
};
