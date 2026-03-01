export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  filterType?: string;
  isPromo?: boolean;
  imageUrl: string;
  isVegetarian: boolean;
  isSpicy: boolean;
  rating: number;
  preparationTime: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface MenuResponse {
  dishes: Dish[];
  categories: Category[];
  total: number;
}
