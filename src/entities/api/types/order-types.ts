export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Ожидает подтверждения',
  confirmed: 'Подтверждён',
  preparing: 'Готовится',
  ready: 'Готов к получению',
  delivered: 'Выдан',
  cancelled: 'Отменён',
};

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
  status: number;
  status_label: string;
  total_amount: string | number;
  delivery_date?: string;
  delivery_address?: string;
  items_count: number;
  created_at: string;
  cancelled_at?: string;
  items?: BackendOrderItem[];
}

export interface BackendOrderStatus {
  id: number;
  order_number: string;
  status: number;
  status_label: string;
  updated_at: string;
  estimated_time?: string;
}

export interface CreateOrderPayload {
  delivery_date?: string;
  delivery_address?: string;
}

export interface CancelOrderResponse {
  message: string;
  order: BackendOrder;
}

export interface ConfirmPickupResponse {
  message: string;
}
