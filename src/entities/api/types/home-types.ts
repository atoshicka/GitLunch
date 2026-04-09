import { FC } from 'react';
import { SvgProps } from 'react-native-svg';
import { Weekday } from './menu-types';

// Типы для API запросов
export interface Restaurant {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface PromoDish {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  isPromo: boolean;
  imageSvg?: FC<SvgProps>;
  weekday: Weekday;
}

export interface HomeApiResponse {
  restaurants: Restaurant[];
  promoDishes: PromoDish[];
}
