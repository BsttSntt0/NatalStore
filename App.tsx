import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { ProductCard } from './components/ProductCard';
import { ProductDetails } from './components/ProductDetails';
import { CartSidebar } from './components/CartSidebar';
import { LoginModal } from './components/LoginModal';
import { Footer } from './components/Footer';
import { PaymentSettings } from './components/PaymentSettings';
import { Wishlist } from './components/Wishlist';
import { RegisterPage } from './components/RegisterPage';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginPage } from './components/AdminLoginPage';
import { ChatWidget } from './components/ChatWidget';
import { CheckoutPage } from './components/CheckoutPage';
import { CATEGORIES, PRODUCTS, REVIEWS } from './constants';
import { CartItem, Product, Category, User, Order, Promotion } from './types';
import { Star } from 'lucide-react';
import { authService } from './auth';

// Helper for safe JSON parsing
const safeParse = (key: string, fallback: any) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const App: React.FC = () => {
  // --- GLOBAL STATE ---
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = safeParse('natal_store_products', null);
    // Merge stock and isActive if loading from legacy constants
    if (!stored) return PRODUCTS.map(p => ({ ...p, stock: 100, isActive: true }));
    return stored;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    return safeParse('natal_store_orders', [
      {
        id: 'ORD-2023-001',
        userId: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
        userName: 'Cliente Exemplo',
        userEmail: 'cliente@exemplo.com',
        items: [PRODUCTS[0], PRODUCTS[1]].map(p => ({...p, quantity: 1, stock: 100, isActive: true})),
        total: 99.77,
        status: 'Pago',
        date: '2023-11-20T10:30:00Z',
        shippingAddress: 'Rua das Flores, 123 - São Paulo, SP',
        paymentMethod: 'Pix'
      }
    ]);
  });

  const [users, setUsers] = useState<User[]>(() => {
    const dbUsers = safeParse('natal_store_users_db', []);
    if (dbUsers.length === 0) {
      // Mock initial data if empty
      return [
         { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Administrador', email: 'mauriciosntt@gmail.com', role: 'ADMIN', status: 'Active', phone: '11999999999' },
         { id: '7c9e6679-7425-40de-944b-e07fc1f90ae7', name: 'Cliente Exemplo', email: 'cliente@exemplo.com', role: 'USER', status: 'Active', phone: '11988888888', address: { street: 'Rua das Flores', number: '123', city: 'São Paulo', state: 'SP', zip: '01000-000' } }
      ];
    }
    return dbUsers;
  });

  const [promotions, setPromotions] = useState<Promotion[]>(() => safeParse('natal_store_promotions', []));

  // --- PERSISTENCE ---
  useEffect(() => localStorage.setItem('natal_store_products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('natal_store_orders', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('natal_store_promotions', JSON.stringify(promotions)), [promotions]);
  // Users are handled by auth.ts usually, but for the dashboard view we sync state here
  useEffect(() => localStorage.setItem('natal_store_users_db', JSON.stringify(users)), [users]);


  const [activeCategory, setActiveCategory] = useState<Category>('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Initialize Auth
  useEffect(() => {
    try {
      const user = authService.getSession();
      if (user) {
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
    }
  }, []);

  // Wishlist State with safe localStorage
  const [wishlist, setWishlist] = useState<Product[]>(() => safeParse('natal_wishlist', []));

  useEffect(() => {
    try {
      localStorage.setItem('natal_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      // Ignore storage errors
    }
  }, [wishlist]);
  
  // View State
  const [currentView, setCurrentView] = useState<'home' | 'product' | 'admin' | 'wishlist' | 'register' | 'admin-dashboard' | 'admin-login' | 'checkout'>('home');

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

  // Wishlist Logic
  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isProductWishlisted = (productId: number) => {
    return wishlist.some(p => p.id === productId);
  };

  // Filtering (Only Active Products)
  const activeProducts = products.filter(p => p.isActive);

  const filteredProducts = activeProducts.filter(p => {
    const matchesCategory = activeCategory === 'Todas' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredOffers = activeProducts.filter(p => p.isFeatured && p.name.toLowerCase().includes(searchTerm.toLowerCase()));

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

  const handleCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = (data: any) => {
    // In a real app, this would send to backend
    // For now, clear cart after "success" view handled by CheckoutPage
    setTimeout(() => {
      setCartItems([]);
      handleBackToHome();
    }, 5000); // Redirect home after 5s of success message
  };

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsLoginOpen(false);
    if (user.role === 'ADMIN') {
      setCurrentView('admin-dashboard');
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    handleBackToHome();
  };

  const handleRegister = () => {
    setIsLoginOpen(false);
    setCurrentView('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenWishlist = () => {
    setCurrentView('wishlist');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleAdminAccess = () => {
    setIsLoginOpen(false);
    setCurrentView('admin-login');
  }

  // ADMIN DATA HANDLERS
  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };
  const addProduct = (newProduct: Product) => {
    setProducts(prev => [...prev, newProduct]);
  };
  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateUser = (updated: User) => {
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  const updateOrder = (updated: Order) => {
    setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
  };

  const addPromotion = (promo: Promotion) => {
    setPromotions(prev => [...prev, promo]);
  };
  const deletePromotion = (id: string) => {
    setPromotions(prev => prev.filter(p => p.id !== id));
  };

  // Render content based on current view
  const renderContent = () => {
    if (currentView === 'admin-login') {
      return (
        <AdminLoginPage 
          onBack={handleBackToHome} 
          onLoginSuccess={handleLoginSuccess} 
        />
      );
    }

    if (currentView === 'admin-dashboard') {
      // Protected Route Check
      if (!currentUser || currentUser.role !== 'ADMIN') {
        setCurrentView('home');
        return null;
      }
      return (
        <AdminDashboard 
          onLogout={handleLogout} 
          users={users}
          orders={orders}
          products={products}
          promotions={promotions}
          onUpdateProduct={updateProduct}
          onAddProduct={addProduct}
          onDeleteProduct={deleteProduct}
          onUpdateUser={updateUser}
          onUpdateOrder={updateOrder}
          onAddPromotion={addPromotion}
          onDeletePromotion={deletePromotion}
        />
      );
    }

    if (currentView === 'admin') {
       if (!currentUser || currentUser.role !== 'ADMIN') {
        setCurrentView('home');
        return null;
      }
      return <PaymentSettings onBack={handleBackToHome} />;
    }

    if (currentView === 'register') {
      return <RegisterPage onBack={handleBackToHome} onRegisterSuccess={handleLoginSuccess} />;
    }

    if (currentView === 'checkout') {
      return (
        <CheckoutPage 
          cartItems={cartItems}
          user={currentUser}
          onBack={() => {
            setCurrentView('home');
            setIsCartOpen(true);
          }}
          onPlaceOrder={handlePlaceOrder}
        />
      );
    }

    if (currentView === 'wishlist') {
      return (
        <Wishlist 
          items={wishlist} 
          onAddToCart={addToCart} 
          onToggleWishlist={toggleWishlist}
          onProductClick={handleProductClick}
          onContinueShopping={handleBackToHome}
        />
      );
    }

    if (currentView === 'product' && selectedProduct) {
      return (
        <ProductDetails 
          product={selectedProduct} 
          onBack={handleBackToHome}
          onAddToCart={addToCart}
          isWishlisted={isProductWishlisted(selectedProduct.id)}
          onToggleWishlist={toggleWishlist}
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
                  isWishlisted={isProductWishlisted(product.id)}
                  onToggleWishlist={toggleWishlist}
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
                  isWishlisted={isProductWishlisted(product.id)}
                  onToggleWishlist={toggleWishlist}
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
      {/* Hide standard Header if in Admin views */}
      {(currentView !== 'admin' && currentView !== 'register' && currentView !== 'admin-dashboard' && currentView !== 'admin-login') && (
        <Header 
          cartCount={cartCount} 
          wishlistCount={wishlist.length}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenWishlist={handleOpenWishlist}
          onSearch={(term) => {
            setSearchTerm(term);
            if (currentView !== 'home' && term) {
              setCurrentView('home');
              setSelectedProduct(null);
            }
          }}
          onLogoClick={handleBackToHome}
          user={currentUser}
          onLogout={handleLogout}
        />
      )}

      <main className="flex-grow">
        {renderContent()}
      </main>

      {/* Hide standard Footer if in Admin views */}
      {(currentView !== 'admin' && currentView !== 'register' && currentView !== 'admin-dashboard' && currentView !== 'admin-login' && currentView !== 'checkout') && <Footer />}

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onCheckout={handleCheckout}
      />
      
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
        onRegister={handleRegister}
        onAdminAccess={handleAdminAccess}
      />

      {/* Chat Widget */}
      {(currentView !== 'admin' && currentView !== 'register' && currentView !== 'admin-dashboard' && currentView !== 'admin-login') && (
        <ChatWidget />
      )}
    </div>
  );
};

export default App;