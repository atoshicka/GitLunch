import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { BasketScreen } from '../../screens/basket-screen/basket-screen';
import { SearchScreen } from '../../screens/search-screen/search-screen';
import { SCREEN_NAMES, TAB_NAMES } from '../../shared/constants/navigation/navigation';
import { TabNavigator } from '../../shared/constants/navigation/TabNavigator';

const Stack = createNativeStackNavigator();

export const ClientNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={SCREEN_NAMES.TABS} component={TabNavigator} />
      <Stack.Screen
        name={TAB_NAMES.BASKET}
        component={BasketScreen}
        options={{ presentation: 'card' }}
      />
      <Stack.Screen name={SCREEN_NAMES.SEARCH} component={SearchScreen} />
    </Stack.Navigator>
  );
};
