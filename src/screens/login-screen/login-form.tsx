import React, { useCallback } from 'react';
import {
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { authStyles } from '../../app/navigation/navigation-styles';
import { LoginFeature } from '../../features/login';
import { Images } from '../../shared/constants/images';
import { Typography } from '../../shared/fontsFile/fonts';
import { FormInput } from '../../shared/login-input/form-input';
import { styles } from './login-styles';

export const LoginForm: React.FC = () => {
  const dispatch = useDispatch();

  const loginValue = useSelector(LoginFeature.selectors.selectLogin);
  const passwordValue = useSelector(LoginFeature.selectors.selectPassword);
  const fieldErrors = useSelector(LoginFeature.selectors.selectErrors);
  const isSubmitting = useSelector(LoginFeature.selectors.selectIsLoading);

  const handleLoginSubmit = useCallback(() => {
    Keyboard.dismiss();
    dispatch(LoginFeature.actions.submitLogin());
  }, [dispatch]);

  const Vector1Svg = Images.auth.vector1;
  const Vector2Svg = Images.auth.vector2;
  const LogoSvg = Images.auth.logo;

  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView contentContainerStyle={authStyles.scrollContainer}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={authStyles.content}>
            <View style={styles.container}>
              <Vector2Svg width={330} height={320} style={styles.vectorTopLeft} />
              <Vector1Svg width={290} height={200} style={styles.vectorBottomRight} />

              <View style={styles.logoContainer}>
                <LogoSvg width={100} height={100} />
                <Text style={styles.logoTextAgbalumo}>GitLunch</Text>
              </View>

              <View style={styles.form}>
                <FormInput
                  placeholder="Login"
                  value={loginValue}
                  onChangeText={(text) => dispatch(LoginFeature.actions.setLogin(text))}
                  error={fieldErrors.login}
                  autoCapitalize="none"
                  editable={!isSubmitting}
                />

                <FormInput
                  placeholder="Password"
                  value={passwordValue}
                  onChangeText={(text) => dispatch(LoginFeature.actions.setPassword(text))}
                  error={fieldErrors.password}
                  secureTextEntry
                  editable={!isSubmitting}
                />

                {fieldErrors.general && (
                  <Text style={[styles.generalError, Typography.bodySmall]}>
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
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
};
