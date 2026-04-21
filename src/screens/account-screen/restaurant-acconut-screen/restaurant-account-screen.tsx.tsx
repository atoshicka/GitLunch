import React, { useCallback } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { LoginFeature } from '../../../features/login';
import { Images } from '../../../shared/constants/images';
import { TAB_BAR_CIRCLE_OVERFLOW, TAB_BAR_HEIGHT } from '../../../shared/TabBar/TabBar';
import { styles } from './restaurant-account-styles.ts';

const RESTAURANT_MENU_ITEMS = [
  { id: '1', title: 'Наше меню' },
  { id: '2', title: 'Поддержка' },
  { id: '3', title: 'Уведомления' },
  { id: '4', title: 'О сервисе' },
] as const;

type RestaurantMenuItemTitle = (typeof RESTAURANT_MENU_ITEMS)[number]['title'];

const SubtractIcon = Images.home.wave;
const SettingsIcon = Images.account.setting;
const AccountIcon = Images.navigation.account;

export const RestaurantAccountScreen: React.FC = () => {
  const dispatch = useDispatch();
  const restaurantName = useSelector(LoginFeature.selectors.selectUserName);
  const restaurantDescription = useSelector(LoginFeature.selectors.selectRestaurantDescription);

  const handleSettingsPress = useCallback(() => {
    console.log('Настройки');
  }, []);

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

  const handleMenuItemPress = useCallback((itemTitle: RestaurantMenuItemTitle) => {
    console.log(`Нажат пункт: ${itemTitle}`);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.waveSection} pointerEvents="none">
        <View style={styles.waveBackground}>
          <SubtractIcon width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
        </View>
      </View>

      <SafeAreaView edges={['top']} style={styles.waveContent}>
        <View style={styles.topBar}>
          <View style={styles.topBarButton} />
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

          <Text style={styles.userName}>{restaurantName ?? 'Ресторан'}</Text>
          {restaurantDescription ? (
            <Text style={styles.userDescription}>{restaurantDescription}</Text>
          ) : null}

          <View style={styles.menuBlock}>
            {RESTAURANT_MENU_ITEMS.map((item) => (
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
