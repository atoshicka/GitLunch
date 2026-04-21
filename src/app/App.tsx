import React from 'react';
import { Provider } from 'react-redux';
import { RootNavigator } from './navigation/root-navigator';
import { store } from './store';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
};

export default App;
