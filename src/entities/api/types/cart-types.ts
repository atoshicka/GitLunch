import { Weekday } from './menu-types';

export interface BackendCartItem {
  id: number;
  cart_id?: number;
  menu_item_id: number;
  quantity: number;
  name?: string;
  price?: string | number;
  image_url?: string;
  total?: string;
  created_at?: string;
  updated_at?: string;
  weekday?: Weekday;
}

export interface BackendCart {
  id: number;
  items: BackendCartItem[];
  total_items?: number;
  total_price?: string;
}

export interface BackendCartResponse {
  id: number;
  items: BackendCartItem[];
  total_items: number;
  total_price: string;
}

export interface AddCartItemPayload {
  menu_item_id: number;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}
