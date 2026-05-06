import { Dish } from '../../entities/api/types/menu-types';
import { BASE_URL } from '../constants/api/api';

const resolveImageUrl = (rawImage: string | undefined): string | undefined => {
  if (!rawImage) return undefined;
  return rawImage.startsWith('http') ? rawImage : `${BASE_URL}${rawImage}`;
};

const resolvePrimaryCategory = (dish: Dish): Dish['category'] => {
  if (dish.category) return dish.category;

  const categories = dish.categories ?? [];
  const primary = categories.find((c) => c.name.toLowerCase() !== 'акции') ?? categories[0];
  return primary ?? { id: 0, name: '' };
};

export const normalizeDish = (dish: Dish): Dish => ({
  ...dish,
  imageUrl: resolveImageUrl(dish.image_url),
  category: resolvePrimaryCategory(dish),
});
