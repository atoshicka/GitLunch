import { FC } from 'react';
import { SvgProps } from 'react-native-svg';

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
}

export interface HomeApiResponse {
  restaurants: Restaurant[];
  promoDishes: PromoDish[];
}
