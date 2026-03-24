import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { LoginFeature } from '../features/login';
import { AppNavigator, AuthScreen } from './navigation/app-navigation';
import { store } from './store';

const AppContent: React.FC = () => {
  const isAuthenticated = useSelector(LoginFeature.selectors.selectIsAuthenticated);

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
