import messaging from '@react-native-firebase/messaging';
import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { Provider } from 'react-redux';
import { requestNotificationPermission } from '../shared/utils/notifications';
import { RootNavigator } from './navigation/root-navigator';
import { store } from './store';

const App: React.FC = () => {
  useEffect(() => {
    const setupNotifications = async (): Promise<void> => {
      await requestNotificationPermission();
    };

    setupNotifications();

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert(
        remoteMessage.notification?.title || 'Новое сообщение',
        remoteMessage.notification?.body || ''
      );
    });

    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
};

export default App;
