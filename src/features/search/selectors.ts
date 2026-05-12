import { createSelector } from '@reduxjs/toolkit';
import { name } from './slice';
import { SearchState } from './types';

interface State {
  [name]: SearchState;
}

const root = (state: State) => state[name];

const selectQuery = createSelector(root, (search) => search.query);
const selectResults = createSelector(root, (search) => search.results);
const selectIsSearching = createSelector(root, (search) => search.isSearching);
const selectRecentSearches = createSelector(root, (search) => search.recentSearches);

export const selectors = {
  selectQuery,
  selectResults,
  selectIsSearching,
  selectRecentSearches,
};
