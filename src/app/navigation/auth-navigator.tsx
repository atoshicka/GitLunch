import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { LoginForm } from '../../screens/login-screen/login-form';

const Stack = createNativeStackNavigator();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginForm} />
    </Stack.Navigator>
  );
};
