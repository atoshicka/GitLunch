import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { createApiService } from '../entities/api/api-interface';
import { api } from '../entities/api/axios-config';
import { HomeFeature, LoginFeature } from '../features';
import cartReducer from '../features/cart/slice';
import { MenuFeature } from '../features/menu';
import ordersReducer from '../features/orders/slice';
import { rootSaga } from './saga';

const apiService = createApiService(api);

const sagaMiddleware = createSagaMiddleware({
  context: { apiService },
});

export const store = configureStore({
  reducer: {
    ...LoginFeature.reducer,
    cart: cartReducer,
    ...HomeFeature.reducer,
    ...MenuFeature.reducer,
    orders: ordersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
