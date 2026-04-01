import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ListRenderItem,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../app/navigation/navigation-types';
import { PromoDish, Restaurant } from '../../entities/api/types/home-types';
import { CartFeature } from '../../features/cart';
import { CartItem } from '../../features/cart/types';
import { HomeFeature } from '../../features/home';
import { Images } from '../../shared/constants/images';
import { DishModal } from '../../shared/dish-modal/dish-modal';
import { SearchInput } from '../../shared/search/ui/search-input';
import { TAB_BAR_CIRCLE_OVERFLOW, TAB_BAR_HEIGHT } from '../../shared/TabBar/TabBar';
import { styles } from './home-styles';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

const HotIcon = Images.filters.hot;
const SaladsIcon = Images.filters.salads;
const SnacksIcon = Images.filters.snacks;
const DessertsIcon = Images.filters.desserts;
const SubtractIcon = Images.home.wave;
const RestCezarIcon = Images.home.restCezar;
const NowinIcon = Images.home.nowin;
const AccountIcon = Images.navigation.account;

interface PromoDishCardProps {
  item: PromoDish;
  onPress: () => void;
}

const PromoDishCard = React.memo(({ item, onPress }: PromoDishCardProps) => {
  const dispatch = useDispatch();

  const cartItem = useSelector(
    CartFeature.selectors.selectCartItemById(item.id)
  ) as CartItem | null;
  const quantity = cartItem?.quantity ?? 0;

  const handleAddToCart = useCallback(() => {
    dispatch(
      CartFeature.actions.addToCart({
        id: item.id,
        cartItemId: cartItem?.cartItemId,
        name: item.name,
        price: item.price,
        imageSvg: item.imageSvg,
        imageUrl: item.imageUrl,
      })
    );
  }, [dispatch, item, cartItem?.cartItemId]);

  const handleDecrease = useCallback(() => {
    dispatch(
      CartFeature.actions.decreaseQuantity({
        id: item.id,
        cartItemId: cartItem?.cartItemId,
      })
    );
  }, [dispatch, item.id, cartItem?.cartItemId]);

  const renderImage = () => {
    if (item.imageUrl) {
      return (
        <Image source={{ uri: item.imageUrl }} style={styles.dishImage} resizeMode="contain" />
      );
    }
    if (item.imageSvg) {
      const SvgImage = item.imageSvg;
      return <SvgImage width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />;
    }
    return <Text style={styles.imagePlaceholder}>🍽</Text>;
  };

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
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
    </TouchableOpacity>
  );
});

const PaginationDots = React.memo(
  ({ count, currentIndex }: { count: number; currentIndex: number }) => (
    <View style={styles.dotsContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={`dot-${index}`}
          style={[styles.dot, currentIndex === index && styles.activeDot]}
        />
      ))}
    </View>
  )
);

