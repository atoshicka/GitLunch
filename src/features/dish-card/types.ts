import { FC } from 'react';
import { SvgProps } from 'react-native-svg';

export interface DishCardItem {
  id: string | number;
  name: string;
  price: number | string;
  imageUrl?: string;
  imageSvg?: FC<SvgProps>;
}

export interface DishCardProps {
  item: DishCardItem;
  onPress?: () => void;
}
