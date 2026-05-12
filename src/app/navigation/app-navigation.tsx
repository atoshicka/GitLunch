import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { BasketScreen } from '../../screens/basket-screen/basket-screen';
import { LoginForm } from '../../screens/login-screen/login-form';
import { RestaurantAccountScreen } from '../../screens/restaurant-acconut-screen/restaurant-account-screen.tsx';
import { SearchScreen } from '../../screens/search-screen/search-screen';
import { SCREEN_NAMES, TAB_NAMES } from '../../shared/constants/navigation';
import { TabNavigator } from '../../shared/constants/TabNavigator';
import { CustomTabBar } from '../../shared/TabBar/TabBar';

const AuthStack = createNativeStackNavigator();
const ClientStack = createNativeStackNavigator();
const RestaurantTab = createBottomTabNavigator();

export const AuthNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginForm} />
    </AuthStack.Navigator>
  );
};

export const ClientNavigator: React.FC = () => {
  return (
    <ClientStack.Navigator screenOptions={{ headerShown: false }}>
      <ClientStack.Screen name={SCREEN_NAMES.TABS} component={TabNavigator} />
      <ClientStack.Screen
        name={TAB_NAMES.BASKET}
        component={BasketScreen}
        options={{ presentation: 'card' }}
      />
      <ClientStack.Screen name={SCREEN_NAMES.SEARCH} component={SearchScreen} />
    </ClientStack.Navigator>
  );
};

export const RestaurantNavigator: React.FC = () => {
  return (
    <RestaurantTab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <RestaurantTab.Screen
        name={SCREEN_NAMES.RESTAURANT_MAIN}
        component={RestaurantAccountScreen}
      />
    </RestaurantTab.Navigator>
  );
};
