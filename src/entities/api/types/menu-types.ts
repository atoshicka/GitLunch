import { FC } from 'react';
import { SvgProps } from 'react-native-svg';

export interface Dish {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url?: string;
  category: {
    id: number;
    name: string;
  };
  meal_category: string;
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
