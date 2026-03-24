import React, { useCallback } from 'react';
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { LoginFeature } from '..';
import { Images } from '../../../shared/constants/images';
import { Typography } from '../../../shared/fontsFile/fonts';
import { LoginFormData } from '../types';
import { styles } from './login-styles';

export const LoginForm: React.FC = () => {
  const dispatch = useDispatch();

  const loginValue = useSelector(LoginFeature.selectors.selectLogin);
  const passwordValue = useSelector(LoginFeature.selectors.selectPassword);
  const fieldErrors = useSelector(LoginFeature.selectors.selectErrors);
  const isSubmitting = useSelector(LoginFeature.selectors.selectIsLoading);
  const isLoggedIn = useSelector(LoginFeature.selectors.selectIsAuthenticated);

  const handleLoginChange = useCallback(
    (text: string) => {
      dispatch(LoginFeature.actions.setLogin(text));
    },
    [dispatch]
  );

  const handlePasswordChange = useCallback(
    (text: string) => {
      dispatch(LoginFeature.actions.setPassword(text));
    },
    [dispatch]
  );

  const handleLoginSubmit = useCallback(() => {
    const formData: LoginFormData = {
      login: loginValue,
      password: passwordValue,
    };
    const validationErrors = LoginFeature.utils.validateLoginForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      dispatch(LoginFeature.actions.loginFailure(validationErrors));
      return;
    }

    Keyboard.dismiss();
    dispatch(LoginFeature.actions.submitLogin());
  }, [dispatch, loginValue, passwordValue]);

  const Vector1Svg = Images.auth.vector1;
  const Vector2Svg = Images.auth.vector2;
  const LogoSvg = Images.auth.logo;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Vector2Svg width={330} height={320} style={styles.vectorTopLeft} />
        <Vector1Svg width={290} height={200} style={styles.vectorBottomRight} />

        <View style={styles.logoContainer}>
          <LogoSvg width={100} height={100} />
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
