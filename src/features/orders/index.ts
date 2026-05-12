import { watchOrders } from './saga';
import { selectors } from './selectors';
import { actions, name, reducer } from './slice';

export const OrdersFeature = {
  actions,
  sagas: {
    watchOrders,
  },
  reducer: {
    [name]: reducer,
  },
  selectors,
};
