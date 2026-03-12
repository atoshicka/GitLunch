import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { MAIN_FILTERS, SUB_FILTERS } from '../../app/constants/filters';
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

const SubtractIcon = Images.home.wave;

const DishCard = React.memo(({ item }: { item: Dish }) => {
  const dispatch = useDispatch();
  const cartItemSelector = useMemo(
    () => CartFeature.selectors.selectCartItemById(item.id),
    [item.id]
  );
  const cartItem = useSelector(cartItemSelector);
  const quantity = cartItem?.quantity ?? 0;

  const handleAddToCart = useCallback(() => {
    dispatch(
      CartFeature.actions.addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        imageSvg: item.imageSvg,
      })
    );
  }, [dispatch, item.id, item.name, item.price, item.imageSvg]);

  const handleDecrease = useCallback(() => {
    dispatch(CartFeature.actions.decreaseQuantity(item.id));
  }, [dispatch, item.id]);

  const renderImage = () => {
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

  const {
    restaurantName,
    mainFilter: initialMainFilter,
    subFilters: initialSubFilters,
  } = route.params ?? {};

  const dishes = useSelector(MenuFeature.selectors.selectDishes);
  const isLoading = useSelector(MenuFeature.selectors.selectMenuIsLoading);
  const error = useSelector(MenuFeature.selectors.selectMenuError);

  const [mainFilter, setMainFilter] = useState<string>(initialMainFilter ?? 'Все');
  const [subFilters, setSubFilters] = useState<string[]>(initialSubFilters ?? []);

  useEffect(() => {
    dispatch({ type: 'menu/fetchDishes' });
  }, [dispatch]);
  useEffect(() => {
    if (initialMainFilter) {
      setMainFilter(initialMainFilter);
      if (initialMainFilter === 'акции') setSubFilters([]);
    }
  }, [initialMainFilter]);

  useEffect(() => {
    if (initialSubFilters) setSubFilters(initialSubFilters);
  }, [initialSubFilters]);

  const filteredDishes = useMemo(() => {
    const subFiltersSet = new Set(subFilters);
    if (mainFilter === 'акции') return dishes.filter((dish) => dish.isPromo);
    if (subFilters.length === 0) return dishes;
    return dishes.filter((dish) => dish.filterType && subFiltersSet.has(dish.filterType));
  }, [mainFilter, subFilters, dishes]);

  const handleMainFilterPress = useCallback((filter: string) => {
    if (filter === 'Все' || filter === 'акции') {
      setMainFilter(filter);
      if (filter === 'акции') setSubFilters([]);
    }
  }, []);

  const handleSubFilterPress = useCallback((filter: string) => {
    setSubFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  }, []);

  const handleSearchPress = useCallback(() => {
    navigation.navigate('Search', {});
  }, [navigation]);

  const getTitle = useCallback(() => {
    return mainFilter === 'акции' ? 'Акции дня' : 'Меню';
  }, [mainFilter]);

  const renderDishItem = useCallback(({ item }: { item: Dish }) => <DishCard item={item} />, []);

  const restaurantTitle = restaurantName ?? 'Кафе Цезарь';

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

      <Text style={styles.sectionTitle}>{getTitle()}</Text>

      <View style={styles.filtersWrapper}>
        <FilterChips
          filters={MAIN_FILTERS as unknown as string[]}
          selectedFilters={[mainFilter]}
          onSelectFilter={handleMainFilterPress}
        />
      </View>

      {mainFilter === 'Все' && (
        <View style={styles.filtersWrapper}>
          <FilterChips
            filters={SUB_FILTERS as unknown as string[]}
            selectedFilters={subFilters}
            onSelectFilter={handleSubFilterPress}
          />
        </View>
      )}

      {isLoading && <ActivityIndicator size="large" color="#86EFAC" style={{ marginTop: 40 }} />}

      {!!error && !isLoading && <Text style={styles.emptyText}>{error}</Text>}

      {!isLoading && !error && (
        <FlatList
          data={filteredDishes}
          numColumns={2}
          keyExtractor={(item) => item.id}
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
