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

// Проверяет входит ли блюдо в категорию — поддерживает массив categories и одиночное category
const dishMatchesCategory = (dish: Dish, categoryName: string): boolean => {
  if (dish.categories && dish.categories.length > 0) {
    return dish.categories.some((cat) => cat.name.toLowerCase() === categoryName.toLowerCase());
  }
  return dish.category?.name?.toLowerCase() === categoryName.toLowerCase();
};

export const useSearch = (items: Dish[]) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) return [];

    // Проверяем совпадение с фильтром-категорией
    const matchedFilterKey = Object.keys(FILTER_MAPPING).find(
      (filter) => filter.startsWith(trimmedQuery) || filter.includes(trimmedQuery)
    );

    if (matchedFilterKey) {
      const categoryName = FILTER_MAPPING[matchedFilterKey];
      return items.filter((item) => dishMatchesCategory(item, categoryName));
    }

    // Поиск по названию, описанию и составу
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
