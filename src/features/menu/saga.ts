import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { ApiService } from '../../entities/api/api-interface';
import { Category, Dish, Weekday } from '../../entities/api/types/menu-types';
import { selectors } from './selectors';
import { actions } from './slice';
import { WeekdayGroup } from './types';
import { formatWeekdayDate, WEEKDAYS } from './weekday-utils';

const dishMatchesCategory = (dish: Dish, categoryName: string): boolean => {
  if (dish.categories && dish.categories.length > 0) {
    return dish.categories.some((cat) => cat.name.toLowerCase() === categoryName.toLowerCase());
  }
  return dish.category?.name?.toLowerCase() === categoryName.toLowerCase();
};

const normalizeDishes = (dishes: Dish[]): Dish[] =>
  dishes.map((d) => ({ ...d, weekday: d.weekday ?? ('Понедельник' as Weekday) }));

const buildWeekdayGroups = (dishes: Dish[]): WeekdayGroup[] =>
  WEEKDAYS.reduce<WeekdayGroup[]>((acc, weekday) => {
    const dayDishes = dishes.filter((d) => d.weekday === weekday);
    if (dayDishes.length > 0) {
      acc.push({ weekday, date: formatWeekdayDate(weekday), dishes: dayDishes });
    }
    return acc;
  }, []);

function* filterDishesSaga() {
  const dishes: Dish[] = yield select(selectors.selectDishes);
  const selectedFilter: string = yield select(selectors.selectSelectedFilter);

  const filtered =
    !selectedFilter || selectedFilter === 'Все'
      ? dishes
      : dishes.filter((d) => dishMatchesCategory(d, selectedFilter));

  yield put(actions.setFilteredDishes(filtered));
  yield put(actions.setWeekdayGroups(buildWeekdayGroups(filtered)));
}

function* fetchDishesSaga(apiService: ApiService) {
  try {
    yield put(actions.fetchDishesStart());

    const raw: Dish[] = yield call([apiService, apiService.getDishes]);
    const dishes = normalizeDishes(raw);
    yield put(actions.fetchDishesSuccess(dishes));

    const categories: Category[] = yield call([apiService, apiService.getCategories]);
    yield put(actions.fetchCategoriesSuccess(categories));

    yield put(actions.setWeekdayGroups(buildWeekdayGroups(dishes)));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка загрузки меню';
    yield put(actions.fetchDishesFailure(message));
  }
}

function* handleFilterChangeSaga(action: PayloadAction<string>) {
  yield put(actions.setSelectedFilter(action.payload));
  yield call(filterDishesSaga);
}

export function* watchMenu(apiService: ApiService) {
  yield takeLatest(actions.fetchDishes.type, fetchDishesSaga, apiService);
  yield takeLatest(actions.changeFilter.type, handleFilterChangeSaga);
}
