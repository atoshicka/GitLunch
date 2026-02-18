import React from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './menu-styles';

// Моковые данные для блюд
const MOCK_DISHES = [
  {
    id: '1',
    name: 'Цезарь с курицей',
    price: 450,
    image: 'https://via.placeholder.com/150/495E7C/FFFFFF?text=🥗',
  },
  {
    id: '2',
    name: 'omerican burger',
    price: 350,
    image: 'https://via.placeholder.com/150/1BB910/FFFFFF?text=🍔',
  },
  {
    id: '3',
    name: 'Пицца Маргарита',
    price: 550,
    image: 'https://via.placeholder.com/150/495E7C/FFFFFF?text=🍕',
  },
  {
    id: '4',
    name: 'Роллы',
    price: 400,
    image: 'https://via.placeholder.com/150/1BB910/FFFFFF?text=🍣',
  },
];

export const MenuScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Поисковая строка */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск блюд..."
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* Название кафе */}
      <Text style={styles.cafeTitle}>Кафе Цезарь</Text>

      {/* Предложение дня */}
      <Text style={styles.sectionTitle}>Предложения дня</Text>

      {/* Сетка блюд */}
      <FlatList
        data={MOCK_DISHES}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.dishesGrid}
        renderItem={({ item }) => (
          <View style={styles.dishCard}>
            {/* Фото */}
            <View style={styles.imageContainer}>
              <Text style={styles.imagePlaceholder}>{item.image.split('text=')[1]}</Text>
            </View>

            {/* Название */}
            <Text style={styles.dishName} numberOfLines={2}>
              {item.name}
            </Text>

            {/* Цена и кнопка */}
            <View style={styles.dishFooter}>
              <Text style={styles.dishPrice}>{item.price} ₽</Text>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};
