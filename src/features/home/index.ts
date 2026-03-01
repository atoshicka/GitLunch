import homeReducer from './home-slice';

export const HOME_SLICE_NAME = 'home';

export const HomeFeature = {
  reducer: {
    [HOME_SLICE_NAME]: homeReducer,
  },
};

export { watchHome } from './home-saga';
export * from './home-selectors';
export * from './home-slice';
export { homeReducer };
