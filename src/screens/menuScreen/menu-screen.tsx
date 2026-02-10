import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './menu-styles';

export const MenuScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Меню</Text>
    </View>
  );
};
