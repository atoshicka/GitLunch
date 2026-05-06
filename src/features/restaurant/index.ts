import { watchRestaurant } from './saga';
import { selectors } from './selectors';
import { actions, name, reducer } from './slice';

export const RestaurantFeature = {
  actions,
  sagas: {
    watchRestaurant,
  },
  reducer: {
    [name]: reducer,
  },
  selectors,
};
