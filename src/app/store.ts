import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import {
  CartFeature,
  DishModalFeature,
  HomeFeature,
  LoginFeature,
  MenuFeature,
  OrdersFeature,
  RestaurantFeature,
  SearchFeature,
} from '../features';
import { rootSaga } from './saga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    ...LoginFeature.reducer,
    ...CartFeature.reducer,
    ...HomeFeature.reducer,
    ...MenuFeature.reducer,
    ...OrdersFeature.reducer,
    ...SearchFeature.reducer,
    ...RestaurantFeature.reducer,
    ...DishModalFeature.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);
