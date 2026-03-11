import { call, getContext, put, takeLatest } from 'redux-saga/effects';
import { ApiService } from '../../entities/api';
import { fetchDishesFailure, fetchDishesStart, fetchDishesSuccess } from './menu-slice';

function* fetchDishesSaga() {
  try {
    const apiService: ApiService = yield getContext('apiService');

    yield put(fetchDishesStart());

    const dishes: Awaited<ReturnType<ApiService['getDishes']>> = yield call([
      apiService,
      apiService.getDishes,
    ]);
    yield put(fetchDishesSuccess(dishes));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки меню';
    yield put(fetchDishesFailure(errorMessage));
  }
}

export function* watchMenu() {
  yield takeLatest('menu/fetchDishes', fetchDishesSaga);
}
