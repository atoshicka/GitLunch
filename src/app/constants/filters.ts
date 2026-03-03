export const MAIN_FILTERS = ['Все', 'акции'] as const;
export const SUB_FILTERS = ['новинки', 'горячее', 'салаты', 'десерты', 'закуски'] as const;

export type MainFilterType = (typeof MAIN_FILTERS)[number];
export type SubFilterType = (typeof SUB_FILTERS)[number];
