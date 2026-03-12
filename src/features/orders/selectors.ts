import { RootState } from '../../app/store';

export const selectOrders = (state: RootState) => state.orders.orders;
