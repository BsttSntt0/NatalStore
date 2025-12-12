
export type Category = string;

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'USER';
  createdAt?: string;
  status?: 'Active' | 'Locked';
  address?: {
    street: string;
    number: string;
    city: string;
    state: string;
    zip: string;
    neighborhood?: string;
    complement?: string;
  };
}

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
  stock: number;
  isActive: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'Pendente' | 'Pago' | 'Enviado' | 'Entregue' | 'Cancelado';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
  shippingAddress: string;
  paymentMethod: string;
}

export interface Promotion {
  id: string;
  title: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  active: boolean;
  bannerUrl?: string;
  productIds: number[];
}
