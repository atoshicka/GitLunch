import { Dish } from '../../entities/api/types/menu-types';

export interface DishModalState {
  isOpen: boolean;
  dishId: number | null;
  dish: Dish | null;
  isLoading: boolean;
  error: string | null;
}
