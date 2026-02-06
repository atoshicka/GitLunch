import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { styles } from './signUpStyles';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSwitchToLogin,
  onRegisterSuccess,
}) => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[0-9]{10,15}$/;

    if (!formData.login.trim()) {
      newErrors.login = 'Это обязательное поле';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Это обязательное поле';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Это обязательное поле';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Это обязательное поле';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Это обязательное поле';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    Keyboard.dismiss();

    if (validateForm()) {
      onRegisterSuccess();
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.title}>GitLunch</Text>
          <Text style={styles.subtitle}>Регистрация</Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Имя</Text>
              <TextInput
                style={[styles.input, errors.firstName && styles.inputError]}
                placeholder="Введите ваше имя"
                value={formData.firstName}
                onChangeText={(text) => handleInputChange('firstName', text)}
                autoCapitalize="words"
              />
              {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Фамилия</Text>
              <TextInput
                style={[styles.input, errors.lastName && styles.inputError]}
                placeholder="Введите вашу фамилию"
                value={formData.lastName}
                onChangeText={(text) => handleInputChange('lastName', text)}
                autoCapitalize="words"
              />
              {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Введите ваш email"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Номер телефона</Text>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="+7 (999) 999-99-99"
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
                keyboardType="phone-pad"
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Логин</Text>
              <TextInput
                style={[styles.input, errors.login && styles.inputError]}
                placeholder="Придумайте логин"
                value={formData.login}
                onChangeText={(text) => handleInputChange('login', text)}
                autoCapitalize="none"
              />
              {errors.login && <Text style={styles.errorText}>{errors.login}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Пароль</Text>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Придумайте пароль"
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
                secureTextEntry
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Зарегистрироваться</Text>
            </TouchableOpacity>

            <View style={styles.switchContainer}>
              <Text style={styles.switchText}>Уже есть аккаунт? </Text>
              <TouchableOpacity onPress={onSwitchToLogin}>
                <Text style={styles.switchLink}>Войти</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};
