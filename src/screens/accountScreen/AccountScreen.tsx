import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './accountStyles';

export const AccountScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>М</Text>
        </View>
        <Text style={styles.profileName}>Мария</Text>
        <Text style={styles.profileEmail}>atoshica@gitlunch.com</Text>
      </View>
    </View>
  );
};
