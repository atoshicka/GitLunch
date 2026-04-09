import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Weekday } from '../../entities/api/types/menu-types';
import { formatWeekdayDate, getNearestWeekday, WEEKDAYS } from '../menu/weekday-utils';
import { CartItem, CartItemGroup, CartState } from './types';

// Вспомогательная функция для сборки групп
const buildCartGroups = (items: CartItem[], selectedWeekdays: Weekday[]): CartItemGroup[] =>
  WEEKDAYS.reduce<CartItemGroup[]>((acc, weekday) => {
    const dayItems = items.filter((i) => i.weekday === weekday);
    if (dayItems.length > 0) {
      acc.push({
        weekday,
        date: formatWeekdayDate(weekday),
        items: dayItems,
        selected: selectedWeekdays.includes(weekday),
      });
    }
    return acc;
  }, []);

const initialState: CartState = {
  items: [],
  weekdayGroups: [],
  selectedWeekdays: [getNearestWeekday()],
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
      state.weekdayGroups = buildCartGroups(state.items, state.selectedWeekdays);
    },

    addToCart(state, action: PayloadAction<Omit<CartItem, 'quantity'>>) {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
        // Если прилетел cartItemId (например из саги), обновляем
        if (action.payload.cartItemId) {
          existing.cartItemId = action.payload.cartItemId;
        }
      } else {
        // Добавляем новое блюдо (акции прилетят сюда)
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.weekdayGroups = buildCartGroups(state.items, state.selectedWeekdays);
    },

    decreaseQuantity(state, action: PayloadAction<{ id: string; cartItemId?: number }>) {
      const idx = state.items.findIndex((i) => i.id === action.payload.id);
      if (idx !== -1) {
        if (state.items[idx].quantity <= 1) {
          state.items.splice(idx, 1);
        } else {
          state.items[idx].quantity -= 1;
        }
      }
      state.weekdayGroups = buildCartGroups(state.items, state.selectedWeekdays);
    },

    removeFromCart(state, action: PayloadAction<{ id: string; cartItemId?: number }>) {
      state.items = state.items.filter((i) => i.id !== action.payload.id);
      state.weekdayGroups = buildCartGroups(state.items, state.selectedWeekdays);
    },

    setCartItemBackendId(state, action: PayloadAction<{ menuItemId: string; cartItemId: number }>) {
      const item = state.items.find((i) => i.id === action.payload.menuItemId);
      if (item) item.cartItemId = action.payload.cartItemId;
    },

    toggleWeekday(state, action: PayloadAction<Weekday>) {
      const weekday = action.payload;
      if (state.selectedWeekdays.includes(weekday)) {
        if (state.selectedWeekdays.length > 1) {
          state.selectedWeekdays = state.selectedWeekdays.filter((w) => w !== weekday);
        }
      } else {
        state.selectedWeekdays.push(weekday);
      }
      state.weekdayGroups = buildCartGroups(state.items, state.selectedWeekdays);
    },

    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCartError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setCartInitialized: (state) => {
      state.initialized = true;
    },
    clearCart: (state) => {
      state.items = [];
      state.weekdayGroups = [];
    },
  },
});
