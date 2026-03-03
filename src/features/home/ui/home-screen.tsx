import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MOCK_PROMO_DISHES, MOCK_RESTAURANTS } from '../../../../mocks';
import { RootStackParamList, SubFilterType } from '../../../app/navigation/navigation-types';
import { PromoDish, Restaurant } from '../../../entities/api/types/home-types';
import { Images } from '../../../shared/constants/images';
import { SearchInput } from '../../../shared/search/ui/search-input';
import { CartFeature } from '../../cart';
import { styles } from './home-styles';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

const HotIcon = Images.filters.hot;
const SaladsIcon = Images.filters.salads;
const SnacksIcon = Images.filters.snacks;
const DessertsIcon = Images.filters.desserts;

const PromoDishCard = React.memo(({ item }: { item: PromoDish }) => {
  const dispatch = useDispatch();
  const cartItemSelector = useMemo(
    () => CartFeature.selectors.selectCartItemById(item.id),
    [item.id]
  );
  const cartItem = useSelector(cartItemSelector);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = useCallback(() => {
    dispatch(CartFeature.actions.addToCart({ id: item.id, name: item.name, price: item.price }));
  }, [dispatch, item.id, item.name, item.price]);

  const handleDecrease = useCallback(() => {
    dispatch(CartFeature.actions.decreaseQuantity(item.id));
  }, [dispatch, item.id]);

  return (
    <View style={styles.dishCard}>
      <View style={styles.imageContainer}>
        <Text style={styles.imagePlaceholder}>{Images.promo.placeholder}</Text>
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

const PaginationDots = React.memo(
  ({ count, currentIndex }: { count: number; currentIndex: number }) => (
    <View style={styles.dotsContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={[styles.dot, currentIndex === index && styles.activeDot]} />
      ))}
    </View>
  )
);

const RestaurantCarouselItem = React.memo(
  ({ item, onPress }: { item: Restaurant; onPress: (item: Restaurant) => void }) => (
    <TouchableOpacity style={styles.carouselItem} onPress={() => onPress(item)} activeOpacity={1}>
      <View style={styles.largeBlock}>
        <Text style={styles.largeBlockText} numberOfLines={2} ellipsizeMode="tail">
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  )
);

const FilterGrid = React.memo(({ onFilterPress }: { onFilterPress: (filter: string) => void }) => (
  <>
    <View style={styles.gridContainer}>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.filterBlock}
          onPress={() => onFilterPress('горячее')}
          activeOpacity={0.7}
        >
          <HotIcon width={100} height={100} style={styles.filterIcon} />
          <Text style={styles.filterText}>Горячее</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterBlock}
          onPress={() => onFilterPress('салаты')}
          activeOpacity={0.7}
        >
          <SaladsIcon width={100} height={100} style={styles.filterIcon} />
          <Text style={styles.filterText}>Салаты</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.filterBlock}
          onPress={() => onFilterPress('десерты')}
          activeOpacity={0.7}
        >
          <DessertsIcon width={100} height={100} style={styles.filterIcon} />
          <Text style={styles.filterText}>Десерты</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterBlock}
          onPress={() => onFilterPress('закуски')}
          activeOpacity={0.7}
        >
          <SnacksIcon width={100} height={100} style={styles.filterIcon} />
          <Text style={styles.filterText}>Закуски</Text>
        </TouchableOpacity>
      </View>
    </View>

    <View style={styles.largeBlockContainer}>
      <TouchableOpacity
        style={styles.noveltyBlock}
        onPress={() => onFilterPress('новинки')}
        activeOpacity={1}
      >
        <Text style={styles.noveltyBlockText}>Новинки</Text>
      </TouchableOpacity>
    </View>
  </>
));

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const flatListRef = useRef<FlatList<Restaurant>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const restaurants = useMemo(() => MOCK_RESTAURANTS, []);
  const promoDishes = useMemo(() => MOCK_PROMO_DISHES, []);

  const infiniteData = useMemo(() => {
    if (restaurants.length === 0) return [];
    return [restaurants[restaurants.length - 1], ...restaurants, restaurants[0]];
  }, [restaurants]);

  useEffect(() => {
    if (restaurants.length > 0) {
      setCurrentIndex(0);
      flatListRef.current?.scrollToIndex({
        index: 1,
        animated: false,
      });
    }
  }, [restaurants]);

  const handleSearchPress = useCallback(() => {
    navigation.navigate('Search', {});
  }, [navigation]);

  const handleFilterPress = useCallback(
    (filter: string) => {
      if (filter === 'акции') {
        navigation.navigate('Tabs', {
          screen: 'Меню',
          params: { mainFilter: 'акции' },
        });
        return;
      }

      navigation.navigate('Tabs', {
        screen: 'Меню',
        params: {
          mainFilter: 'Все',
          subFilters: [filter as SubFilterType],
        },
      });
    },
    [navigation]
  );

  const handleRestaurantPress = useCallback(
    (restaurant: Restaurant) => {
      if (restaurant.name === 'Цезарь') {
        navigation.navigate('Tabs', {
          screen: 'Меню',
          params: {
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
          },
        });
      }
    },
    [navigation]
  );

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const contentOffset = event.nativeEvent.contentOffset;
      const index = Math.round(contentOffset.x / width);

      const realIndex = (index - 1 + restaurants.length) % restaurants.length;
      setCurrentIndex(realIndex);

      if (index === 0) {
        flatListRef.current?.scrollToIndex({
          index: infiniteData.length - 2,
          animated: false,
        });
      } else if (index === infiniteData.length - 1) {
        flatListRef.current?.scrollToIndex({
          index: 1,
          animated: false,
        });
      }
    },
    [restaurants.length, infiniteData.length]
  );

  const getItemLayout = useCallback(
    (data: ArrayLike<Restaurant> | null | undefined, index: number) => ({
      length: width,
      offset: width * index,
      index,
    }),
    []
  );

  const renderRestaurantItem: ListRenderItem<Restaurant> = useCallback(
    ({ item }) => <RestaurantCarouselItem item={item} onPress={handleRestaurantPress} />,
    [handleRestaurantPress]
  );

  const renderPromoItem: ListRenderItem<PromoDish> = useCallback(
    ({ item }) => (
      <View style={styles.promoCardContainer}>
        <PromoDishCard item={item} />
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item: Restaurant, index: number) => `${item.id}-${index}`, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.searchContainer}>
        <SearchInput onPress={handleSearchPress} placeholder="Поиск блюд..." />
      </View>

      <FilterGrid onFilterPress={handleFilterPress} />

      <Text style={styles.sectionTitle}>Рестораны</Text>

      <View>
        <FlatList
          ref={flatListRef}
          data={infiniteData}
          renderItem={renderRestaurantItem}
          keyExtractor={keyExtractor}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          decelerationRate="fast"
          getItemLayout={getItemLayout}
          initialScrollIndex={1}
          scrollEnabled={true}
          removeClippedSubviews={true}
          maxToRenderPerBatch={3}
          windowSize={3}
        />

        <PaginationDots count={restaurants.length} currentIndex={currentIndex} />
      </View>

      <View style={styles.promoSection}>
        <Text style={styles.sectionTitle}>Акции дня</Text>
        <FlatList
          data={promoDishes}
          renderItem={renderPromoItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.promoList}
          decelerationRate="fast"
          removeClippedSubviews={true}
          maxToRenderPerBatch={3}
          windowSize={3}
        />
      </View>
      <View style={{ height: 20 }} />
    </ScrollView>
  );
};
