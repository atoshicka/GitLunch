import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../app/navigation/navigation-types';
import { LoginFeature } from '../../features/login';
import { ACCOUNT_MENU_ITEMS } from '../../shared/constants/constants';
import { Images } from '../../shared/constants/images';
import { TAB_BAR_CIRCLE_OVERFLOW, TAB_BAR_HEIGHT } from '../../shared/TabBar/TabBar';
import { styles } from './account-styles';

type MenuItemTitle = (typeof ACCOUNT_MENU_ITEMS)[number]['title'];
type AccountScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

const SubtractIcon = Images.home.wave;

export const AccountScreen: React.FC = () => {
  const navigation = useNavigation<AccountScreenNavigationProp>();
  const dispatch = useDispatch();
  const userName = useSelector(LoginFeature.selectors.selectUserName);

  const handleSettingsPress = useCallback(() => {
    console.log('Настройки');
  }, []);

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Выход из аккаунта',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Нет', style: 'cancel' },
        {
          text: 'Да',
          style: 'destructive',
          onPress: () => dispatch(LoginFeature.actions.logoutRequest()),
        },
      ],
      { cancelable: true }
    );
  }, [dispatch]);

  const handleMenuItemPress = useCallback(
    (itemTitle: MenuItemTitle) => {
      switch (itemTitle) {
        case 'Мои заказы':
          navigation.navigate('Orders');
          break;
        default:
          console.log(`Нажат пункт: ${itemTitle}`);
      }
    },
    [navigation]
  );

  const SettingsIcon = Images.account.setting;
  const AccountIcon = Images.navigation.account;

  return (
    <View style={styles.container}>
      <View style={styles.waveSection} pointerEvents="none">
        <View style={styles.waveBackground}>
          <SubtractIcon width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
        </View>
      </View>

      <SafeAreaView edges={['top']} style={styles.waveContent}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.topBarButton} onPress={handleBackPress}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.brandTitle}>GitLunch</Text>
          <TouchableOpacity style={styles.topBarButton} onPress={handleSettingsPress}>
            <SettingsIcon width={26} height={26} fill="#1F2937" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_CIRCLE_OVERFLOW }}
      >
        <View style={styles.content}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <AccountIcon width={80} height={80} />
            </View>
          </View>
          <Text style={styles.userName}>{userName ?? 'Гость'}</Text>

          <View style={styles.menuBlock}>
            {ACCOUNT_MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleMenuItemPress(item.title)}
              >
                <Text style={styles.menuItemText}>{item.title}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.menuItem, { borderBottomWidth: 0 }]}
              onPress={handleLogout}
            >
              <Text style={[styles.menuItemText, { color: '#FA2020' }]}>Выйти</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
