import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { AppNavigator, AuthScreen } from './src/app/navigation/app-navigation';
import { store } from './src/app/store';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return (
      <Provider store={store}>
        {' '}
        {}
        <AppNavigator />
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      {' '}
      {}
      <AuthScreen onLogin={() => setIsLoggedIn(true)} />
    </Provider>
  );
};

export default App;
