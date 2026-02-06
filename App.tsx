//онли навигация

// import React from 'react';
// import AppNavigator from './src/navigation/AppNavigation';

// const App: React.FC = () => {
//   return <AppNavigator />;
// };

// export default App;

//навигация и авторизация

import React, { useState } from 'react';

import { AppNavigator } from './src/app/navigation/AppNavigation';
import { AuthScreen } from './src/screens/auth/authScreen/AuthScreen';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return <AppNavigator />;
  }

  return <AuthScreen onLogin={() => setIsLoggedIn(true)} />;
};

export default App;
