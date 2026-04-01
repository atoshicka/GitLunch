import { watchMenu } from './saga';
import { selectors } from './selectors';
import { actions, name, reducer } from './slice';

export const MenuFeature = {
  actions,
  sagas: {
    watchMenu,
  },
  reducer,
  sliceName: name,
  selectors,
};
