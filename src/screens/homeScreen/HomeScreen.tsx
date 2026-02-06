import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './homeStyles';

export const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Главная</Text>
    </View>
  );
};
