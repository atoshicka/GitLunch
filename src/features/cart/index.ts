import { watchCart } from './saga';
import { selectors } from './selectors';
import { actions, name, reducer } from './slice';

export const CartFeature = {
  actions,
  sagas: {
    watchCart,
  },
  reducer,
  sliceName: name,
  selectors,
};
