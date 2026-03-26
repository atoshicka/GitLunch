import React, { useEffect, useState } from 'react';
import { Provider, useSelector } from 'react-redux';
import { LoginFeature } from '../features/login';
import { AppNavigator, AuthScreen } from './navigation/app-navigation';
import { store } from './store';
import { initializeAuth } from './store-initializer';

const AppContent: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const isAuthenticated = useSelector(LoginFeature.selectors.selectIsAuthenticated);
  const isRestoring = useSelector(LoginFeature.selectors.selectIsRestoring);

  useEffect(() => {
    initializeAuth().finally(() => {
      setIsInitialized(true);
    });
  }, []);

  if (!isInitialized) {
    return null;
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
