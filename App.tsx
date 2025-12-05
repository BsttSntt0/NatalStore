import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { ProductCard } from './components/ProductCard';
import { ProductDetails } from './components/ProductDetails';
import { CartSidebar } from './components/CartSidebar';
import { LoginModal } from './components/LoginModal';
import { Footer } from './components/Footer';
import { PaymentSettings } from './components/PaymentSettings';
import { CATEGORIES, PRODUCTS, REVIEWS } from './constants';
import { CartItem, Product, Category } from './types';
import { Star, MessageCircle } from 'lucide-react';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // View State
  const [currentView, setCurrentView] = useState<'home' | 'product' | 'admin'>('home');

  // Cart Logic
  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Filtering
  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = activeCategory === 'Todas' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredOffers = PRODUCTS.filter(p => p.isFeatured && p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Navigation Handlers
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSelectedProduct(null);
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogin = () => {
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render content based on current view
  const renderContent = () => {
    if (currentView === 'admin') {
      return <PaymentSettings onBack={handleBackToHome} />;
    }

    if (currentView === 'product' && selectedProduct) {
      return (
        <ProductDetails 
          product={selectedProduct} 
          onBack={handleBackToHome}
          onAddToCart={addToCart}
        />
      );
    }

    return (
      <>
        <HeroCarousel />

        {/* Featured Offers */}
        {searchTerm === '' && (
          <section id="ofertas" className="py-16 container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl md:text-4xl font-display text-christmas-green font-bold">
                Ofertas em Destaque
              </h2>
              <div className="h-1 bg-christmas-red flex-grow ml-8 rounded-full opacity-20 hidden md:block"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredOffers.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart}
                  onClick={handleProductClick}
                />
              ))}
            </div>
          </section>
        )}

        {/* Main Product Catalog */}
        <section id="produtos" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-display text-christmas-green font-bold mb-4">
                {searchTerm ? `Resultados para "${searchTerm}"` : 'Nossa Coleção'}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {searchTerm ? 'Encontre o que você precisa para o seu Natal.' : 'Explore nossa seleção cuidadosa de itens para tornar seu Natal inesquecível.'}
              </p>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-10 sticky top-20 z-40 bg-white/90 backdrop-blur-sm py-4 rounded-lg shadow-sm">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeCategory === cat 
                      ? 'bg-christmas-red text-white shadow-md transform scale-105' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart}
                  onClick={handleProductClick}
                />
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                <p className="text-xl mb-2">Nenhum produto encontrado 🎄</p>
                <p>Tente buscar por outro termo ou categoria.</p>
              </div>
            )}
          </div>
        </section>

        {/* Feedback / Testimonials (Global) */}
        {searchTerm === '' && (
          <section className="py-16 bg-christmas-snow">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-display text-center text-christmas-green font-bold mb-12">
                O Que Dizem Nossos Clientes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {REVIEWS.map(review => (
                  <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className={`${i < review.rating ? 'text-christmas-gold fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    <p className="text-gray-700 italic mb-4">"{review.comment}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-christmas-green/10 rounded-full flex items-center justify-center text-christmas-green font-bold">
                        {review.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-gray-900">{review.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Hide standard Header if in Admin view */}
      {currentView !== 'admin' && (
        <Header 
          cartCount={cartCount} 
          onOpenCart={() => setIsCartOpen(true)}
          onOpenLogin={() => setIsLoginOpen(true)}
          onSearch={(term) => {
            setSearchTerm(term);
            if (currentView !== 'home' && term) {
              setCurrentView('home');
              setSelectedProduct(null);
            }
          }}
        />
      )}

      <main className="flex-grow">
        {renderContent()}
      </main>

      {/* Hide standard Footer if in Admin view */}
      {currentView !== 'admin' && <Footer />}

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />
      
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onAdminLogin={handleAdminLogin}
      />

      {/* Floating Whatsapp Button */}
      {currentView !== 'admin' && (
        <a 
          href="#"
          className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-40 hover:scale-110 duration-300"
          title="Fale conosco no WhatsApp"
        >
          <MessageCircle size={28} fill="white" />
        </a>
      )}
    </div>
  );
};

export default App;