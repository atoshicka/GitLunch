import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MOCK_DISHES } from '../../../mocks';
import { selectCartItemById } from '../../features/cart/store/cart-selectors';
import { addToCart } from '../../features/cart/store/cart-slice';
import { SearchInput } from '../../shared/search/ui/search-input';
import { FilterChips } from './filter-chips';
import { styles } from './menu-styles';

type RootStackParamList = {
  Tabs: undefined;
  Search: {
    category?: string;
    onSearch?: (query: string) => void;
  };
  Menu: {
    filterType?: string;
    restaurantId?: string;
    restaurantName?: string;
  };
};

type MenuScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;
type MenuScreenRouteProp = RouteProp<RootStackParamList, 'Menu'>;

const FILTERS = ['Все', 'горячее', 'салаты', 'десерты', 'закуски', 'новинки'];

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
  const route = useRoute<MenuScreenRouteProp>();
  const filterType = route.params?.filterType;
  const restaurantName = route.params?.restaurantName;

  const [selectedFilters, setSelectedFilters] = useState<string[]>(['Все']);

  useEffect(() => {
    if (filterType && filterType !== 'Все') {
      setSelectedFilters([filterType]);
    }
  }, [filterType]);

  const filteredDishes = useMemo(() => {
    if (selectedFilters.includes('Все')) {
      return MOCK_DISHES;
    }
    return MOCK_DISHES.filter(
      (dish) => dish.filterType && selectedFilters.includes(dish.filterType)
    );
  }, [selectedFilters]);

  const handleSelectFilter = (filter: string) => {
    setSelectedFilters((prev) => {
      if (filter === 'Все') {
        return ['Все'];
      }

      if (prev.includes('Все')) {
        return [filter];
      }

      if (prev.includes(filter)) {
        const newFilters = prev.filter((f) => f !== filter);
        return newFilters.length === 0 ? ['Все'] : newFilters;
      }

      return [...prev, filter];
    });
  };

  const handleSearchPress = () => {
    navigation.navigate('Search', {});
  };

  const restaurantTitle = restaurantName || 'Кафе Цезарь';

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchInput onPress={handleSearchPress} placeholder="Поиск блюд..." />
      </View>

      <Text style={styles.cafeTitle}>{restaurantTitle}</Text>
      <Text style={styles.sectionTitle}>Предложения дня</Text>

      <View style={styles.filtersWrapper}>
        <FilterChips
          filters={FILTERS}
          selectedFilters={selectedFilters}
          onSelectFilter={handleSelectFilter}
        />
      </View>

      <FlatList
        data={filteredDishes}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.dishesGrid}
        renderItem={({ item }) => <DishCard item={item} />}
        ListEmptyComponent={<Text style={styles.emptyText}>Нет блюд в этой категории</Text>}
      />
    </View>
  );
};
