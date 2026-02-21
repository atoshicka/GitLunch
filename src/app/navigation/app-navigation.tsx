import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';

import { SearchScreen } from '../../features/search/ui/search-screen';
import { AccountScreen } from '../../screens/account-screen/account-screen';
import { BasketScreen } from '../../screens/basket-screen/basket-screen';
import { HomeScreen } from '../../screens/home-screen/home-screen';
import { MenuScreen } from '../../screens/menu-screen/menu-screen';

import { LoginForm } from '../../features/login/ui/login-form';
import { authStyles, navigationStyles } from './navigation-styles';

interface AuthScreenProps {
  onLogin: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView contentContainerStyle={authStyles.scrollContainer}>
        <View style={authStyles.content}>
          <LoginForm onLoginSuccess={onLogin} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const baseScreenOptions = navigationStyles.getScreenOptions();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...baseScreenOptions,
        tabBarIcon: ({ focused, color, size }) => {
          let iconText;
          if (route.name === 'Главная') iconText = '🏠';
          else if (route.name === 'Меню') iconText = '📋';
          else if (route.name === 'Корзина') iconText = '🛒';
          else if (route.name === 'Аккаунт') iconText = '👤';
          else iconText = '❓';

          return <Text style={{ fontSize: size, color }}>{iconText}</Text>;
        },
      })}
    >
      <Tab.Screen name="Главная" component={HomeScreen} options={{ title: 'Главная' }} />
      <Tab.Screen name="Меню" component={MenuScreen} options={{ title: 'Меню' }} />
      <Tab.Screen name="Корзина" component={BasketScreen} options={{ title: 'Корзина' }} />
      <Tab.Screen name="Аккаунт" component={AccountScreen} options={{ title: 'Аккаунт' }} />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Tabs" component={TabNavigator} />
        <RootStack.Screen
          name="Search"
          component={SearchScreen}
          options={{ presentation: 'card' }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
