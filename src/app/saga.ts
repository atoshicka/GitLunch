import { all, fork } from 'redux-saga/effects';
import { createApiService } from '../entities/api/api-interface';
import { api } from '../entities/api/axios-config';
import { RestaurantFeature } from '../features';
import { CartFeature } from '../features/cart';
import { DishModalFeature } from '../features/dish-modal';
import { HomeFeature } from '../features/home';
import { LoginFeature } from '../features/login';
import { MenuFeature } from '../features/menu';
import { OrdersFeature } from '../features/orders';
import { SearchFeature } from '../features/search';

export function* rootSaga() {
  const apiService = createApiService(api);
  yield all([
    fork(LoginFeature.sagas.watchLogin, apiService),
    fork(HomeFeature.sagas.watchHome, apiService),
    fork(MenuFeature.sagas.watchMenu, apiService),
    fork(CartFeature.sagas.watchCart, apiService),
    fork(SearchFeature.sagas.watchSearch, apiService),
    fork(DishModalFeature.sagas.watchDishModal, apiService),
    fork(OrdersFeature.sagas.watchOrders, apiService),
    fork(RestaurantFeature.sagas.watchRestaurant, apiService),
  ]);
}
