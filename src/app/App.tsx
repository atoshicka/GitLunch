import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { CartFeature } from '../features/cart';
import { LoginFeature } from '../features/login';
import { DishModal } from '../shared/dish-modal/dish-modal';
import { AppNavigator, AuthScreen } from './navigation/app-navigation';
import { store } from './store';

const AppContent: React.FC = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(LoginFeature.selectors.selectIsAuthenticated);
  const isRestoring = useSelector(LoginFeature.selectors.selectIsRestoring);

  useEffect(() => {
    dispatch(LoginFeature.actions.restoreSession());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(CartFeature.actions.fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  if (isRestoring) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#86EFAC" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {isAuthenticated ? <AppNavigator /> : <AuthScreen />}
      <DishModal />
    </View>
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
