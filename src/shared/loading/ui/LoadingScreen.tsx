import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { layoutStyles } from '../../../app/navigation/navigation-styles';

export const LoadingScreen: React.FC = () => (
  <View style={layoutStyles.centered}>
    <ActivityIndicator size="large" color="#86EFAC" />
  </View>
);
