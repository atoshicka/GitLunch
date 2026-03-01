// Типы для API запросов
export interface Restaurant {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface PromoDish {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  isPromo: boolean;
}

export interface HomeApiResponse {
  restaurants: Restaurant[];
  promoDishes: PromoDish[];
}
