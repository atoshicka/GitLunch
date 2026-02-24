import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MOCK_DISHES } from '../../../mocks';
import { selectCartItemById } from '../../features/cart/store/cart-selectors';
import { addToCart } from '../../features/cart/store/cart-slice';
import { SearchInput } from '../../shared/search/ui/search-input';
import { styles } from './menu-styles';

type RootStackParamList = {
  Tabs: undefined;
  Search: {
    category?: string;
    onSearch?: (query: string) => void;
  };
};

type MenuScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

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
  const navigation = useNavigation<MenuScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchInput
          onPress={() => navigation.navigate('Search', {})}
          placeholder="Поиск блюд..."
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
