import { FC } from 'react';
import { SvgProps } from 'react-native-svg';

export interface CartItem {
  id: string;
  cartItemId?: number;
  name: string;
  price: number;
  quantity: number;
  imageSvg?: FC<SvgProps>;
  imageUrl?: string;
}

export interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}
