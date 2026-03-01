import React, { useCallback, useEffect } from 'react';
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
import { Typography } from '../../../shared/fontsFile/fonts';
import { loginFailure, setLogin, setPassword, submitLogin } from '../login-slice';
import {
  selectErrors,
  selectIsAuthenticated,
  selectIsLoading,
  selectLogin,
  selectPassword,
} from '../selectors';
import { LoginFormData, LoginFormProps } from '../types';
import { validateLoginForm } from '../validation';
import { styles } from './login-styles';

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const dispatch = useDispatch();

  const loginValue = useSelector(selectLogin);
  const passwordValue = useSelector(selectPassword);
  const fieldErrors = useSelector(selectErrors);
  const isSubmitting = useSelector(selectIsLoading);
  const isLoggedIn = useSelector(selectIsAuthenticated);

  const handleLoginChange = useCallback(
    (text: string) => {
      dispatch(setLogin(text));
    },
    [dispatch]
  );

  const handlePasswordChange = useCallback(
    (text: string) => {
      dispatch(setPassword(text));
    },
    [dispatch]
  );

  const handleLoginSubmit = useCallback(() => {
    const formData: LoginFormData = {
      login: loginValue,
      password: passwordValue,
    };

    const validationErrors = validateLoginForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      dispatch(loginFailure(validationErrors));
      return;
    }

    Keyboard.dismiss();
    dispatch(submitLogin());
  }, [dispatch, loginValue, passwordValue]);

  useEffect(() => {
    if (isLoggedIn) {
      onLoginSuccess();
    }
  }, [isLoggedIn, onLoginSuccess]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image
          source={require('../../../assets/images/vector1.png')}
          style={styles.vectorTopLeft}
          resizeMode="contain"
        />

        <Image
          source={require('../../../assets/images/vector2.png')}
          style={styles.vectorBottomRight}
          resizeMode="contain"
        />

        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.logoTextAgbalumo}>GitLunch</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, Typography.bodyRegular, fieldErrors.login && styles.inputError]}
              placeholder="Login"
              placeholderTextColor="#94A3B8"
              value={loginValue}
              onChangeText={handleLoginChange}
              autoCapitalize="none"
              editable={!isSubmitting}
            />
            {fieldErrors.login && (
              <Text style={[styles.errorText, Typography.caption]}>{fieldErrors.login}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <TextInput
              style={[
                styles.input,
                Typography.bodyRegular,
                fieldErrors.password && styles.inputError,
              ]}
              placeholder="Password"
              placeholderTextColor="#94A3B8"
              value={passwordValue}
              onChangeText={handlePasswordChange}
              secureTextEntry
              editable={!isSubmitting}
            />
            {fieldErrors.password && (
              <Text style={[styles.errorText, Typography.caption]}>{fieldErrors.password}</Text>
            )}
          </View>

          {fieldErrors.general && (
            <Text style={[styles.errorText, styles.generalError, Typography.bodySmall]}>
              {fieldErrors.general}
            </Text>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleLoginSubmit}
            disabled={isSubmitting}
          >
            <Text style={[styles.buttonText, Typography.buttonRegular]}>
              {isSubmitting ? 'Вход...' : 'Войти'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
