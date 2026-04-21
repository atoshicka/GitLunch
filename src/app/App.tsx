import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';

import { CartFeature } from '../features/cart';
import { LoginFeature } from '../features/login';
import { OrdersFeature } from '../features/orders';
import { DishModal } from '../shared/dish-modal/dish-modal';
import { AuthNavigator, ClientNavigator, RestaurantNavigator } from './navigation/app-navigation';
import { store } from './store';

const AppContent: React.FC = () => {
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

  if (isRestoring) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
        }}
      >
        <ActivityIndicator size="large" color="#86EFAC" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <NavigationContainer key="auth">
        <AuthNavigator />
      </NavigationContainer>
    );
  }

  if (!userRole) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
        }}
      >
        <ActivityIndicator size="large" color="#86EFAC" />
      </View>
    );
  }

  console.log('=== ROLE DEBUG ===', JSON.stringify(userRole), typeof userRole);
  if (userRole === 'admin') {
    return (
      <NavigationContainer key="restaurant">
        <RestaurantNavigator />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer key="student">
      <View style={{ flex: 1 }}>
        <ClientNavigator />
        <DishModal />
      </View>
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
