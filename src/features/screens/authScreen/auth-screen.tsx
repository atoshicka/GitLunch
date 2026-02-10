import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { AuthMode } from '../../auth/model/types-auth';
import { LoginForm } from '../../auth/ui/loginScreen/login-form';
import { RegisterForm } from '../../auth/ui/signUpScreen/sign-up-form';
import { styles } from './auth-styles';
interface AuthScreenProps {
  onLogin: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');

  const switchToRegister = () => setMode('register');
  const switchToLogin = () => setMode('login');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          {mode === 'login' ? (
            <LoginForm onSwitchToRegister={switchToRegister} onLoginSuccess={onLogin} />
          ) : (
            <RegisterForm onSwitchToLogin={switchToLogin} onRegisterSuccess={onLogin} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
