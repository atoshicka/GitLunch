import { ViewStyle } from 'react-native';

export type MainFilterType = string;
export type SubFilterType = string;

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
  mainFilter?: string;
  subFilters?: string[];
  restaurantId?: string;
  restaurantName?: string;
  dishId?: string;
  filterTimestamp?: number;
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
  Orders: undefined;
};
