import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './account-styles';

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
