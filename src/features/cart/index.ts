import * as cartSelectors from './store/cart-selectors';
import cartReducer, * as cartActions from './store/cart-slice';

export const CART_SLICE_NAME = 'cart';

export const CartFeature = {
  actions: cartActions,
  reducer: {
    [CART_SLICE_NAME]: cartReducer,
  },
  selectors: cartSelectors,
};

export * from './store/cart-selectors';
export * from './store/cart-slice';
export { cartReducer };
