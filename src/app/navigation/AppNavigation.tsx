import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Text } from 'react-native';

import { AccountScreen } from '../../screens/accountScreen/AccountScreen';
import { HomeScreen } from '../../screens/homeScreen/HomeScreen';
import { MenuScreen } from '../../screens/menuScreen/MenuScreen';
import { SettingsScreen } from '../../screens/settingsScreen/SettingsScreen';
import { navigationStyles } from './navigationStyles';

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
