import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SearchInput } from '../../shared/search/ui/search-input';
import { styles } from './home-styles';

const { width } = Dimensions.get('window');

// Типы для навигации
type TabScreen = 'Главная' | 'Меню' | 'Корзина' | 'Аккаунт';

type RootStackParamList = {
  Tabs: {
    screen: TabScreen;
    params?: MenuScreenParams;
  };
  Search: {
    category?: string;
    onSearch?: (query: string) => void;
  };
};

type MenuScreenParams = {
  filterType?: FilterType;
  restaurantId?: string;
  restaurantName?: string;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

// Типы для фильтров
type FilterType = 'горячее' | 'салаты' | 'десерты' | 'закуски' | 'новинки';

interface FilterBlock {
  id: FilterType;
  title: string;
}

interface Restaurant {
  id: string;
  name: string;
}

// Данные
const FILTER_BLOCKS: FilterBlock[] = [
  { id: 'горячее', title: 'Горячее' },
  { id: 'салаты', title: 'Салаты' },
  { id: 'десерты', title: 'Десерты' },
  { id: 'закуски', title: 'Закуски' },
];

const RESTAURANTS: Restaurant[] = [
  { id: '1', name: 'Цезарь' },
  { id: '2', name: 'Ресторан 2' },
];

const INFINITE_DATA = [...RESTAURANTS, ...RESTAURANTS, ...RESTAURANTS];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const flatListRef = useRef<FlatList<Restaurant>>(null);
  const [currentIndex, setCurrentIndex] = useState(RESTAURANTS.length);

  const handleSearchPress = () => {
    navigation.navigate('Search', {});
  };

  const handleFilterPress = (filterType: FilterType) => {
    navigation.navigate('Tabs', {
      screen: 'Меню',
      params: { filterType },
    });
  };

  const handleNewPress = () => {
    navigation.navigate('Tabs', {
      screen: 'Меню',
      params: { filterType: 'новинки' },
    });
  };

  const handleRestaurantPress = (restaurant: Restaurant) => {
    if (restaurant.name === 'Цезарь') {
      navigation.navigate('Tabs', {
        screen: 'Меню',
        params: {
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
        },
      });
    }
  };

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const index = Math.round(contentOffset.x / width);

    setCurrentIndex(index);

    if (index === 0) {
      flatListRef.current?.scrollToIndex({
        index: INFINITE_DATA.length - 2,
        animated: false,
      });
      setCurrentIndex(INFINITE_DATA.length - 2);
    } else if (index === INFINITE_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: 1,
        animated: false,
      });
      setCurrentIndex(1);
    }
  };

  const getItemLayout = (data: ArrayLike<Restaurant> | null | undefined, index: number) => ({
    length: width,
    offset: width * index,
    index,
  });

  const renderRestaurantItem: ListRenderItem<Restaurant> = ({ item }) => (
    <TouchableOpacity
      style={styles.carouselItem}
      onPress={() => handleRestaurantPress(item)}
      activeOpacity={1}
    >
      <View style={styles.largeBlock}>
        <Text style={styles.largeBlockText} numberOfLines={2} ellipsizeMode="tail">
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const getDisplayIndex = (realIndex: number) => {
    return realIndex % RESTAURANTS.length;
  };

  const renderDot = (index: number) => {
    const displayIndex = getDisplayIndex(currentIndex);
    return <View key={index} style={[styles.dot, displayIndex === index && styles.activeDot]} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchInput onPress={handleSearchPress} placeholder="Поиск блюд..." />
      </View>

      {/* Сетка из 4 мини-блоков */}
      <View style={styles.gridContainer}>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.block}
            onPress={() => handleFilterPress('горячее')}
            activeOpacity={1}
          >
            <Text style={styles.blockText}>Горячее</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.block}
            onPress={() => handleFilterPress('салаты')}
            activeOpacity={1}
          >
            <Text style={styles.blockText}>Салаты</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.block}
            onPress={() => handleFilterPress('десерты')}
            activeOpacity={1}
          >
            <Text style={styles.blockText}>Десерты</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.block}
            onPress={() => handleFilterPress('закуски')}
            activeOpacity={1}
          >
            <Text style={styles.blockText}>Закуски</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Большой блок для новинок */}
      <View style={styles.largeBlockContainer}>
        <TouchableOpacity
          style={styles.largeBlock}
          onPress={() => handleFilterPress('новинки')}
          activeOpacity={1}
        >
          <Text style={styles.largeBlockText}>Новинки</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Рестораны</Text>

      <View>
        <FlatList
          ref={flatListRef}
          data={INFINITE_DATA}
          renderItem={renderRestaurantItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          decelerationRate="fast"
          getItemLayout={getItemLayout}
          initialScrollIndex={RESTAURANTS.length}
          removeClippedSubviews={false}
        />

        <View style={styles.dotsContainer}>{RESTAURANTS.map((_, index) => renderDot(index))}</View>
      </View>
    </View>
  );
};
