import { watchCart } from './saga';
import { selectors } from './selectors';
import { actions, name, reducer } from './slice';

export const CART_SLICE_NAME = name;

export const CartFeature = {
  actions,
  sagas: {
    watchCart,
  },
  reducer: {
    [name]: reducer,
  },
  selectors,
};
