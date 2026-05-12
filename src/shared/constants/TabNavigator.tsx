import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { OrdersScreen } from '../../features/orders/orders';
import { AccountScreen } from '../../screens/account-screen/account-screen';
import { BasketScreen } from '../../screens/basket-screen/basket-screen';
import { ErrorScreen } from '../../screens/error-screen/error-screen';
import { HomeScreen } from '../../screens/home-screen/home-screen';
import { MenuScreen } from '../../screens/menu-screen/menu-screen';
import { CustomTabBar } from '../TabBar/TabBar';
import { TAB_NAMES } from './navigation';

import { PaymentScreen } from '../../screens/pay-screen/payment-screen';
import { SuccessScreen } from '../../screens/success-screen/success-screen';

export type TabStackParamList = {
  [TAB_NAMES.HOME]: undefined;
  [TAB_NAMES.MENU]: undefined;
  [TAB_NAMES.BASKET]: undefined;
  [TAB_NAMES.ACCOUNT]: undefined;
  [TAB_NAMES.ORDERS]: undefined;
  [TAB_NAMES.PAYMENT]: undefined;
  [TAB_NAMES.SUCCESS]: undefined;
  [TAB_NAMES.ERROR]: undefined;
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
      <Tab.Screen name={TAB_NAMES.ORDERS} component={OrdersScreen} />
      <Tab.Screen name={TAB_NAMES.ACCOUNT} component={AccountScreen} />
      <Tab.Screen name={TAB_NAMES.PAYMENT} component={PaymentScreen} />
      <Tab.Screen name={TAB_NAMES.SUCCESS} component={SuccessScreen} />
      <Tab.Screen name={TAB_NAMES.ERROR} component={ErrorScreen} />
    </Tab.Navigator>
  );
};
