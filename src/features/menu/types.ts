import { Category, Dish, Weekday } from '../../entities/api/types/menu-types';

export interface WeekdayGroup {
  weekday: Weekday;
  date: string;
  dishes: Dish[];
}

export interface MenuState {
  dishes: Dish[];
  filteredDishes: Dish[];
  weekdayGroups: WeekdayGroup[];
  categories: Category[];
  selectedFilter: string;
  isLoading: boolean;
  error: string | null;
}
