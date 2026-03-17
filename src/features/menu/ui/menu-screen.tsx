import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../../app/navigation/navigation-types';
import { Dish } from '../../../entities/api/types/menu-types';
import { Images } from '../../../shared/constants/images';
import { DishModal } from '../../../shared/dish-modal/dish-modal';
import { SearchInput } from '../../../shared/search/ui/search-input';
import { TAB_BAR_CIRCLE_OVERFLOW, TAB_BAR_HEIGHT } from '../../../shared/TabBar/TabBar';
import { CartFeature } from '../../cart';
import { FilterChips } from '../filter/filter-chips';
import { MenuFeature } from '../index';
import { styles } from './menu-styles';

type MenuScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;
type MenuScreenRouteProp = RouteProp<RootStackParamList, 'Menu'>;

const BASE_URL = 'https://gitlunch-backend-production.up.railway.app';
const SubtractIcon = Images.home.wave;
const AccountIcon = Images.navigation.account;

// Проверяет входит ли блюдо в категорию — поддерживает и массив categories и одиночное category
const dishMatchesCategory = (dish: Dish, categoryName: string): boolean => {
  if (dish.categories && dish.categories.length > 0) {
    return dish.categories.some((cat) => cat.name.toLowerCase() === categoryName.toLowerCase());
  }
  return dish.category?.name?.toLowerCase() === categoryName.toLowerCase();
};

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

  const dishes = useSelector(MenuFeature.selectors.selectDishes);
  const categories = useSelector(MenuFeature.selectors.selectCategories);
  const isLoading = useSelector(MenuFeature.selectors.selectMenuIsLoading);
  const error = useSelector(MenuFeature.selectors.selectMenuError);

  const [selectedFilter, setSelectedFilter] = useState<string>('Все');
  const [restaurantTitle, setRestaurantTitle] = useState<string>('Кафе Цезарь');
  const [selectedDishId, setSelectedDishId] = useState<number | null>(null);
  const lastAppliedTimestamp = useRef<number | null>(null);

  const filters = useMemo(() => {
    const categoryNames = [...new Set(categories.map((cat) => cat.name))];
    return categoryNames.sort((a, b) => {
      if (a === 'Все') return -1;
      if (b === 'Все') return 1;
      return a.localeCompare(b, 'ru');
    });
  }, [categories]);

  useEffect(() => {
    dispatch({ type: 'menu/fetchDishes' });
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      const params = route.params ?? {};
      const { mainFilter, restaurantName, filterTimestamp } = params as {
        mainFilter?: string;
        restaurantName?: string;
        filterTimestamp?: number;
      };

      if (filterTimestamp && filterTimestamp === lastAppliedTimestamp.current) return;
      if (!filterTimestamp) return;

      lastAppliedTimestamp.current = filterTimestamp;
      setRestaurantTitle(restaurantName ?? 'Кафе Цезарь');

      if (mainFilter && filters.includes(mainFilter)) {
        setSelectedFilter(mainFilter);
      } else if (filters.length > 0) {
        setSelectedFilter('Все');
      }
    }, [route.params, filters])
  );

  const filteredDishes = useMemo(() => {
    if (!selectedFilter || selectedFilter === 'Все') return dishes;
    return dishes.filter((dish) => dishMatchesCategory(dish, selectedFilter));
  }, [selectedFilter, dishes]);

  const handleFilterPress = useCallback((filter: string) => {
    setSelectedFilter(filter);
  }, []);

  const handleSearchPress = useCallback(() => {
    navigation.navigate('Search', {});
  }, [navigation]);

  const handleAccountPress = useCallback(() => {
    navigation.navigate('Tabs', { screen: 'Аккаунт' });
  }, [navigation]);

  const handleDishPress = useCallback((id: number) => {
    setSelectedDishId(id);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedDishId(null);
  }, []);

  const renderDishItem = useCallback(
    ({ item }: { item: Dish }) => (
      <TouchableOpacity activeOpacity={0.85} onPress={() => handleDishPress(item.id)}>
        <DishCard item={item} />
      </TouchableOpacity>
    ),
    [handleDishPress]
  );

  const accountButton = (
    <TouchableOpacity onPress={handleAccountPress} activeOpacity={0.7}>
      <AccountIcon width={36} height={36} />
    </TouchableOpacity>
  );

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
            <SearchInput
              onPress={handleSearchPress}
              placeholder="Поиск блюд..."
              rightElement={accountButton}
            />
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
          contentContainerStyle={[
            styles.dishesGrid,
            { paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_CIRCLE_OVERFLOW },
          ]}
          renderItem={renderDishItem}
          ListEmptyComponent={<Text style={styles.emptyText}>Нет блюд в этой категории</Text>}
          initialNumToRender={4}
          maxToRenderPerBatch={4}
          windowSize={3}
          removeClippedSubviews
          updateCellsBatchingPeriod={50}
        />
      )}

      <DishModal
        dishId={selectedDishId}
        visible={selectedDishId !== null}
        onClose={handleModalClose}
      />
    </View>
  );
};
