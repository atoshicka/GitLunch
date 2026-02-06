import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './menuStyles';

export const MenuScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Меню</Text>
    </View>
  );
};
