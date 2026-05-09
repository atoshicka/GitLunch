import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { RestaurantAccountScreen } from '../../screens/restaurant-acconut-screen/restaurant-account-screen.tsx';
import { SCREEN_NAMES } from '../../shared/constants/navigation/navigation.ts';
import { CustomTabBar } from '../../shared/TabBar/TabBar';

const Tab = createBottomTabNavigator();

export const RestaurantNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name={SCREEN_NAMES.RESTAURANT_MAIN} component={RestaurantAccountScreen} />
    </Tab.Navigator>
  );
};
