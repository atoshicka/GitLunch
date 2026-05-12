import { PayloadAction } from '@reduxjs/toolkit';
import { call, debounce, put, select } from 'redux-saga/effects';
import { ApiService } from '../../entities/api/api-interface';
import { Dish } from '../../entities/api/types/menu-types';
import { selectors as menuSelectors } from '../menu/selectors';
import { actions } from './slice';

const filterDishesLocally = (dishes: Dish[], query: string): Dish[] => {
  const lower = query.toLowerCase();
  return dishes.filter((item) => {
    const name = item.name?.toLowerCase() ?? '';
    const description = item.description?.toLowerCase() ?? '';
    const ingredients = item.ingredients?.toLowerCase() ?? '';
    const categoryName = item.category?.name?.toLowerCase() ?? '';
    const categories = item.categories?.map((c) => c.name.toLowerCase()) ?? [];
    return (
      name.includes(lower) ||
      description.includes(lower) ||
      ingredients.includes(lower) ||
      categoryName.includes(lower) ||
      categories.some((c) => c.includes(lower))
    );
  });
};

function* handleSearchRequest(apiService: ApiService, action: PayloadAction<string>) {
  const trimmed = action.payload.trim();

  if (!trimmed) {
    yield put(actions.clearResults());
    return;
  }

  try {
    yield put(actions.searchStart());
    const results: Dish[] = yield call([apiService, apiService.searchDishes], trimmed);

    if (results.length > 0) {
      yield put(actions.searchSuccess(results));
    } else {
      const localDishes: Dish[] = yield select(menuSelectors.selectDishes);
      const fallback = filterDishesLocally(localDishes, trimmed);
      yield put(actions.searchSuccess(fallback));
    }
  } catch {
    const localDishes: Dish[] = yield select(menuSelectors.selectDishes);
    const fallback = filterDishesLocally(localDishes, trimmed);
    yield put(actions.searchSuccess(fallback));
  }
}

export function* watchSearch(apiService: ApiService) {
  yield debounce(400, actions.searchRequest.type, handleSearchRequest.bind(null, apiService));
}
