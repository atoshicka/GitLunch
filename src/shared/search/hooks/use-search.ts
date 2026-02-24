import { useMemo, useState } from 'react';
import { Dish } from '../../../entities/api/types/menu-types';

export const useSearch = (items: Dish[]) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(lowerQuery));
  }, [query, items]);

  return {
    query,
    setQuery,
    searchResults,
  };
};
