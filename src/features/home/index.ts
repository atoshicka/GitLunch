import { watchHome } from './home-saga';
import * as homeSelectors from './home-selectors';
import homeReducer, * as homeActions from './home-slice';
import { HomeScreen } from './ui/home-screen';

export { watchHome } from './home-saga';
export const HOME_SLICE_NAME = 'home';

export const HomeFeature = {
  actions: homeActions,
  sagas: {
    watchHome,
  },
  reducer: {
    [HOME_SLICE_NAME]: homeReducer,
  },
  selectors: homeSelectors,
  ui: {
    HomeScreen,
  },
};
