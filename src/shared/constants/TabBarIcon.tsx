import React from 'react';
import { View } from 'react-native';
import { TAB_NAMES } from '../constants/navigation';
import { Images } from './images';

interface TabBarIconProps {
  routeName: string;
  focused: boolean;
  color: string;
  size: number;
}

export const TabBarIcon: React.FC<TabBarIconProps> = ({ routeName, focused, color, size }) => {
  const getIcon = () => {
    switch (routeName) {
      case TAB_NAMES.HOME:
        return Images.navigation.home;
      case TAB_NAMES.MENU:
        return Images.navigation.menu;
      case TAB_NAMES.BASKET:
        return Images.navigation.basket;
      case TAB_NAMES.ACCOUNT:
        return Images.navigation.account;
      default:
        return Images.navigation.navigation;
    }
  };

  const IconComponent = getIcon();
  const iconSize = size * 1.2;

  return (
    <View style={{ opacity: focused ? 1 : 0.7 }}>
      <IconComponent width={iconSize} height={iconSize} />
    </View>
  );
};
