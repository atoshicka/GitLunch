export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  dayOfWeek: string;
  items: OrderItem[];
  totalPrice: number;
  totalItems: number;
  code: string;
}

export interface OrdersState {
  orders: Order[];
}
