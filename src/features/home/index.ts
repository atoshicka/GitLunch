import { watchHome } from './saga';
import { selectors } from './selectors';
import { actions, name, reducer } from './slice';

export const HOME_SLICE_NAME = name;

export const HomeFeature = {
  actions,
  sagas: {
    watchHome,
  },
  reducer: {
    [name]: reducer,
  },
  selectors,
};
