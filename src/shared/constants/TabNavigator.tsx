import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { AccountScreen } from '../../screens/account-screen/account-screen';
import { BasketScreen } from '../../screens/basket-screen/basket-screen';
import { HomeScreen } from '../../screens/home-screen/home-screen';
import { MenuScreen } from '../../screens/menu-screen/menu-screen';
import { CustomTabBar } from '../TabBar/TabBar';
import { TAB_NAMES } from './navigation';

export type TabStackParamList = {
  [TAB_NAMES.HOME]: undefined;
  [TAB_NAMES.MENU]: undefined;
  [TAB_NAMES.BASKET]: undefined;
  [TAB_NAMES.ACCOUNT]: undefined;
};

const Tab = createBottomTabNavigator<TabStackParamList>();

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
