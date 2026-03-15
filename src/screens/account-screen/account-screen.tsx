import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootStackParamList } from '../../app/navigation/navigation-types';
import { selectUserName } from '../../features/login/selectors';
import { Images } from '../../shared/constants/images';
import { TAB_BAR_CIRCLE_OVERFLOW, TAB_BAR_HEIGHT } from '../../shared/TabBar/TabBar';
import { styles } from './account-styles';

const MENU_ITEMS = [
  { id: '1', title: 'Мои заказы' },
  { id: '2', title: 'Поддержка' },
  { id: '3', title: 'Уведомления' },
  { id: '4', title: 'Промокоды' },
  { id: '5', title: 'Адреса' },
  { id: '6', title: 'О сервисе' },
  { id: '7', title: 'Способы оплаты' },
] as const;

type MenuItemTitle = (typeof MENU_ITEMS)[number]['title'];
type AccountScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

export const AccountScreen: React.FC = () => {
  const navigation = useNavigation<AccountScreenNavigationProp>();
  const userName = useSelector(selectUserName);

  const handleSettingsPress = () => {
    console.log('Настройки');
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleMenuItemPress = (itemTitle: MenuItemTitle) => {
    switch (itemTitle) {
      case 'Мои заказы':
        navigation.navigate('Orders');
        break;
      default:
        console.log(`Нажат пункт: ${itemTitle}`);
    }
  };

  const SettingsIcon = Images.account.setting;
  const AccountIcon = Images.navigation.account;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Text style={styles.backButtonText}>‹</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
        <SettingsIcon width={28} height={28} fill="#1F2937" />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_CIRCLE_OVERFLOW }}
      >
        <View style={styles.content}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <AccountIcon width={80} height={80} />
            </View>
          </View>
          <Text style={styles.userName}>{userName || 'Гость'}</Text>
          <View style={styles.menuBlock}>
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleMenuItemPress(item.title)}
              >
                <Text style={styles.menuItemText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
