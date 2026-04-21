import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { CartFeature } from '../../features/cart';
import { LoginFeature } from '../../features/login';
import { OrdersFeature } from '../../features/orders';
import { DishModal } from '../../shared/dish-modal/dish-modal';
import { LoadingScreen } from '../../shared/loading/ui/LoadingScreen';
import { AuthNavigator, ClientNavigator, RestaurantNavigator } from './app-navigation';

export const RootNavigator: React.FC = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(LoginFeature.selectors.selectIsAuthenticated);
  const isRestoring = useSelector(LoginFeature.selectors.selectIsRestoring);
  const userRole = useSelector(LoginFeature.selectors.selectRole);

  useEffect(() => {
    dispatch(LoginFeature.actions.restoreSession());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && userRole === 'student') {
      dispatch(CartFeature.actions.fetchCart());
      dispatch(OrdersFeature.actions.fetchOrders());
    }
  }, [isAuthenticated, userRole, dispatch]);

  if (isRestoring || (isAuthenticated && !userRole)) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <NavigationContainer key="auth">
        <AuthNavigator />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer key={userRole}>
      <View style={{ flex: 1 }}>
        {userRole === 'admin' ? <RestaurantNavigator /> : <ClientNavigator />}
        {userRole === 'student' && <DishModal />}
      </View>
    </NavigationContainer>
  );
};
