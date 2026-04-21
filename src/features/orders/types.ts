import { OrderStatus } from '../../entities/api/types/order-types';

export type { OrderStatus };

export interface OrderItem {
  id: string;
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
  imageUrl?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  pickupCode?: string;
  status: OrderStatus;
  statusLabel: string;
  totalAmount: number;
  deliveryInfo?: string;
  deliveryAddress?: string;
  itemsCount: number;
  createdAt: string;
  cancelledAt?: string;
  items: OrderItem[];
  localStartedAt?: number;
}

export interface OrdersState {
  orders: Order[];
  removedOrderIds: number[];
  localStatuses: Record<number, { status: OrderStatus; statusLabel: string }>;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
}

export interface CreateOrderPayload {
  selected_dates?: string[];
}
