import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  ListRenderItem,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../app/navigation/navigation-types';
import { PromoDish, Restaurant } from '../../entities/api/types/home-types';
import { DishCard } from '../../features/dish-card';
import { DishModalFeature } from '../../features/dish-modal';
import { HomeFeature } from '../../features/home';
import { FILTER_MAPPING } from '../../shared/constants/constants';
import { Images } from '../../shared/constants/images';
import { FilterGrid } from '../../shared/home-filter/filter-grid/filter-grid';
import { SearchInput } from '../../shared/search/ui/search-input';
import { TAB_BAR_CIRCLE_OVERFLOW, TAB_BAR_HEIGHT } from '../../shared/TabBar/TabBar';
import { styles } from './home-styles';

const { width } = Dimensions.get('window');
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

const SubtractIcon = Images.home.wave;
const RestCezarIcon = Images.home.restCezar;
const AccountIcon = Images.navigation.account;

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

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useDispatch();
  const pagerRef = useRef<PagerView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  const restaurants = useSelector(HomeFeature.selectors.selectRestaurants);
  const promoDishes = useSelector(HomeFeature.selectors.selectPromoDishes);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(HomeFeature.actions.fetchRestaurants());
    }, 250);
    return () => clearTimeout(timer);
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

  const handleFilterPress = useCallback(
    (filter: string) => {
      navigation.navigate('Tabs', {
        screen: 'Меню',
        params: { mainFilter: FILTER_MAPPING[filter] ?? filter, filterTimestamp: Date.now() },
      });
    },
    [navigation]
  );

  const handleDishPress = useCallback(
    (id: string | number) => {
      dispatch(DishModalFeature.actions.openDishModal(Number(id)));
    },
    [dispatch]
  );

  const renderPromoItem: ListRenderItem<PromoDish> = useCallback(
    ({ item }) => (
      <View style={styles.promoCardContainer}>
        <DishCard item={item} onPress={() => handleDishPress(item.id)} />
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
      <TouchableOpacity
        onPress={() => navigation.navigate('Tabs', { screen: 'Аккаунт' })}
        activeOpacity={0.7}
      >
        <AccountIcon width={36} height={36} />
      </TouchableOpacity>
    ),
    [navigation]
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
              onPress={() => navigation.navigate('Search', {})}
              placeholder="Поиск"
              rightElement={accountButton}
            />
          </View>
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_CIRCLE_OVERFLOW + insets.bottom,
        }}
        removeClippedSubviews={true}
      >
        <View style={styles.waveSection}>
          <View style={styles.waveBackground}>
            <SubtractIcon width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
          </View>
          <SafeAreaView edges={['top']} style={styles.searchContainer}>
            <View style={styles.searchWrapper}>
              <SearchInput
                onPress={() => navigation.navigate('Search', {})}
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
                  <RestaurantCarouselItem
                    item={item}
                    onPress={(res) =>
                      navigation.navigate('Tabs', {
                        screen: 'Меню',
                        params: {
                          restaurantId: res.id,
                          restaurantName: res.name,
                          filterTimestamp: Date.now(),
                        },
                      })
                    }
                  />
                </View>
              ))}
            </PagerView>
            <PaginationDots count={restaurants.length} currentIndex={currentIndex} />
          </View>

          <View style={styles.promoSection}>
            <Text style={styles.sectionTitle}>Акции дня</Text>
            <FlatList
              data={promoDishes}
              renderItem={renderPromoItem}
              keyExtractor={(item) => String(item.id)}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.promoList}
              initialNumToRender={3}
              maxToRenderPerBatch={5}
              windowSize={5}
              removeClippedSubviews={Platform.OS === 'android'}
            />
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};
