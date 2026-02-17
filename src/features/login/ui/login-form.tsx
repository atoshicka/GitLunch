import React from 'react';
import {
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectErrors,
  selectIsAuthenticated,
  selectIsLoading,
  selectLogin,
  selectPassword,
} from '../../../features/login/store/selectors';
import { setLogin, setPassword, submitLogin } from '../store/loginSlice';
import { styles } from './login-styles';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const dispatch = useDispatch();

  const loginValue = useSelector(selectLogin);
  const passwordValue = useSelector(selectPassword);
  const fieldErrors = useSelector(selectErrors);
  const isSubmitting = useSelector(selectIsLoading);
  const isLoggedIn = useSelector(selectIsAuthenticated);

  const handleLoginChange = (text: string) => {
    dispatch(setLogin(text));
  };

  const handlePasswordChange = (text: string) => {
    dispatch(setPassword(text));
  };

  const handleLoginSubmit = () => {
    Keyboard.dismiss();
    dispatch(submitLogin());
  };

  React.useEffect(() => {
    if (isLoggedIn) {
      onLoginSuccess();
    }
  }, [isLoggedIn, onLoginSuccess]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Картинка сверху */}
        <Image
          source={require('../../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Форма без белого фона */}
        <View style={styles.form}>
          {/* Поле логина */}
          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, fieldErrors.login && styles.inputError]}
              placeholder="Login"
              placeholderTextColor="#94A3B8"
              value={loginValue}
              onChangeText={handleLoginChange}
              autoCapitalize="none"
              editable={!isSubmitting}
            />
            {fieldErrors.login && <Text style={styles.errorText}>{fieldErrors.login}</Text>}
          </View>

          {/* Поле пароля */}
          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, fieldErrors.password && styles.inputError]}
              placeholder="Password"
              placeholderTextColor="#94A3B8"
              value={passwordValue}
              onChangeText={handlePasswordChange}
              secureTextEntry
              editable={!isSubmitting}
            />
            {fieldErrors.password && <Text style={styles.errorText}>{fieldErrors.password}</Text>}
          </View>

          {/* Кнопка */}
          <TouchableOpacity
            style={[styles.button]}
            onPress={handleLoginSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>{isSubmitting ? 'Вход...' : 'Войти'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
