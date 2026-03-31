import { watchSearch } from './saga';
import { selectors } from './selectors';
import { actions, name, reducer } from './slice';

export const SEARCH_SLICE_NAME = name;

export const SearchFeature = {
  actions,
  sagas: {
    watchSearch,
  },
  reducer: {
    [name]: reducer,
  },
  selectors,
};
