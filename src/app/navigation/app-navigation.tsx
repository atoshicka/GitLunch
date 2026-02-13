import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text } from 'react-native';

//общая навигация
import { AccountScreen } from '../../screens/account-screen/account-screen';
import { HomeScreen } from '../../screens/home-screen/home-screen';
import { MenuScreen } from '../../screens/menu-screen/menu-screen';
import { SettingsScreen } from '../../screens/settings-screen/settings-screen';

//авторизация
import { SafeAreaView, ScrollView, View } from 'react-native';
import { AuthMode } from '../../entities/auth/types-auth';
import { RegisterForm } from '../../features/auth/register/ui/RegisterForm';
import { LoginForm } from '../../screens/auth-screen/login-screen/login-form';

//стили
import { authStyles, navigationStyles } from './navigation-styles';

interface AuthScreenProps {
  onLogin: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');

  const switchToRegister = () => setMode('register');
  const switchToLogin = () => setMode('login');

  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView contentContainerStyle={authStyles.scrollContainer}>
        <View style={authStyles.content}>
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

const Tab = createBottomTabNavigator();

export const AppNavigator: React.FC = () => {
  const baseScreenOptions = navigationStyles.getScreenOptions();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          ...baseScreenOptions,
          tabBarIcon: ({ focused, color, size }) => {
            let iconText;

            if (route.name === 'Главная') {
              iconText = '🏠';
            } else if (route.name === 'Меню') {
              iconText = '📋';
            } else if (route.name === 'Настройки') {
              iconText = '⚙️';
            } else if (route.name === 'Аккаунт') {
              iconText = '👤';
            } else {
              iconText = '❓';
            }

            return (
              <Text style={navigationStyles.getTabBarIconStyle(focused, color, size)}>
                {iconText}
              </Text>
            );
          },
        })}
      >
        <Tab.Screen
          name="Главная"
          component={HomeScreen}
          options={{
            title: 'GitLunch',
          }}
        />
        <Tab.Screen
          name="Меню"
          component={MenuScreen}
          options={{
            title: 'Меню',
          }}
        />
        <Tab.Screen
          name="Настройки"
          component={SettingsScreen}
          options={{
            title: 'Настройки',
          }}
        />
        <Tab.Screen
          name="Аккаунт"
          component={AccountScreen}
          options={{
            title: 'Аккаунт',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
