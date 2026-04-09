import { FC } from 'react';
import { SvgProps } from 'react-native-svg';
import { Weekday } from '../../entities/api/types/menu-types';

export interface CartItem {
  id: string;
  cartItemId?: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  imageSvg?: FC<SvgProps>;
  weekday?: Weekday;
}

export interface CartItemGroup {
  weekday: Weekday;
  date: string;
  items: CartItem[];
  selected: boolean;
}

export interface CartState {
  items: CartItem[];
  weekdayGroups: CartItemGroup[];
  selectedWeekdays: Weekday[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
}
