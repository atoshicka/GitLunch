import { useMemo, useState } from 'react';
import { Dish } from '../../../entities/api/types/menu-types';

const AVAILABLE_FILTERS = ['горячее', 'салаты', 'десерты', 'закуски', 'новинки', 'акции'];

export const useSearch = (items: Dish[]) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) return [];

    const matchedFilter = AVAILABLE_FILTERS.find(
      (filter) => filter.includes(trimmedQuery) || filter.startsWith(trimmedQuery)
    );

    if (matchedFilter) {
      if (matchedFilter === 'акции') {
        return items.filter((item) => item.isPromo === true);
      } else {
        return items.filter((item) => item.filterType === matchedFilter);
      }
    } else {
      return items.filter((item) => item.name.toLowerCase().includes(trimmedQuery));
    }
  }, [query, items]);

  return {
    query,
    setQuery,
    searchResults,
  };
};
