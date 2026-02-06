import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './settingsStyles';

export const SettingsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Настройки</Text>
    </View>
  );
};
