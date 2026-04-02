import { selectors } from './selectors';
import { actions, name, reducer } from './slice';

export const OrdersFeature = {
  actions,
  reducer: {
    [name]: reducer,
  },
  selectors,
};
