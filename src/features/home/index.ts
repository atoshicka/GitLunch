import { HomeScreen } from '../../screens/home-screen/home-screen';
import { watchHome } from './home-saga';
import {
  selectCurrentRestaurant,
  selectCurrentRestaurantIndex,
  selectError,
  selectIsLoading,
  selectPromoDishes,
  selectRestaurants,
} from './home-selectors';
import homeReducer, {
  fetchPromoDishesSuccess,
  fetchRestaurantsFailure,
  fetchRestaurantsStart,
  fetchRestaurantsSuccess,
  HOME_SLICE_NAME,
  setCurrentRestaurant,
} from './home-slice';

export { watchHome } from './home-saga';
export {
  selectCurrentRestaurant,
  selectCurrentRestaurantIndex,
  selectError,
  selectIsLoading,
  selectPromoDishes,
  selectRestaurants,
} from './home-selectors';
export { HOME_SLICE_NAME } from './home-slice';

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
