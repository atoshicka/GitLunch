export interface BackendCartItemDetail {
  id: number;
  menu_item_id: number;
  name: string;
  price: string;
  quantity: number;
  total: string;
  image_url?: string;
}

export interface BackendCartDayGroup {
  date: string;
  day_name: string;
  items: BackendCartItemDetail[];
  total: string;
}

export interface BackendCart {
  id: number;
  items_by_day: BackendCartDayGroup[];
  total_items: number;
  total_price: string;
}

export interface BackendCartResponse {
  id: number;
  items_by_day: BackendCartDayGroup[];
  total_items: number;
  total_price: string;
}

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
}

export interface AddCartItemPayload {
  menu_item_id: number;
  quantity: number;
  delivery_date?: string;
}

export interface UpdateCartItemPayload {
  quantity: number;
}
