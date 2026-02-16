import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './basket-styles';

export const SettingsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Корзина</Text>
    </View>
  );
};
