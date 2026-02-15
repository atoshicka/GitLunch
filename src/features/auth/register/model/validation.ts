import { RegisterFormData, RegisterFormErrors } from './types';

export const validateRegisterForm = (formData: RegisterFormData): RegisterFormErrors => {
  const errors: RegisterFormErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[+]?[0-9]{10,15}$/;

  if (!formData.login.trim()) {
    errors.login = 'Это обязательное поле';
  }

  if (!formData.email.trim()) {
    errors.email = 'Это обязательное поле';
  } else if (!emailRegex.test(formData.email)) {
    errors.email = 'Введите корректный email';
  }

  if (!formData.password.trim()) {
    errors.password = 'Это обязательное поле';
  }

  if (!formData.firstName.trim()) {
    errors.firstName = 'Это обязательное поле';
  }

  if (!formData.lastName.trim()) {
    errors.lastName = 'Это обязательное поле';
  }

  if (!formData.phone.trim()) {
    errors.phone = 'Это обязательное поле';
  } else if (!phoneRegex.test(formData.phone)) {
    errors.phone = 'Введите корректный номер телефона';
  }

  return errors;
};
