import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart, Star, Truck, ShieldCheck, Share2, Box, Calendar, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

type Tab = 'description' | 'specs' | 'reviews';

export const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  product, 
  onBack, 
  onAddToCart,
  isWishlisted,
  onToggleWishlist
}) => {
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [activeTab, setActiveTab] = useState<Tab>('description');
  
  // Shipping State
  const [zipCode, setZipCode] = useState('');
  const [shippingInfo, setShippingInfo] = useState<{price: number, days: number} | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [zipError, setZipError] = useState('');

  // Calculate discount percentage
  const discount = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
    setZipCode(value);
    setZipError('');
    if (value.length === 8) {
      calculateShipping(value);
    } else {
      setShippingInfo(null);
    }
  };

  const calculateShipping = (zip: string) => {
    setIsCalculating(true);
    // Simulating API call
    setTimeout(() => {
      // Mock calculation based on zip for variety
      const mockPrice = 15 + (parseInt(zip.slice(-2)) % 20); 
      const mockDays = 3 + (parseInt(zip.slice(-1)) % 5);
      setShippingInfo({ price: mockPrice, days: mockDays });
      setIsCalculating(false);
    }, 800);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12 animate-in fade-in duration-300">
      {/* Navbar / Breadcrumb area */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            <span className="font-medium hidden sm:inline">Voltar</span>
          </button>
          <span className="text-gray-400 text-sm hidden sm:inline">|</span>
          <span className="text-gray-500 text-sm truncate">{product.category} / {product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8">
            
            {/* Left Column: Image Gallery */}
            <div className="p-6 lg:p-8 bg-white">
              <div className="aspect-square w-full rounded-xl overflow-hidden border border-gray-100 mb-4 bg-gray-50 relative group">
                <img 
                  src={selectedImage} 
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                />
                {discount > 0 && (
                  <span className="absolute top-4 left-4 bg-christmas-red text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                    -{discount}% OFF
                  </span>
                )}
              </div>
              
              {/* Horizontal Scroll Gallery */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                {product.images && product.images.length > 0 ? (
                  [product.image, ...product.images.filter(img => img !== product.image)].map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden snap-start transition-all ${
                        selectedImage === img ? 'border-christmas-gold ring-2 ring-christmas-gold/30' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))
                ) : (
                   <button
                      className="flex-shrink-0 w-20 h-20 rounded-lg border-2 border-christmas-gold overflow-hidden"
                    >
                      <img src={product.image} alt="" className="w-full h-full object-cover" />
                    </button>
                )}
              </div>
            </div>

            {/* Right Column: Product Info */}
            <div className="p-6 lg:p-8 lg:border-l border-gray-100 flex flex-col">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold text-christmas-green uppercase tracking-wider bg-christmas-green/10 px-2 py-1 rounded">
                  {product.category}
                </span>
                <div className="flex gap-2">
                   <button 
                    onClick={() => onToggleWishlist(product)}
                    className="text-gray-400 hover:text-christmas-red transition-colors p-1"
                    title={isWishlisted ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  >
                    <Heart size={24} className={isWishlisted ? 'fill-christmas-red text-christmas-red' : ''} />
                  </button>
                  <button className="text-gray-400 hover:text-christmas-gold transition-colors p-1">
                    <Share2 size={24} />
                  </button>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-display font-bold text-christmas-dark mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex text-christmas-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className={i < product.rating ? "fill-current" : "text-gray-300"} />
                  ))}
                </div>
                <span className="text-gray-500 text-sm">({product.reviews?.length || 0} avaliações)</span>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                {product.oldPrice && (
                  <div className="text-gray-400 text-sm line-through mb-1">
                    De: R$ {product.oldPrice.toFixed(2).replace('.', ',')}
                  </div>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-christmas-red">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-green-600 text-sm font-semibold">
                    em 12x de R$ {(product.price / 12).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Shipping Calculator */}
              <div className="mb-8 bg-white border border-green-100 rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Truck size={16} className="text-christmas-green"/>
                  Calcular Frete e Prazo
                </h3>
                <div className="flex gap-2 mb-3">
                  <input 
                    type="text" 
                    placeholder="Digite seu CEP" 
                    value={zipCode}
                    onChange={handleZipChange}
                    maxLength={8}
                    className="flex-1 border border-christmas-green/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-christmas-green focus:ring-1 focus:ring-christmas-green/50 text-christmas-dark placeholder-christmas-green/50 bg-white"
                  />
                  <button 
                    onClick={() => zipCode.length === 8 && calculateShipping(zipCode)}
                    disabled={zipCode.length !== 8 || isCalculating}
                    className="bg-christmas-green text-white px-4 py-2 rounded text-sm font-semibold hover:bg-christmas-dark disabled:opacity-50 transition-colors shadow-sm"
                  >
                    {isCalculating ? '...' : 'Calcular'}
                  </button>
                </div>
                
                {shippingInfo && (
                  <div className="bg-green-50 border border-green-100 rounded p-3 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="font-semibold text-green-800">Entrega Normal</span>
                      <span className="font-bold text-green-800">R$ {shippingInfo.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="text-xs text-green-700 flex items-center gap-1">
                      <Calendar size={12} />
                      Chega em {shippingInfo.days} a {shippingInfo.days + 2} dias úteis
                    </div>
                  </div>
                )}
                {zipCode.length > 0 && zipCode.length < 8 && (
                   <span className="text-xs text-gray-400">Digite 8 números</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-white border border-gray-200 p-3 rounded-lg">
                  <ShieldCheck className="text-christmas-green" />
                  <div>
                    <span className="block font-semibold text-gray-900">Garantia Natalina</span>
                    <span className="text-xs">30 dias para devolução</span>
                  </div>
                </div>
                 <div className="flex items-center gap-3 text-sm text-gray-600 bg-white border border-gray-200 p-3 rounded-lg">
                  <Box className="text-christmas-green" />
                  <div>
                    <span className="block font-semibold text-gray-900">Estoque Disponível</span>
                    <span className="text-xs">Envio imediato</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <button 
                  onClick={() => onAddToCart(product)}
                  className="w-full bg-christmas-green hover:bg-christmas-dark text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-900/10 flex items-center justify-center gap-3 transition-transform active:scale-[0.98]"
                >
                  <ShoppingCart size={24} />
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Content Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs Header */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('description')}
              className={`flex-1 py-4 text-center font-bold text-sm md:text-base transition-colors relative ${
                activeTab === 'description' ? 'text-christmas-red' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Descrição
              {activeTab === 'description' && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-christmas-red rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`flex-1 py-4 text-center font-bold text-sm md:text-base transition-colors relative ${
                activeTab === 'specs' ? 'text-christmas-red' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Especificações
               {activeTab === 'specs' && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-christmas-red rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-4 text-center font-bold text-sm md:text-base transition-colors relative ${
                activeTab === 'reviews' ? 'text-christmas-red' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Avaliações ({product.reviews?.length || 0})
               {activeTab === 'reviews' && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-christmas-red rounded-t-full" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8 min-h-[300px]">
            {activeTab === 'description' && (
              <div className="animate-in fade-in duration-300">
                <h3 className="font-display text-2xl font-bold text-gray-800 mb-4">Sobre o Produto</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="animate-in fade-in duration-300">
                <h3 className="font-display text-2xl font-bold text-gray-800 mb-6">Ficha Técnica</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specifications?.map((spec, index) => (
                    <li key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="w-2 h-2 bg-christmas-gold rounded-full shrink-0" />
                      <span className="text-gray-700 font-medium">{spec}</span>
                    </li>
                  )) || <li className="text-gray-400">Nenhuma especificação disponível.</li>}
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-display text-2xl font-bold text-gray-800">O que dizem os clientes</h3>
                  <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100">
                    <span className="font-bold text-yellow-700 text-lg">{product.rating.toFixed(1)}</span>
                    <div className="flex text-christmas-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className={i < Math.round(product.rating) ? "fill-current" : "text-gray-300"} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center font-bold text-christmas-green">
                              {review.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 leading-tight">{review.name}</p>
                              <p className="text-xs text-gray-500">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex text-christmas-gold">
                             {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} className={i < review.rating ? "fill-current" : "text-gray-300"} />
                              ))}
                          </div>
                        </div>
                        <p className="text-gray-700 italic pl-13 border-l-4 border-christmas-gold/30 pl-4">
                          "{review.comment}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <p className="mb-2">Ainda não há avaliações para este produto.</p>
                      <button className="text-christmas-green font-bold hover:underline">Seja o primeiro a avaliar</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};