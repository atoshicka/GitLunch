import { PromoDish, Restaurant } from '../../entities/api/types/home-types';

export interface HomeState {
  restaurants: Restaurant[];
  promoDishes: PromoDish[];
  currentRestaurantIndex: number;
  isLoading: boolean;
  error: string | null;
}
