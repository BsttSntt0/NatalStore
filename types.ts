export type Category = 'Todas' | 'Árvores' | 'Luzes' | 'Mesa' | 'Fachada' | 'Infláveis' | 'Acessórios';

export interface Review {
  id: number;
  name: string;
  comment: string;
  rating: number;
  date: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string; // Main image (thumbnail)
  images: string[]; // Gallery images
  category: Category;
  isFeatured?: boolean;
  rating: number;
  description: string;
  specifications: string[];
  reviews?: Review[];
}

export interface CartItem extends Product {
  quantity: number;
}
