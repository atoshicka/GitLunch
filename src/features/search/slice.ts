import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dish } from '../../entities/api/types/menu-types';
import { SearchState } from './types';

const initialState: SearchState = {
  query: '',
  results: [],
  isSearching: false,
  recentSearches: [],
};

export const { name, actions, reducer } = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    searchRequest: (_state, _action: PayloadAction<string>) => {},
    searchStart: (state) => {
      state.isSearching = true;
    },
    searchSuccess: (state, action: PayloadAction<Dish[]>) => {
      state.isSearching = false;
      state.results = action.payload;
    },
    searchFailure: (state) => {
      state.isSearching = false;
      state.results = [];
    },
    clearResults: (state) => {
      state.results = [];
      state.isSearching = false;
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      state.recentSearches = [
        action.payload,
        ...state.recentSearches.filter((s) => s !== action.payload),
      ].slice(0, 5);
    },
  },
});
