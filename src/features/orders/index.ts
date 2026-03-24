import { selectors } from './selectors';
import { actions, name, reducer } from './slice';

export const ORDERS_SLICE_NAME = name;

export const OrdersFeature = {
  actions,
  reducer: {
    [name]: reducer,
  },
  selectors,
};
