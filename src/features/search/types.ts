import { Dish } from '../../entities/api/types/menu-types';

export interface SearchState {
  query: string;
  results: Dish[];
  isSearching: boolean;
  recentSearches: string[];
}
