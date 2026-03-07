import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { AppNavigator, AuthScreen } from './navigation/app-navigation';
import { store } from './store';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <Provider store={store}>
      {isLoggedIn ? <AppNavigator /> : <AuthScreen onLogin={() => setIsLoggedIn(true)} />}
    </Provider>
  );
};

export default App;
