import React, { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItemById } from '../../features/cart/store/cart-selectors';
import { addToCart } from '../../features/cart/store/cart-slice';
import { styles } from './menu-styles';

const MOCK_DISHES = [
  { id: '1', name: 'Цезарь с курицей', price: 450 },
  { id: '2', name: 'American burger', price: 350 },
  { id: '3', name: 'Пицца Маргарита', price: 550 },
  { id: '4', name: 'Роллы', price: 400 },
];

const DishCard = ({ item }: { item: (typeof MOCK_DISHES)[0] }) => {
  const dispatch = useDispatch();
  const cartItem = useSelector(selectCartItemById(item.id));
  const quantity = cartItem?.quantity || 0;

  return (
    <View style={styles.dishCard}>
      <View style={styles.imageContainer}>
        <Text style={styles.imagePlaceholder}>🍽️</Text>
      </View>

      <Text style={styles.dishName} numberOfLines={2}>
        {item.name}
      </Text>

      <View style={styles.dishFooter}>
        <Text style={styles.dishPrice}>{item.price} ₽</Text>

        {quantity > 0 ? (
          <View style={styles.quantityControl}>
            <TouchableOpacity style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() =>
                dispatch(addToCart({ id: item.id, name: item.name, price: item.price }))
              }
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => dispatch(addToCart({ id: item.id, name: item.name, price: item.price }))}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export const MenuScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск блюд..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <Text style={styles.cafeTitle}>Кафе Цезарь</Text>
      <Text style={styles.sectionTitle}>Предложения дня</Text>

      <FlatList
        data={MOCK_DISHES}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.dishesGrid}
        renderItem={({ item }) => <DishCard item={item} />}
      />
    </View>
  );
};
