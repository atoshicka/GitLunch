import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartDayGroup, CartItem, CartState } from './types';

const initialState: CartState = {
  dayGroups: [],
  loading: false,
  error: null,
  initialized: false,
};

export const {
  name,
  actions: sliceActions,
  reducer,
} = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartFromBackend(state, action: PayloadAction<CartDayGroup[]>) {
      const selectedDates = new Set(state.dayGroups.filter((g) => g.selected).map((g) => g.date));
      state.dayGroups = action.payload.map((g) => ({
        ...g,
        selected: selectedDates.has(g.date),
      }));
      state.loading = false;
      state.error = null;
      state.initialized = true;
    },

    toggleDaySelected(state, action: PayloadAction<string>) {
      const group = state.dayGroups.find((g) => g.date === action.payload);
      if (group) group.selected = !group.selected;
    },

    clearSelectedDays(state, action: PayloadAction<string[]>) {
      state.dayGroups = state.dayGroups.filter((g) => !action.payload.includes(g.date));
    },

    setCartItemBackendId(
      state,
      action: PayloadAction<{ menuItemId: string; cartItemId: number; date: string }>
    ) {
      const group = state.dayGroups.find((g) => g.date === action.payload.date);
      if (group) {
        const item = group.items.find((i) => i.id === action.payload.menuItemId);
        if (item) item.cartItemId = action.payload.cartItemId;
      }
    },

    setCartLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setCartError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setCartInitialized(state) {
      state.initialized = true;
    },
    clearCart(state) {
      state.dayGroups = [];
    },
  },
});

export const fetchCart = createAction('cart/fetchCart');
export const fetchCartSilent = createAction('cart/fetchCartSilent');
export const addToCart = createAction<Omit<CartItem, 'quantity'>>('cart/addToCart');
export const decreaseQuantity = createAction<{ id: string; cartItemId?: number }>(
  'cart/decreaseQuantity'
);
export const removeFromCart = createAction<{ id: string; cartItemId?: number }>(
  'cart/removeFromCart'
);

export const actions = {
  ...sliceActions,
  fetchCart,
  fetchCartSilent,
  addToCart,
  decreaseQuantity,
  removeFromCart,
};
