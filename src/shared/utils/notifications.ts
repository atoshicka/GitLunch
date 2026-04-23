import notifee, { AndroidImportance } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  } else if (Platform.OS === 'android' && Platform.Version >= 33) {
    const settings = await notifee.requestPermission();
    return settings.authorizationStatus >= 1;
  }
  return true;
};

export const showOrderReadyNotification = async (orderNumber: string): Promise<void> => {
  const channelId = await notifee.createChannel({
    id: 'orders',
    name: 'Заказы',
    importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
    title: 'Заказ готов!',
    body: `Ваш заказ готов к получению. Заберите его сегодня в колледже.`,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      color: '#79E87D',
      smallIcon: 'ic_launcher_round',
      pressAction: { id: 'default' },
    },
  });
};
