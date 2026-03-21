import {
  selectCartError,
  selectCartItemById,
  selectCartItems,
  selectCartLoading,
  selectCartTotalItems,
  selectCartTotalPrice,
} from './cart-selectors';
import cartReducer, {
  addToCart,
  clearCart,
  decreaseQuantity,
  removeFromCart,
  setCartError,
  setCartFromBackend,
  setCartItemBackendId,
  setCartLoading,
} from './cart-slice';

export const CART_SLICE_NAME = 'cart';

export const CartFeature = {
  actions: {
    addToCart,
    clearCart,
    decreaseQuantity,
    removeFromCart,
    setCartError,
    setCartFromBackend,
    setCartItemBackendId,
    setCartLoading,
  },
  reducer: {
    [CART_SLICE_NAME]: cartReducer,
  },
  selectors: {
    selectCartError,
    selectCartItemById,
    selectCartItems,
    selectCartLoading,
    selectCartTotalItems,
    selectCartTotalPrice,
  },
};

export {
  addToCart,
  cartReducer,
  clearCart,
  decreaseQuantity,
  removeFromCart,
  selectCartError,
  selectCartItemById,
  selectCartItems,
  selectCartLoading,
  selectCartTotalItems,
  selectCartTotalPrice,
  setCartError,
  setCartFromBackend,
  setCartItemBackendId,
  setCartLoading,
};

export * from './types';
