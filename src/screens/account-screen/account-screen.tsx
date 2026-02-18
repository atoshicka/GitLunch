import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './account-styles';

// Массив пунктов меню
const MENU_ITEMS = [
  { id: '1', title: 'Мои заказы' },
  { id: '2', title: 'Поддержка' },
  { id: '3', title: 'Уведомления' },
  { id: '4', title: 'Промокоды' },
  { id: '5', title: 'Адреса' },
  { id: '6', title: 'О сервисе' },
  { id: '7', title: 'Способы оплаты' },
];

export const AccountScreen: React.FC = () => {
  const handleSettingsPress = () => {
    console.log('Настройки');
  };

  const handleMenuItemPress = (itemTitle: string) => {
    console.log(`Нажат пункт: ${itemTitle}`);
  };

  return (
    <View style={styles.container}>
      {/* Шестеренка справа сверху */}
      <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
        <Text style={styles.settingsIcon}>⚙️</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Аватар */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>М</Text>
            </View>
          </View>

          {/* Имя пользователя */}
          <Text style={styles.userName}>Мария</Text>

          {/* Блок с пунктами меню */}
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
