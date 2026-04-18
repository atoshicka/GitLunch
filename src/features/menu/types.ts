import { Category, Dish } from '../../entities/api/types/menu-types';

export interface MenuDaySection {
  day: string;
  wday: number;
  dishes: Dish[];
}

export interface MenuState {
  dishes: Dish[];
  filteredDishes: Dish[];
  menuByDays: MenuDaySection[];
  categories: Category[];
  selectedFilter: string;
  isLoading: boolean;
  error: string | null;
}
