import { Category, Dish } from '../../entities/api/types/menu-types';

export interface MenuState {
  dishes: Dish[];
  filteredDishes: Dish[];
  categories: Category[];
  selectedFilter: string;
  isLoading: boolean;
  error: string | null;
}
