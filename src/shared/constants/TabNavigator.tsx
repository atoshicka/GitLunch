import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { HomeScreen } from '../../features/home/ui/home-screen';
import { AccountScreen } from '../../screens/account-screen/account-screen';
import { BasketScreen } from '../../screens/basket-screen/basket-screen';
import { MenuScreen } from '../../screens/menu-screen/menu-screen';

import { navigationStyles } from '../../app/navigation/navigation-styles';
import { TAB_NAMES } from '../constants/navigation';
import { TabBarIcon } from './TabBarIcon';

const Tab = createBottomTabNavigator();

export const TabNavigator: React.FC = () => {
  const baseScreenOptions = navigationStyles.getScreenOptions();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...baseScreenOptions,
        tabBarIcon: (props) => (
          <TabBarIcon
            routeName={route.name}
            focused={props.focused}
            color={props.color}
            size={props.size}
          />
        ),
      })}
    >
      <Tab.Screen
        name={TAB_NAMES.HOME}
        component={HomeScreen}
        options={{ title: TAB_NAMES.HOME }}
      />
      <Tab.Screen
        name={TAB_NAMES.MENU}
        component={MenuScreen}
        options={{ title: TAB_NAMES.MENU }}
      />
      <Tab.Screen
        name={TAB_NAMES.BASKET}
        component={BasketScreen}
        options={{ title: TAB_NAMES.BASKET }}
      />
      <Tab.Screen
        name={TAB_NAMES.ACCOUNT}
        component={AccountScreen}
        options={{ title: TAB_NAMES.ACCOUNT }}
      />
    </Tab.Navigator>
  );
};
