import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoginForm } from '../../features/login/ui/login-form';
import { BasketScreen } from '../../screens/basket-screen/basket-screen';
import { SearchScreen } from '../../screens/search-screen/search-screen';
import { SCREEN_NAMES, TAB_NAMES } from '../../shared/constants/navigation';
import { TabNavigator } from '../../shared/constants/TabNavigator';
import { authStyles } from './navigation-styles';

const RootStack = createNativeStackNavigator();

export const AuthScreen: React.FC = () => {
  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView contentContainerStyle={authStyles.scrollContainer}>
        <View style={authStyles.content}>
          <LoginForm />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {/* Главная точка входа — навигатор с табами */}
        <RootStack.Screen name={SCREEN_NAMES.TABS} component={TabNavigator} />

        {/* Корзина всё еще может открываться как модалка поверх всего */}
        <RootStack.Screen
          name={TAB_NAMES.BASKET}
          component={BasketScreen}
          options={{ presentation: 'card' }}
        />

        <RootStack.Screen name={SCREEN_NAMES.SEARCH} component={SearchScreen} />

        {/* ПРИМЕЧАНИЕ: Orders, Payment и Success удалены отсюда, 
            так как они теперь внутри TabNavigator */}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
