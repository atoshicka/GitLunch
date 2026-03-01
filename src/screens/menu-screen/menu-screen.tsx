import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MOCK_DISHES } from '../../../mocks';
import {
  MainFilterType,
  RootStackParamList,
  SubFilterType,
} from '../../app/navigation/navigation-types';
import { Dish } from '../../entities/api';
import { selectCartItemById } from '../../features/cart/store/cart-selectors';
import { addToCart, decreaseQuantity } from '../../features/cart/store/cart-slice';
import { SearchInput } from '../../shared/search/ui/search-input';
import { FilterChips } from './filter-chips';
import { styles } from './menu-styles';

type MenuScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;
type MenuScreenRouteProp = RouteProp<RootStackParamList, 'Menu'>;

const MAIN_FILTERS: MainFilterType[] = ['Все', 'акции'];
const SUB_FILTERS: SubFilterType[] = ['горячее', 'салаты', 'десерты', 'закуски', 'новинки'];

const DishCard = React.memo(({ item }: { item: Dish }) => {
  const dispatch = useDispatch();
  const cartItem = useSelector(selectCartItemById(item.id));
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = useCallback(() => {
    dispatch(addToCart({ id: item.id, name: item.name, price: item.price }));
  }, [dispatch, item.id, item.name, item.price]);

  const handleDecrease = useCallback(() => {
    dispatch(decreaseQuantity(item.id));
  }, [dispatch, item.id]);

  return (
    <View style={styles.dishCard}>
      <View style={styles.imageContainer}>
        <Text style={styles.imagePlaceholder}>🍽️</Text>
      </View>

      <Text style={styles.dishName} numberOfLines={2}>
        {item.name}
      </Text>

      <Text style={styles.dishPrice}>{item.price} ₽</Text>

      {quantity > 0 ? (
        <View style={styles.quantityControl}>
          <TouchableOpacity style={styles.quantityButton} onPress={handleDecrease}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity style={styles.quantityButton} onPress={handleAddToCart}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartButtonText}>В корзину</Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

export const MenuScreen: React.FC = () => {
  const navigation = useNavigation<MenuScreenNavigationProp>();
  const route = useRoute<MenuScreenRouteProp>();
  const {
    restaurantName,
    mainFilter: initialMainFilter,
    subFilters: initialSubFilters,
  } = route.params || {};

  const [mainFilter, setMainFilter] = useState<MainFilterType>(initialMainFilter || 'Все');
  const [subFilters, setSubFilters] = useState<SubFilterType[]>(initialSubFilters || []);

  useEffect(() => {
    if (initialMainFilter) {
      setMainFilter(initialMainFilter);
      if (initialMainFilter === 'акции') {
        setSubFilters([]);
      }
    }
  }, [initialMainFilter]);

  useEffect(() => {
    if (initialSubFilters) {
      setSubFilters(initialSubFilters);
    }
  }, [initialSubFilters]);

  const filteredDishes = useMemo(() => {
    const subFiltersSet = new Set(subFilters);

    if (mainFilter === 'акции') {
      return MOCK_DISHES.filter((dish) => dish.isPromo);
    }

    if (subFilters.length === 0) {
      return MOCK_DISHES;
    }

    return MOCK_DISHES.filter(
      (dish) => dish.filterType && subFiltersSet.has(dish.filterType as SubFilterType)
    );
  }, [mainFilter, subFilters]);

  const handleMainFilterPress = useCallback((filter: string) => {
    if (filter === 'Все' || filter === 'акции') {
      setMainFilter(filter as MainFilterType);
      if (filter === 'акции') {
        setSubFilters([]);
      }
    }
  }, []);

  const handleSubFilterPress = useCallback((filter: string) => {
    const subFilter = filter as SubFilterType;
    setSubFilters((prev) => {
      if (prev.includes(subFilter)) {
        return prev.filter((f) => f !== subFilter);
      }
      return [...prev, subFilter];
    });
  }, []);

  const handleSearchPress = useCallback(() => {
    navigation.navigate('Search', {});
  }, [navigation]);

  const getTitle = useCallback(() => {
    return mainFilter === 'акции' ? 'Акции дня' : 'Меню';
  }, [mainFilter]);

  const restaurantTitle = restaurantName || 'Кафе Цезарь';

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchInput onPress={handleSearchPress} placeholder="Поиск блюд..." />
      </View>

      <Text style={styles.cafeTitle}>{restaurantTitle}</Text>
      <Text style={styles.sectionTitle}>{getTitle()}</Text>

      <View style={styles.filtersWrapper}>
        <FilterChips
          filters={MAIN_FILTERS}
          selectedFilters={[mainFilter]}
          onSelectFilter={handleMainFilterPress}
        />
      </View>

      {mainFilter === 'Все' && (
        <View style={styles.filtersWrapper}>
          <FilterChips
            filters={SUB_FILTERS}
            selectedFilters={subFilters}
            onSelectFilter={handleSubFilterPress}
          />
        </View>
      )}

      <FlatList
        data={filteredDishes}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.dishesGrid}
        renderItem={({ item }) => <DishCard item={item} />}
        ListEmptyComponent={<Text style={styles.emptyText}>Нет блюд в этой категории</Text>}
        initialNumToRender={4}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </View>
  );
};
