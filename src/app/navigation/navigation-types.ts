import { ViewStyle } from 'react-native';

export const FILTERS = {
  MAIN: {
    ALL: 'Все',
    PROMO: 'акции',
  },
  SUB: {
    HOT: 'горячее',
    SALADS: 'салаты',
    DESSERTS: 'десерты',
    SNACKS: 'закуски',
    NOVELTIES: 'новинки',
  },
} as const;

export type MainFilterType = typeof FILTERS.MAIN.ALL | typeof FILTERS.MAIN.PROMO;
export type SubFilterType =
  | typeof FILTERS.SUB.HOT
  | typeof FILTERS.SUB.SALADS
  | typeof FILTERS.SUB.DESSERTS
  | typeof FILTERS.SUB.SNACKS
  | typeof FILTERS.SUB.NOVELTIES;

export type TabScreen = 'Главная' | 'Меню' | 'Корзина' | 'Аккаунт';

export interface FilterChipsProps {
  filters: readonly string[];
  selectedFilters: string[];
  onSelectFilter: (filter: string) => void;
  style?: ViewStyle;
  disableSort?: boolean;
  showScrollToTop?: boolean;
}

export type MenuScreenParams = {
  mainFilter?: MainFilterType;
  subFilters?: SubFilterType[];
  restaurantId?: string;
  restaurantName?: string;
  dishId?: string;
};

export type RootStackParamList = {
  Tabs: {
    screen: TabScreen;
    params?: MenuScreenParams;
  };
  Search: {
    category?: string;
    onSearch?: (query: string) => void;
  };
  Menu: MenuScreenParams;
};
