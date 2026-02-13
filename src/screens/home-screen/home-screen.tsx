import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './home-styles';

export const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Главная</Text>
    </View>
  );
};
