import { useEffect, useRef, useState } from 'react';
import { createApiService } from '../../../entities/api/api-interface';
import { api } from '../../../entities/api/axios-config';
import { Dish } from '../../../entities/api/types/menu-types';

const DEBOUNCE_MS = 400;

const apiService = createApiService(api);

export const useSearch = (localItems: Dish[]) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Dish[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const results = await apiService.searchDishes(trimmed);
        setSearchResults(results);
      } catch {
        const lower = trimmed.toLowerCase();
        const fallback = localItems.filter((item) => {
          const name = item.name?.toLowerCase() ?? '';
          const description = item.description?.toLowerCase() ?? '';
          const ingredients = item.ingredients?.toLowerCase() ?? '';
          return name.includes(lower) || description.includes(lower) || ingredients.includes(lower);
        });
        setSearchResults(fallback);
      } finally {
        setIsSearching(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, localItems]);

  return {
    query,
    setQuery,
    searchResults,
    isSearching,
  };
};
