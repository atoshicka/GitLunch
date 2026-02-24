import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './index.ts';
import { AppNavigator, AuthScreen } from './navigation/app-navigation';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Provider store={store}>
      {isLoggedIn ? <AppNavigator /> : <AuthScreen onLogin={() => setIsLoggedIn(true)} />}
    </Provider>
  );
};

export default App;
