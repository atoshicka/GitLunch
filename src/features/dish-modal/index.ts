import { watchDishModal } from './saga';
import { selectors } from './selectors';
import { actions, name, reducer } from './slice';

export const DishModalFeature = {
  actions,
  sagas: {
    watchDishModal,
  },
  reducer: {
    [name]: reducer,
  },
  sliceName: name,
  selectors,
  actionTypes: {
    [actions.openDishModal.type]: actions.openDishModal,
    [actions.closeDishModal.type]: actions.closeDishModal,
  },
};
