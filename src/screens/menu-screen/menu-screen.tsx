import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../app/navigation/navigation-types';
import { Dish } from '../../entities/api/types/menu-types';
import { CartFeature } from '../../features/cart';
import { Images } from '../../shared/constants/images';
import { SearchInput } from '../../shared/search/ui/search-input';
import { FilterChips } from './filter-chips';
import { MenuFeature } from './index';
import { styles } from './menu-styles';

type MenuScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;
type MenuScreenRouteProp = RouteProp<RootStackParamList, 'Menu'>;

const BASE_URL = 'https://gitlunch-backend-production.up.railway.app';
const SubtractIcon = Images.home.wave;

const DishCard = React.memo(({ item }: { item: Dish }) => {
  const dispatch = useDispatch();
  const cartItemSelector = useMemo(
    () => CartFeature.selectors.selectCartItemById(String(item.id)),
    [item.id]
  );
  const cartItem = useSelector(cartItemSelector);
  const quantity = cartItem?.quantity ?? 0;

  const handleAddToCart = useCallback(() => {
    dispatch(
      CartFeature.actions.addToCart({
        id: String(item.id),
        name: item.name,
        price: parseFloat(item.price),
        imageSvg: item.imageSvg,
        imageUrl: item.image_url ? `${BASE_URL}${item.image_url}` : undefined,
      })
    );
  }, [dispatch, item.id, item.name, item.price, item.imageSvg, item.image_url]);

  const handleDecrease = useCallback(() => {
    dispatch(CartFeature.actions.decreaseQuantity(String(item.id)));
  }, [dispatch, item.id]);

  const renderImage = () => {
    if (item.image_url) {
      return (
        <Image
          source={{ uri: `${BASE_URL}${item.image_url}` }}
          style={{ width: '100%', height: '100%', borderRadius: 12 }}
          resizeMode="contain"
        />
      );
    }
    if (item.imageSvg) {
      const SvgImage = item.imageSvg;
      return <SvgImage width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />;
    }
    return <Text style={styles.imagePlaceholder}>🍽</Text>;
  };

  return (
    <LinearGradient
      colors={['#86EFAC', '#A8F0B5', '#F4F4F4']}
      locations={[0, 0.2, 0.6]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.dishCard}
    >
      <View style={styles.imageContainer}>{renderImage()}</View>
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
    </LinearGradient>
  );
});

export const MenuScreen: React.FC = () => {
  const navigation = useNavigation<MenuScreenNavigationProp>();
  const route = useRoute<MenuScreenRouteProp>();
  const dispatch = useDispatch();

  const { restaurantName, mainFilter: initialMainFilter } = route.params ?? {};

  const dishes = useSelector(MenuFeature.selectors.selectDishes);
  const categories = useSelector(MenuFeature.selectors.selectCategories);
  const isLoading = useSelector(MenuFeature.selectors.selectMenuIsLoading);
  const error = useSelector(MenuFeature.selectors.selectMenuError);

  const [selectedFilter, setSelectedFilter] = useState<string>('');

  const filters = useMemo(() => {
    const categoryNames = [...new Set(categories.map((cat) => cat.name))];

    const allDishesFilter = 'Все блюда';

    let allFilters = [allDishesFilter, ...categoryNames];

    allFilters = [...new Set(allFilters)];

    return allFilters.sort((a, b) => {
      if (a === allDishesFilter) return -1;
      if (b === allDishesFilter) return 1;
      return a.localeCompare(b, 'ru');
    });
  }, [categories]);

  const hasSetInitialFilter = useRef(false);

  useEffect(() => {
    if (filters.length > 0 && !hasSetInitialFilter.current) {
      setSelectedFilter('Все блюда');
      hasSetInitialFilter.current = true;
    }
  }, [filters]);

  useEffect(() => {
    dispatch({ type: 'menu/fetchDishes' });
  }, [dispatch]);

  useEffect(() => {
    if (initialMainFilter && filters.includes(initialMainFilter)) {
      setSelectedFilter(initialMainFilter);
    }
  }, [initialMainFilter, filters]);

  const filteredDishes = useMemo(() => {
    if (!selectedFilter || selectedFilter === 'Все блюда') {
      return dishes;
    }

    return dishes.filter((dish) => dish.category.name === selectedFilter);
  }, [selectedFilter, dishes]);

  const handleFilterPress = useCallback((filter: string) => {
    setSelectedFilter(filter);
  }, []);

  const handleSearchPress = useCallback(() => {
    navigation.navigate('Search', {});
  }, [navigation]);

  const renderDishItem = useCallback(({ item }: { item: Dish }) => <DishCard item={item} />, []);

  const restaurantTitle = restaurantName ?? 'Кафе Цезарь';

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.waveSection}>
        <View style={styles.waveBackground}>
          <SubtractIcon width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
        </View>
        <View style={styles.searchContainer}>
          <View style={styles.searchWrapper}>
            <SearchInput onPress={handleSearchPress} placeholder="Поиск блюд..." />
            <Text style={styles.cafeTitle}>{restaurantTitle}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Меню</Text>

      {filters.length > 0 && (
        <View style={styles.filtersWrapper}>
          <FilterChips
            filters={filters}
            selectedFilters={[selectedFilter]}
            onSelectFilter={handleFilterPress}
          />
        </View>
      )}

      {isLoading && <ActivityIndicator size="large" color="#86EFAC" style={{ marginTop: 40 }} />}

      {!isLoading && (
        <FlatList
          data={filteredDishes}
          numColumns={2}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.dishesGrid}
          renderItem={renderDishItem}
          ListEmptyComponent={<Text style={styles.emptyText}>Нет блюд в этой категории</Text>}
          initialNumToRender={4}
          maxToRenderPerBatch={4}
          windowSize={3}
          removeClippedSubviews={true}
          updateCellsBatchingPeriod={50}
        />
      )}
    </View>
  );
};
