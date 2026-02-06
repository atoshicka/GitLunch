import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { LoginForm } from '../loginScreen/LoginForm';
import { RegisterForm } from '../signUpScreen/SignUpForm';
import { AuthMode } from '../typesAuth';
import { styles } from './authStyles';

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
