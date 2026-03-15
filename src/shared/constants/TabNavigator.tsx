import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { HomeScreen } from '../../features/home/ui/home-screen';
import { AccountScreen } from '../../screens/account-screen/account-screen';
import { BasketScreen } from '../../screens/basket-screen/basket-screen';
import { MenuScreen } from '../../screens/menu-screen/menu-screen';
import { CustomTabBar } from '../TabBar/TabBar';
import { TAB_NAMES } from './navigation';

const Tab = createBottomTabNavigator();

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name={TAB_NAMES.HOME} component={HomeScreen} />
      <Tab.Screen name={TAB_NAMES.MENU} component={MenuScreen} />
      <Tab.Screen name={TAB_NAMES.BASKET} component={BasketScreen} />
      <Tab.Screen name={TAB_NAMES.ACCOUNT} component={AccountScreen} />
    </Tab.Navigator>
  );
};
