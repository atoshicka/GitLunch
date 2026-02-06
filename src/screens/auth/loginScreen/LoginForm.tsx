import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { styles } from './loginStyles';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onLoginSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!login.trim()) {
      newErrors.login = 'Это обязательное поле';
    }

    if (!password.trim()) {
      newErrors.password = 'Это обязательное поле';
    } else if (password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    Keyboard.dismiss();

    if (validateForm()) {
      onLoginSuccess();
    }
  };

  const handleInputChange = (field: 'login' | 'password', value: string) => {
    if (field === 'login') {
      setLogin(value);
    } else {
      setPassword(value);
    }

    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>GitLunch</Text>
        <Text style={styles.subtitle}>Вход</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Логин или почта</Text>
            <TextInput
              style={[styles.input, errors.login && styles.inputError]}
              placeholder="Введите логин или email"
              value={login}
              onChangeText={(text) => handleInputChange('login', text)}
              autoCapitalize="none"
            />
            {errors.login && <Text style={styles.errorText}>{errors.login}</Text>}
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Пароль</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Введите пароль"
              value={password}
              onChangeText={(text) => handleInputChange('password', text)}
              secureTextEntry
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Забыли пароль?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Войти</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Нет аккаунта? </Text>
            <TouchableOpacity onPress={onSwitchToRegister}>
              <Text style={styles.registerLink}>Зарегистрироваться</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
