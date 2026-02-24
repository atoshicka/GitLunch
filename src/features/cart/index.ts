import cartReducer from './store/cart-slice';

export const CART_SLICE_NAME = 'cart';

export const CartFeature = {
  reducer: {
    [CART_SLICE_NAME]: cartReducer,
  },
};

export { cartReducer };
