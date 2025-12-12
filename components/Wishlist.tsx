import React from 'react';
import { Heart } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface WishlistProps {
  items: Product[];
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onContinueShopping: () => void;
}

export const Wishlist: React.FC<WishlistProps> = ({ 
  items, 
  onAddToCart, 
  onToggleWishlist, 
  onProductClick,
  onContinueShopping 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 animate-in fade-in duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
          <Heart className="text-christmas-red fill-current" size={32} />
          <h1 className="text-3xl font-display font-bold text-christmas-green">Minha Lista de Desejos</h1>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-red-50 p-6 rounded-full mb-6">
              <Heart size={48} className="text-christmas-red opacity-50" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Sua lista está vazia</h2>
            <p className="text-gray-500 mb-8 max-w-md text-center">
              Salve seus itens favoritos para não perder de vista o que você mais gostou para este Natal.
            </p>
            <button 
              onClick={onContinueShopping}
              className="px-8 py-3 bg-christmas-green text-white rounded-lg font-bold shadow-lg hover:bg-christmas-dark transition-colors"
            >
              Explorar Produtos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart}
                onClick={onProductClick}
                isWishlisted={true}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};