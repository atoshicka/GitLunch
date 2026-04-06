import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoginForm } from '../../features/login/ui/login-form';
import { OrdersScreen } from '../../features/orders/orders';
import { PaymentScreen } from '../../screens/pay-screen/payment-seen';
import { SearchScreen } from '../../screens/search-screen/search-screen';
import { SuccessScreen } from '../../screens/success-screen/success-screen';
import { SCREEN_NAMES } from '../../shared/constants/navigation';
import { TabNavigator } from '../../shared/constants/TabNavigator';
import { authStyles } from './navigation-styles';

const RootStack = createNativeStackNavigator();

export const AuthScreen: React.FC = () => {
  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView contentContainerStyle={authStyles.scrollContainer}>
        <View style={authStyles.content}>
          <LoginForm />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name={SCREEN_NAMES.TABS} component={TabNavigator} />
        <RootStack.Screen
          name={SCREEN_NAMES.SEARCH}
          component={SearchScreen}
          options={{ presentation: 'card' }}
        />
        <RootStack.Screen
          name={SCREEN_NAMES.ORDERS}
          component={OrdersScreen}
          options={{ presentation: 'card' }}
        />
        <RootStack.Screen
          name={SCREEN_NAMES.PAYMENT}
          component={PaymentScreen}
          options={{ presentation: 'card' }}
        />
        <RootStack.Screen
          name={SCREEN_NAMES.SUCCESS}
          component={SuccessScreen}
          options={{ presentation: 'card', gestureEnabled: false }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
