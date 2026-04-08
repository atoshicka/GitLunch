import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, CartState } from './types';

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  initialized: false,
};

export const { name, actions, reducer } = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    fetchCart: () => {},

    setCartFromBackend(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
      state.initialized = true;
    },

    setCartInitialized(state) {
      state.initialized = true;
    },

    setCartLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setCartError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },

    addToCart(state, action: PayloadAction<Omit<CartItem, 'quantity'>>) {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
        if (action.payload.cartItemId && !existing.cartItemId) {
          existing.cartItemId = action.payload.cartItemId;
        }
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },

    decreaseQuantity(state, action: PayloadAction<{ id: string; cartItemId?: number }>) {
      const idx = state.items.findIndex((i) => i.id === action.payload.id);
      if (idx === -1) return;
      if (state.items[idx].quantity <= 1) {
        state.items.splice(idx, 1);
      } else {
        state.items[idx].quantity -= 1;
      }
    },

    removeFromCart(state, action: PayloadAction<{ id: string; cartItemId?: number }>) {
      state.items = state.items.filter((i) => i.id !== action.payload.id);
    },

    setCartItemBackendId(state, action: PayloadAction<{ menuItemId: string; cartItemId: number }>) {
      const item = state.items.find((i) => i.id === action.payload.menuItemId);
      if (item) {
        item.cartItemId = action.payload.cartItemId;
      }
    },

    clearCart(state) {
      state.items = [];
    },
  },
});
