import { FC } from 'react';
import { SvgProps } from 'react-native-svg';

export interface CartItem {
  id: string;
  cartItemId?: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  imageSvg?: FC<SvgProps>;
}

export interface CartDayGroup {
  date: string;
  dayName: string;
  items: CartItem[];
  total: number;
  selected: boolean;
}

export interface CartState {
  dayGroups: CartDayGroup[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
}