const RestaurantCarouselItem = React.memo(
  ({ item, onPress }: { item: Restaurant; onPress: (item: Restaurant) => void }) => (
    <TouchableOpacity style={styles.carouselItem} onPress={() => onPress(item)} activeOpacity={0.9}>
      {item.name === 'Цезарь' ? (
        <View style={styles.restaurantImageBlock}>
          <RestCezarIcon width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
        </View>
      ) : (
        <View style={styles.restaurantTextBlock}>
          <Text style={styles.restaurantBlockText} numberOfLines={2}>
            {item.name}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )
);

const FilterGrid = React.memo(({ onFilterPress }: { onFilterPress: (filter: string) => void }) => (
  <View style={styles.filterGridContainer}>
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.filterBlock}
        onPress={() => onFilterPress('горячее')}
        activeOpacity={0.7}
      >
        <HotIcon width={80} height={80} style={styles.filterIcon} />
        <Text style={styles.filterText}>Горячее</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.filterBlock}
        onPress={() => onFilterPress('салаты')}
        activeOpacity={0.7}
      >
        <SaladsIcon width={80} height={80} style={styles.filterIcon} />
        <Text style={styles.filterText}>Салаты</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.filterBlock}
        onPress={() => onFilterPress('десерты')}
        activeOpacity={0.7}
      >
        <DessertsIcon width={80} height={80} style={styles.filterIcon} />
        <Text style={styles.filterText}>Десерты</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.filterBlock}
        onPress={() => onFilterPress('закуски')}
        activeOpacity={0.7}
      >
        <SnacksIcon width={80} height={80} style={styles.filterIcon} />
        <Text style={styles.filterText}>Бизнес-ланч</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.largeBlockContainer}>
      <TouchableOpacity
        style={styles.noveltyBlock}
        onPress={() => onFilterPress('новинки')}
        activeOpacity={0.9}
      >
        <NowinIcon
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          style={styles.noveltyImage}
        />
      </TouchableOpacity>
    </View>
  </View>
));

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useDispatch();
  const pagerRef = useRef<PagerView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDishId, setSelectedDishId] = useState<number | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const restaurants = useSelector(HomeFeature.selectors.selectRestaurants);
  const promoDishes = useSelector(HomeFeature.selectors.selectPromoDishes);

  useEffect(() => {
    dispatch(HomeFeature.actions.fetchRestaurants());
  }, [dispatch]);

  const { headerOpacity, headerTranslateY } = useMemo(
    () => ({
      headerOpacity: scrollY.interpolate({
        inputRange: [0, 80],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
      headerTranslateY: scrollY.interpolate({
        inputRange: [0, 80],
        outputRange: [-100, 0],
        extrapolate: 'clamp',
      }),
    }),
    [scrollY]
  );

  const handleSearchPress = useCallback(() => {
    navigation.navigate('Search', {});
  }, [navigation]);

  const handleAccountPress = useCallback(() => {
    navigation.navigate('Tabs', { screen: 'Аккаунт' });
  }, [navigation]);

  const handleFilterPress = useCallback(
    (filter: string) => {
      const filterMapping: Record<string, string> = {
        горячее: 'Горячее',
        салаты: 'Салаты',
        десерты: 'Десерты',
        закуски: 'Бизнес-ланч',
        новинки: 'Новинки',
      };
      const menuFilter = filterMapping[filter] ?? filter;
      navigation.navigate('Tabs', {
        screen: 'Меню',
        params: { mainFilter: menuFilter, filterTimestamp: Date.now() },
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
            filterTimestamp: Date.now(),
          },
        });
      }
    },
    [navigation]
  );

  const handleDishPress = useCallback((id: number) => {
    setSelectedDishId(id);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedDishId(null);
  }, []);

  const renderPromoItem: ListRenderItem<PromoDish> = useCallback(
    ({ item }) => (
      <View style={styles.promoCardContainer}>
        <PromoDishCard item={item} onPress={() => handleDishPress(Number(item.id))} />
      </View>
    ),
    [handleDishPress]
  );

  const handleScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: true,
      }),
    [scrollY]
  );

  const accountButton = useMemo(
    () => (
      <TouchableOpacity onPress={handleAccountPress} activeOpacity={0.7}>
        <AccountIcon width={36} height={36} />
      </TouchableOpacity>
    ),
    [handleAccountPress]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.floatingHeader,
          { transform: [{ translateY: headerTranslateY }], opacity: headerOpacity, zIndex: 10 },
        ]}
      >
        <SafeAreaView edges={['top']} style={styles.floatingHeaderSafe}>
          <View style={styles.floatingHeaderContent}>
            <SearchInput
              onPress={handleSearchPress}
              placeholder="Поиск"
              rightElement={accountButton}
            />
          </View>
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_CIRCLE_OVERFLOW }}
        removeClippedSubviews={true}
      >
        <View style={styles.waveSection}>
          <View style={styles.waveBackground}>
            <SubtractIcon width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
          </View>
          <SafeAreaView edges={['top']} style={styles.searchContainer}>
            <View style={styles.searchWrapper}>
              <SearchInput
                onPress={handleSearchPress}
                placeholder="Поиск"
                rightElement={accountButton}
              />
            </View>
          </SafeAreaView>
        </View>

        <View style={styles.contentWrapper}>
          <FilterGrid onFilterPress={handleFilterPress} />

          <Text style={styles.sectionTitle}>Рестораны</Text>
          <View>
            <PagerView
              ref={pagerRef}
              style={{ width, height: 180 }}
              initialPage={0}
              onPageSelected={(e) => setCurrentIndex(e.nativeEvent.position)}
              offscreenPageLimit={2}
            >
              {restaurants.map((item) => (
                <View key={item.id}>
                  <RestaurantCarouselItem item={item} onPress={handleRestaurantPress} />
                </View>
              ))}
            </PagerView>
            <PaginationDots count={restaurants.length} currentIndex={currentIndex} />
          </View>

          <View style={styles.promoSection}>
            <Text style={styles.sectionTitle}>Акции дня</Text>
            {promoDishes.length === 0 ? (
              <View style={styles.emptyPromoContainer}>
                <Text style={styles.emptyPromoText}>Нет акционных блюд</Text>
              </View>
            ) : (
              <FlatList
                data={promoDishes}
                renderItem={renderPromoItem}
                keyExtractor={(item) => String(item.id)}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.promoList}
                decelerationRate="fast"
                initialNumToRender={3}
                windowSize={3}
              />
            )}
          </View>
        </View>
      </Animated.ScrollView>

      <DishModal
        dishId={selectedDishId}
        visible={selectedDishId !== null}
        onClose={handleModalClose}
      />
    </View>
  );
};
