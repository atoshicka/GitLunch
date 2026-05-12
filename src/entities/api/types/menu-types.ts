import { FC } from 'react';
import { SvgProps } from 'react-native-svg';

export interface DishCategory {
  id: number;
  name: string;
}

export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  imageUrl?: string;
  categories?: DishCategory[];
  category: DishCategory;
  meal_category?: number;
  calories?: number;
  weight?: number;
  ingredients?: string;
  proteins?: number;
  fats?: number;
  carbs?: number;
  isPromo?: boolean;
  filterType?: string;
  imageSvg?: FC<SvgProps>;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  image_url?: string;
}

export interface MenuResponse {
  dishes: Dish[];
  categories: Category[];
  total: number;
}

export interface MenuByDayResponse {
  day: string;
  wday: number;
  items: Dish[];
}
