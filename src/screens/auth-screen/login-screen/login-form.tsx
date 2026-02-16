import React from 'react';
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { setLogin, setPassword, submitLogin } from '../../../features/auth/store/authSlice';
import { styles } from './login-styles';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const dispatch = useDispatch();

  const { login, password, errors, isLoading, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogin = () => {
    Keyboard.dismiss();
    dispatch(submitLogin());
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      onLoginSuccess();
    }
  }, [isAuthenticated, onLoginSuccess]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>GitLunch</Text>
        <Text style={styles.subtitle}>Вход</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Логин</Text>
            <TextInput
              style={[styles.input, errors.login && styles.inputError]}
              placeholder="Введите логин"
              value={login}
              onChangeText={(text) => dispatch(setLogin(text))}
              autoCapitalize="none"
              editable={!isLoading}
            />
            {errors.login && <Text style={styles.errorText}>{errors.login}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Пароль</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Введите пароль"
              value={password}
              onChangeText={(text) => dispatch(setPassword(text))}
              secureTextEntry
              editable={!isLoading}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          <TouchableOpacity style={[styles.button]} onPress={handleLogin} disabled={isLoading}>
            <Text style={styles.buttonText}>{isLoading ? 'Вход...' : 'Войти'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
