import { useMemo, useState } from 'react';
import { Dish } from '../../../entities/api/types/menu-types';

const FILTER_MAPPING: Record<string, string> = {
  горячее: 'Горячее',
  салаты: 'Салаты',
  десерты: 'Десерты',
  закуски: 'Бизнес-ланч',
  новинки: 'Новинки',
  акции: 'Акции',
};

export const useSearch = (items: Dish[]) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) return [];

    const matchedFilterKey = Object.keys(FILTER_MAPPING).find(
      (filter) => filter.startsWith(trimmedQuery) || filter.includes(trimmedQuery)
    );

    if (matchedFilterKey) {
      const categoryName = FILTER_MAPPING[matchedFilterKey];
      return items.filter(
        (item) => item.category?.name?.toLowerCase() === categoryName.toLowerCase()
      );
    }

    return items.filter((item) => {
      const name = item.name?.toLowerCase() ?? '';
      const description = item.description?.toLowerCase() ?? '';
      const ingredients = item.ingredients?.toLowerCase() ?? '';
      return (
        name.includes(trimmedQuery) ||
        description.includes(trimmedQuery) ||
        ingredients.includes(trimmedQuery)
      );
    });
  }, [query, items]);

  return {
    query,
    setQuery,
    searchResults,
  };
};
