import React, { useState } from 'react';
import { Plus, Star, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onClick, 
  isWishlisted = false, 
  onToggleWishlist 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group h-full border border-gray-100 cursor-pointer relative"
      onClick={() => onClick(product)}
    >
      <div className="relative overflow-hidden aspect-square bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name} 
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {product.oldPrice && (
          <div className="absolute top-2 left-2 bg-christmas-red text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm z-10">
            OFERTA
          </div>
        )}
        
        {onToggleWishlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-christmas-red shadow-sm z-10 backdrop-blur-sm transition-colors"
            title={isWishlisted ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart size={18} className={`transition-colors ${isWishlisted ? 'fill-christmas-red text-christmas-red' : ''}`} />
          </button>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-christmas-green font-bold uppercase tracking-wider mb-1">
          {product.category}
        </div>
        <h3 className="text-christmas-dark font-semibold mb-2 line-clamp-2 min-h-[3rem] group-hover:text-christmas-red transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={14} 
              className={`${i < product.rating ? 'text-christmas-gold fill-current' : 'text-gray-300'}`} 
            />
          ))}
          <span className="text-xs text-gray-400 ml-2">({Math.floor(Math.random() * 50) + 5})</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            {product.oldPrice && (
              <span className="text-gray-400 text-sm line-through block">
                R$ {product.oldPrice.toFixed(2).replace('.', ',')}
              </span>
            )}
            <span className="text-christmas-red font-bold text-xl block">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="bg-christmas-green hover:bg-christmas-dark text-white p-2 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-95 z-20"
            title="Adicionar ao carrinho"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};