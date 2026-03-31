import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchFeature } from '../../../features/search';

export const useSearch = () => {
  const dispatch = useDispatch();

  const query = useSelector(SearchFeature.selectors.selectQuery);
  const searchResults = useSelector(SearchFeature.selectors.selectResults);
  const isSearching = useSelector(SearchFeature.selectors.selectIsSearching);
  const recentSearches = useSelector(SearchFeature.selectors.selectRecentSearches);

  const setQuery = useCallback(
    (text: string) => {
      dispatch(SearchFeature.actions.setQuery(text));
      dispatch(SearchFeature.actions.searchRequest(text));
    },
    [dispatch]
  );

  const addRecentSearch = useCallback(
    (text: string) => {
      dispatch(SearchFeature.actions.addRecentSearch(text));
    },
    [dispatch]
  );

  return {
    query,
    setQuery,
    searchResults,
    isSearching,
    recentSearches,
    addRecentSearch,
  };
};
