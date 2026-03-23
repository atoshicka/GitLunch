import { HomeScreen } from '../../screens/home-screen/home-screen';
import { watchHome } from './saga';
import {
  selectCurrentRestaurant,
  selectCurrentRestaurantIndex,
  selectError,
  selectIsLoading,
  selectPromoDishes,
  selectRestaurants,
} from './selectors';
import homeReducer, {
  fetchPromoDishesSuccess,
  fetchRestaurantsFailure,
  fetchRestaurantsStart,
  fetchRestaurantsSuccess,
  HOME_SLICE_NAME,
  setCurrentRestaurant,
} from './slice';

export { watchHome } from './saga';
export {
  selectCurrentRestaurant,
  selectCurrentRestaurantIndex,
  selectError,
  selectIsLoading,
  selectPromoDishes,
  selectRestaurants,
} from './selectors';
export { HOME_SLICE_NAME } from './slice';

export const HomeFeature = {
  actions: {
    setCurrentRestaurant,
    fetchRestaurantsStart,
    fetchRestaurantsSuccess,
    fetchRestaurantsFailure,
    fetchPromoDishesSuccess,
  },
  sagas: {
    watchHome,
  },
  reducer: {
    [HOME_SLICE_NAME]: homeReducer,
  },
  selectors: {
    selectRestaurants,
    selectPromoDishes,
    selectCurrentRestaurantIndex,
    selectIsLoading,
    selectError,
    selectCurrentRestaurant,
  },
  ui: {
    HomeScreen,
  },
};
