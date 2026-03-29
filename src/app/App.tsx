import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Provider, useSelector } from 'react-redux';
import { LoginFeature } from '../features/login';
import { AppNavigator, AuthScreen } from './navigation/app-navigation';
import { store } from './store';
import { initializeAuth } from './store-initializer';

const AppContent: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const isAuthenticated = useSelector(LoginFeature.selectors.selectIsAuthenticated);

  useEffect(() => {
    initializeAuth().finally(() => {
      setIsInitialized(true);
    });
  }, []);

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#86EFAC" />
      </View>
    );
  }

  return isAuthenticated ? <AppNavigator /> : <AuthScreen />;
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
