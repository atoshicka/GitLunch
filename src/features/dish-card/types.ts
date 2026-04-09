import { FC } from 'react';
import { SvgProps } from 'react-native-svg';
import { Weekday } from '../../entities/api/types/menu-types';

export interface DishCardItem {
  id: string | number;
  name: string;
  price: number | string;
  imageUrl?: string;
  imageSvg?: FC<SvgProps>;
  weekday: Weekday;
}

export interface DishCardProps {
  item: DishCardItem;
  onPress?: () => void;
}
