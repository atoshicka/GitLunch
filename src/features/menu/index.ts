import * as sagas from './menu-saga';
import * as selectors from './menu-selectors';
import menuReducer, { fetchDishesStart } from './menu-slice';

export const MenuFeature = {
  reducer: { menu: menuReducer },
  sagas,
  selectors,
  actions: { fetchDishes: fetchDishesStart },
};
