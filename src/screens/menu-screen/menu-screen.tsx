import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../app/navigation/navigation-types';
import { Category, Dish } from '../../entities/api/types/menu-types';
import { CartFeature } from '../../features/cart';
import { CartItem } from '../../features/cart/types';
import { FilterChips } from '../../features/filter/filter-chips';
import { MenuFeature } from '../../features/menu';
import { Images } from '../../shared/constants/images';
import { DishModal } from '../../shared/dish-modal/dish-modal';
import { SearchInput } from '../../shared/search/ui/search-input';
import { TAB_BAR_CIRCLE_OVERFLOW, TAB_BAR_HEIGHT } from '../../shared/TabBar/TabBar';
import { styles } from './menu-styles';

type MenuScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;
type MenuScreenRouteProp = RouteProp<RootStackParamList, 'Menu'>;

const BASE_URL = 'https://gitlunch-backend-production.up.railway.app';
const SubtractIcon = Images.home.wave;
const AccountIcon = Images.navigation.account;

const useDishCart = (dishId: string, dish: Dish) => {
  const dispatch = useDispatch();

  const cartItemSelector = useMemo(
    () => CartFeature.selectors.selectCartItemById(dishId),
    [dishId]
  );

  const cartItem = useSelector(cartItemSelector) as CartItem | null;
  const quantity = cartItem?.quantity ?? 0;

  const handleAdd = useCallback(() => {
    dispatch(
      CartFeature.actions.addToCart({
        id: dishId,
        cartItemId: cartItem?.cartItemId,
        name: dish.name,
        price: typeof dish.price === 'string' ? parseFloat(dish.price) : dish.price,
        imageSvg: dish.imageSvg,
        imageUrl: dish.image_url ? `${BASE_URL}${dish.image_url}` : undefined,
      })
    );
  }, [dispatch, dishId, dish, cartItem?.cartItemId]);

  const handleDecrease = useCallback(() => {
    dispatch(
      CartFeature.actions.decreaseQuantity({
        id: dishId,
        cartItemId: cartItem?.cartItemId,
      })
    );
  }, [dispatch, dishId, cartItem?.cartItemId]);

  return { quantity, handleAdd, handleDecrease };
};

const DishImage = React.memo(
  ({
    imageUrl,
    imageSvg,
  }: {
    imageUrl?: string;
    imageSvg?: React.ComponentType<{
      width: string;
      height: string;
      preserveAspectRatio: string;
    }>;
  }) => {
    if (imageUrl) {
      return (
        <Image
          source={{ uri: `${BASE_URL}${imageUrl}` }}
          style={{ width: '100%', height: '100%', borderRadius: 12 }}
          resizeMode="contain"
        />
      );
    }
    if (imageSvg) {
      const SvgImage = imageSvg;
      return <SvgImage width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />;
    }
    return <Text style={styles.imagePlaceholder}>🍽</Text>;
  }
);

const QuantityControls = React.memo(
  ({
    quantity,
    onIncrease,
    onDecrease,
  }: {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
  }) => {
    if (quantity === 0) {
      return (
        <TouchableOpacity style={styles.addToCartButton} onPress={onIncrease}>
          <Text style={styles.addToCartButtonText}>В корзину</Text>
        </TouchableOpacity>
      );
    }
    return (
      <View style={styles.quantityControl}>
        <TouchableOpacity style={styles.quantityButton} onPress={onDecrease}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity style={styles.quantityButton} onPress={onIncrease}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }
);

const DishCard = React.memo(({ item }: { item: Dish }) => {
  const dishId = String(item.id);
  const { quantity, handleAdd, handleDecrease } = useDishCart(dishId, item);

  return (
    <LinearGradient
      colors={['#86EFAC', '#A8F0B5', '#F4F4F4']}
      locations={[0, 0.2, 0.6]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.dishCard}
    >
      <View style={styles.imageContainer}>
        <DishImage imageUrl={item.image_url} imageSvg={item.imageSvg} />
      </View>
      <Text style={styles.dishName} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.dishPrice}>
        {typeof item.price === 'string' ? parseFloat(item.price) : item.price} ₽
      </Text>
      <QuantityControls quantity={quantity} onIncrease={handleAdd} onDecrease={handleDecrease} />
    </LinearGradient>
  );
});

export const MenuScreen: React.FC = () => {
  const navigation = useNavigation<MenuScreenNavigationProp>();
  const route = useRoute<MenuScreenRouteProp>();
  const dispatch = useDispatch();

  const filteredDishes = useSelector(MenuFeature.selectors.selectFilteredDishes);
  const categories = useSelector(MenuFeature.selectors.selectCategories);
  const selectedFilter = useSelector(MenuFeature.selectors.selectSelectedFilter);
  const isLoading = useSelector(MenuFeature.selectors.selectMenuIsLoading);
  const error = useSelector(MenuFeature.selectors.selectMenuError);

  const [restaurantTitle, setRestaurantTitle] = useState<string>('Кафе Цезарь');
  const [selectedDishId, setSelectedDishId] = useState<number | null>(null);
  const lastAppliedTimestamp = useRef<number | null>(null);

  const filters = useMemo(() => {
    return [...new Set(categories.map((cat: Category) => cat.name))];
  }, [categories]);

  useEffect(() => {
    dispatch(MenuFeature.actions.fetchDishes());
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
        dispatch(MenuFeature.actions.changeFilter(mainFilter));
      }
    }, [route.params, filters, dispatch])
  );

  const handleFilterPress = useCallback(
    (filter: string) => {
      dispatch(MenuFeature.actions.changeFilter(filter));
    },
    [dispatch]
  );

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
              placeholder="Поиск"
              rightElement={
                <TouchableOpacity onPress={handleAccountPress} activeOpacity={0.7}>
                  <AccountIcon width={36} height={36} />
                </TouchableOpacity>
              }
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
