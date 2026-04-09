import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import { ApiService } from '../../entities/api/api-interface';
import { Dish } from '../../entities/api/types/menu-types';
import { actions } from './slice';

function* handleOpenDishModal(apiService: ApiService, action: PayloadAction<number>) {
  try {
    yield put(actions.setIsLoading());
    const dish: Dish = yield call([apiService, apiService.getDishById], String(action.payload));
    yield put(actions.setDish(dish));
  } catch {
    yield put(actions.fetchDishFailure());
  }
}

export function* watchDishModal(apiService: ApiService) {
  yield takeLatest(actions.openDishModal.type, handleOpenDishModal.bind(null, apiService));
}
