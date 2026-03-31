import { createSelector } from '@reduxjs/toolkit';
import { name } from './slice';
import { SearchState } from './types';

interface State {
  [name]: SearchState;
}

const root = (state: State) => state[name];

const selectQuery = createSelector(root, (s) => s.query);
const selectResults = createSelector(root, (s) => s.results);
const selectIsSearching = createSelector(root, (s) => s.isSearching);
const selectRecentSearches = createSelector(root, (s) => s.recentSearches);

export const selectors = {
  selectQuery,
  selectResults,
  selectIsSearching,
  selectRecentSearches,
};
