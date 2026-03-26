import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginFeature } from '../features/login';
import { store } from './store';

export const initializeAuth = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const userJson = await AsyncStorage.getItem('user');

    if (token && userJson) {
      const user = JSON.parse(userJson);
      store.dispatch(
        LoginFeature.actions.restoreSessionSuccess({
          token,
          userName: user.full_name,
        })
      );
    } else {
      store.dispatch(LoginFeature.actions.restoreSessionFailure());
    }
  } catch (error) {
    console.error('Failed to restore session', error);
    store.dispatch(LoginFeature.actions.restoreSessionFailure());
  }
};
