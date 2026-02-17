import React from 'react';
import { Keyboard } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectErrors,
  selectIsAuthenticated,
  selectIsLoading,
  selectLogin,
  selectPassword,
} from '../login/store/selectors';
import { LoginFormData } from '../login/types';
import { validateLoginForm } from '../login/validation'; // импортируем валидацию
import { loginFailure, setLogin, setPassword, submitLogin } from './store/loginSlice'; // добавил loginFailure

export const useLoginForm = (onLoginSuccess: () => void) => {
  const dispatch = useDispatch();

  const loginValue = useSelector(selectLogin);
  const passwordValue = useSelector(selectPassword);
  const fieldErrors = useSelector(selectErrors);
  const isSubmitting = useSelector(selectIsLoading);
  const isLoggedIn = useSelector(selectIsAuthenticated);

  // Обработчик отправки формы С ВАЛИДАЦИЕЙ
  const handleLoginSubmit = () => {
    // Собираем данные для валидации
    const formData: LoginFormData = {
      login: loginValue,
      password: passwordValue,
    };

    // Валидируем
    const validationErrors = validateLoginForm(formData);

    // Если есть ошибки - показываем их и НЕ отправляем
    if (Object.keys(validationErrors).length > 0) {
      dispatch(loginFailure(validationErrors));
      return; // ВАЖНО: прерываем отправку
    }

    // Если ошибок нет - отправляем
    Keyboard.dismiss();
    dispatch(submitLogin());
  };

  const handleLoginChange = (text: string) => {
    dispatch(setLogin(text));
  };

  const handlePasswordChange = (text: string) => {
    dispatch(setPassword(text));
  };

  React.useEffect(() => {
    if (isLoggedIn) {
      onLoginSuccess();
    }
  }, [isLoggedIn, onLoginSuccess]);

  return {
    login: loginValue,
    password: passwordValue,
    errors: fieldErrors,
    isLoading: isSubmitting,
    handleLogin: handleLoginSubmit,
    handleInputChange: {
      login: handleLoginChange,
      password: handlePasswordChange,
    },
  };
};
