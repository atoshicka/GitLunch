export type OrderStatus = 'pending' | 'ready' | 'delivered';

export interface BackendOrderItem {
  id: number;
  menu_item_id: number;
  name: string;
  quantity: number;
  price: string | number;
  total: string | number;
  image_url?: string;
}

export interface BackendOrder {
  id: number;
  order_number: string;
  status: number | string;
  status_label: string;
  total_amount: string | number;
  delivery_info?: string;
  delivery_address?: string;
  items_count: number;
  created_at: string;
  updated_at: string;
  cancelled_at?: string;
  items?: BackendOrderItem[];
  pickup_code?: string;
  qr_code?: string;
}

export interface BackendOrderStatus {
  id: number;
  order_number: string;
  status: number | string;
  status_label: string;
  updated_at: string;
  estimated_time?: string;
}

export interface CreateOrderPayload {
  delivery_date?: string;
  delivery_address?: string;
  selected_dates?: string[];
}

export interface CreateOrderResponse {
  message: string;
  orders: BackendOrder[];
}

export interface CancelOrderResponse {
  message: string;
  order: BackendOrder;
}

export interface ConfirmPickupResponse {
  message: string;
}
