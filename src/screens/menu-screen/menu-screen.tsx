import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../app/navigation/navigation-types';
import { Dish } from '../../entities/api/types/menu-types';
import { DishCard } from '../../features/dish-card';
import { DishModalFeature } from '../../features/dish-modal';
import { FilterChips } from '../../features/filter/filter-chips';
import { MenuFeature } from '../../features/menu';
import { MenuDaySection } from '../../features/menu/types';
import { Images } from '../../shared/constants/images';
import { SCREEN_NAMES, TAB_NAMES } from '../../shared/constants/navigation/navigation';
import { SearchInput } from '../../shared/search/ui/search-input';
import { TAB_BAR_CIRCLE_OVERFLOW, TAB_BAR_HEIGHT } from '../../shared/TabBar/TabBar';
import { styles } from './menu-styles';

type MenuScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;
type MenuScreenRouteProp = RouteProp<RootStackParamList, 'Menu'>;

const SubtractIcon = Images.home.wave;
const AccountIcon = Images.navigation.account;

const chunkDishes = (dishes: Dish[]): Dish[][] => {
  const pairs: Dish[][] = [];
  for (let i = 0; i < dishes.length; i += 2) {
    pairs.push(dishes.slice(i, i + 2));
  }
  return pairs;
};

interface MenuSection {
  day: string;
  wday: number;
  data: Dish[][];
}

export const MenuScreen: React.FC = () => {
  const navigation = useNavigation<MenuScreenNavigationProp>();
  const route = useRoute<MenuScreenRouteProp>();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const menuByDays = useSelector(MenuFeature.selectors.selectFilteredMenuByDays);
  const categories = useSelector(MenuFeature.selectors.selectCategories);
  const selectedFilter = useSelector(MenuFeature.selectors.selectSelectedFilter);
  const isLoading = useSelector(MenuFeature.selectors.selectMenuIsLoading);
  const error = useSelector(MenuFeature.selectors.selectMenuError);

  const [restaurantTitle, setRestaurantTitle] = useState<string>('Кафе Цезарь');
  const lastAppliedTimestamp = useRef<number | null>(null);

  const filters = useMemo(
    () => Array.from(new Set(categories.map((cat) => cat.name))),
    [categories]
  );

  const sections = useMemo<MenuSection[]>(
    () =>
      menuByDays.map((day: MenuDaySection) => ({
        day: day.day,
        wday: day.wday,
        data: chunkDishes(day.dishes),
      })),
    [menuByDays]
  );

  useEffect(() => {
    dispatch(MenuFeature.actions.fetchDishes());
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      const { mainFilter, restaurantName, filterTimestamp } = route.params ?? {};
      if (filterTimestamp && filterTimestamp !== lastAppliedTimestamp.current) {
        lastAppliedTimestamp.current = filterTimestamp;
        setRestaurantTitle(restaurantName ?? 'Кафе Цезарь');
        if (mainFilter) {
          dispatch(MenuFeature.actions.changeFilter(mainFilter));
        }
      }
    }, [route.params, dispatch])
  );

  const handleBackPress = useCallback(() => {
    Keyboard.dismiss();
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate(SCREEN_NAMES.TABS, { screen: TAB_NAMES.HOME });
    }
  }, [navigation]);

  const handleDishPress = useCallback(
    (id: number) => {
      dispatch(DishModalFeature.actions.openDishModal(id));
    },
    [dispatch]
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: MenuSection }) => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionWeekday}>{section.day}</Text>
      </View>
    ),
    []
  );

  const renderItem = useCallback(
    ({ item: pair }: { item: Dish[] }) => (
      <View style={styles.row}>
        {pair.map((dish) => (
          <View key={dish.id} style={styles.cardWrapper}>
            <DishCard item={dish} onPress={() => handleDishPress(dish.id)} />
          </View>
        ))}
        {pair.length === 1 && <View style={styles.cardWrapper} />}
      </View>
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
        <SafeAreaView edges={['top']} style={styles.searchContainer}>
          <View style={styles.searchWrapper}>
            <View style={styles.topBar}>
              <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                <Text style={styles.backButtonText}>‹</Text>
              </TouchableOpacity>
              <View style={styles.searchWrapperInner}>
                <SearchInput
                  onPress={() => navigation.navigate(SCREEN_NAMES.SEARCH, {})}
                  placeholder="Поиск"
                />
              </View>
              <TouchableOpacity
                style={styles.accountButton}
                onPress={() =>
                  navigation.navigate(SCREEN_NAMES.TABS, { screen: TAB_NAMES.ACCOUNT })
                }
              >
                <AccountIcon width={36} height={36} />
              </TouchableOpacity>
            </View>
            <Text style={styles.cafeTitle} numberOfLines={2}>
              {restaurantTitle}
            </Text>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.menuTitle}>Меню</Text>

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
          <SectionList
            sections={sections}
            keyExtractor={(pair, index) => pair.map((d) => String(d.id)).join('-') + index}
            renderSectionHeader={renderSectionHeader}
            renderItem={renderItem}
            contentContainerStyle={[
              styles.dishesGrid,
              { paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_CIRCLE_OVERFLOW + insets.bottom },
            ]}
            ListEmptyComponent={<Text style={styles.emptyText}>Нет блюд в этой категории</Text>}
            stickySectionHeadersEnabled={false}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={Platform.OS === 'android'}
          />
        )}
      </View>
    </View>
  );
};
