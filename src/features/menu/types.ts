import { Category, Dish } from '../../entities/api/types/menu-types';

export interface MenuState {
  dishes: Dish[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}
