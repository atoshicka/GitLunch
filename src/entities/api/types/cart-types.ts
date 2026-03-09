import { FC } from 'react';
import { SvgProps } from 'react-native-svg';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageSvg?: FC<SvgProps>;
  imageUrl?: string;
}

export interface CartState {
  items: CartItem[];
}
