import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { createApiService } from '../entities/api/api-interface';
import { api } from '../entities/api/axios-config';
import {
  CartFeature,
  HomeFeature,
  LoginFeature,
  MenuFeature,
  OrdersFeature,
  SearchFeature,
} from '../features';
import { rootSaga } from './saga';

const apiService = createApiService(api);

const sagaMiddleware = createSagaMiddleware({
  context: { apiService },
});

export const store = configureStore({
  reducer: {
    [LoginFeature.sliceName]: LoginFeature.reducer,
    [CartFeature.sliceName]: CartFeature.reducer,
    [HomeFeature.sliceName]: HomeFeature.reducer,
    [MenuFeature.sliceName]: MenuFeature.reducer,
    [OrdersFeature.sliceName]: OrdersFeature.reducer,
    [SearchFeature.sliceName]: SearchFeature.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
