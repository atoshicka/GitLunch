import React from 'react';
import { Text, TextStyle } from 'react-native';
import { TAB_ICONS } from '../constants/navigation';

interface TabBarIconProps {
  routeName: string;
  focused: boolean;
  color: string;
  size: number;
}

export const TabBarIcon: React.FC<TabBarIconProps> = ({ routeName, focused, color, size }) => {
  const iconText = TAB_ICONS[routeName as keyof typeof TAB_ICONS] || TAB_ICONS.default;

  const textStyle: TextStyle = {
    fontSize: size,
    color,
    fontWeight: focused ? 'bold' : 'normal',
  };

  return <Text style={textStyle}>{iconText}</Text>;
};
