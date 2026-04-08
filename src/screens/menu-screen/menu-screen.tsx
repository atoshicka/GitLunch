import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../app/navigation/navigation-types';
import { Category, Dish } from '../../entities/api/types/menu-types';
import { DishCard } from '../../features/dish-card';
import { FilterChips } from '../../features/filter/filter-chips';
import { MenuFeature } from '../../features/menu';
import { Images } from '../../shared/constants/images';
import { DishModal } from '../../shared/dish-modal/dish-modal';
import { SearchInput } from '../../shared/search/ui/search-input';
import { TAB_BAR_CIRCLE_OVERFLOW, TAB_BAR_HEIGHT } from '../../shared/TabBar/TabBar';
import { styles } from './menu-styles';

type MenuScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;
type MenuScreenRouteProp = RouteProp<RootStackParamList, 'Menu'>;

const SubtractIcon = Images.home.wave;
const AccountIcon = Images.navigation.account;

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

  const filters = useMemo(() => categories.map((cat: Category) => cat.name), [categories]);

  useEffect(() => {
    dispatch(MenuFeature.actions.fetchDishes());
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      const { mainFilter, restaurantName, filterTimestamp } = route.params ?? {};
      if (filterTimestamp && filterTimestamp !== lastAppliedTimestamp.current) {
        lastAppliedTimestamp.current = filterTimestamp;
        setRestaurantTitle(restaurantName ?? 'Кафе Цезарь');
        if (mainFilter && filters.includes(mainFilter)) {
          dispatch(MenuFeature.actions.changeFilter(mainFilter));
        }
      }
    }, [route.params, filters, dispatch])
  );

  const renderDishItem = useCallback(
    ({ item }: { item: Dish }) => (
      <View style={{ flex: 0.5, padding: 4 }}>
        <DishCard item={item} onPress={() => setSelectedDishId(item.id)} />
      </View>
    ),
    []
  );

  if (error)
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>{error}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.waveSection}>
        <View style={styles.waveBackground}>
          <SubtractIcon width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
        </View>
        <View style={styles.searchContainer}>
          <View style={styles.searchWrapper}>
            <SearchInput
              onPress={() => navigation.navigate('Search', {})}
              placeholder="Поиск"
              rightElement={
                <TouchableOpacity
                  onPress={() => navigation.navigate('Tabs', { screen: 'Аккаунт' })}
                >
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
            onSelectFilter={(f) => dispatch(MenuFeature.actions.changeFilter(f))}
          />
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator size="large" color="#86EFAC" style={{ marginTop: 40 }} />
      ) : (
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
          removeClippedSubviews
        />
      )}

      <DishModal
        dishId={selectedDishId}
        visible={selectedDishId !== null}
        onClose={() => setSelectedDishId(null)}
      />
    </View>
  );
};
