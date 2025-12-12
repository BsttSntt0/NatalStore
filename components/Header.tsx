import React, { useState } from 'react';
import { ShoppingCart, User, Menu, X, TreePine, Search, Heart, LogOut } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenLogin: () => void;
  onOpenWishlist: () => void;
  onSearch: (term: string) => void;
  onLogoClick: () => void;
  user: UserType | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  cartCount, 
  wishlistCount, 
  onOpenCart, 
  onOpenLogin, 
  onOpenWishlist,
  onSearch,
  onLogoClick,
  user,
  onLogout
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-christmas-green text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-pointer shrink-0" onClick={onLogoClick}>
            <div className="bg-white p-2 rounded-full shadow-inner group-hover:rotate-12 transition-transform duration-300">
              <TreePine className="h-6 w-6 text-christmas-red" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-wide leading-none">Natal Store</h1>
              <span className="text-xs text-christmas-gold uppercase tracking-widest font-semibold">Loja Oficial</span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg relative mx-4">
            <input
              type="text"
              placeholder="O que você está procurando?"
              className="w-full pl-10 pr-4 py-2 rounded-full border border-christmas-green/20 focus:border-christmas-gold focus:outline-none focus:ring-1 focus:ring-christmas-gold bg-white text-christmas-dark placeholder-christmas-green/50"
              onChange={(e) => onSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-christmas-green/60 h-5 w-5" />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 font-medium shrink-0">
            <button onClick={onLogoClick} className="hover:text-christmas-gold transition-colors text-sm">Início</button>
            <a href="#ofertas" className="hover:text-christmas-gold transition-colors text-sm">Ofertas</a>
            <a href="#produtos" className="hover:text-christmas-gold transition-colors text-sm">Coleções</a>
            <a href="#sobre" className="hover:text-christmas-gold transition-colors text-sm">Quem Somos</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
               <div className="flex items-center gap-2">
                 <div className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors cursor-pointer" title={user.name}>
                   <User className="h-5 w-5" />
                   <span className="hidden md:inline text-sm font-semibold truncate max-w-[100px]">{user.name.split(' ')[0]}</span>
                 </div>
                 <button 
                  onClick={onLogout}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-white/80 hover:text-white"
                  title="Sair"
                 >
                   <LogOut className="h-5 w-5" />
                 </button>
               </div>
            ) : (
              <button 
                onClick={onOpenLogin}
                className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="hidden md:inline text-sm font-semibold">Entrar</span>
              </button>
            )}
            
            <button 
              onClick={onOpenWishlist}
              className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Lista de Desejos"
            >
              <Heart className="h-6 w-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-christmas-red text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-christmas-green">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button 
              onClick={onOpenCart}
              className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Carrinho"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-christmas-red text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-christmas-green animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 hover:bg-white/10 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-3 pb-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-christmas-green/20 focus:outline-none focus:ring-1 focus:ring-christmas-gold text-christmas-dark text-sm bg-white placeholder-christmas-green/50"
              onChange={(e) => onSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-christmas-green/60 h-4 w-4" />
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 pb-4 border-t border-white/10 pt-4 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-4">
              <button onClick={() => { onLogoClick(); setIsMobileMenuOpen(false); }} className="block text-left px-2 py-1 hover:bg-white/10 rounded">Início</button>
              <a href="#ofertas" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-1 hover:bg-white/10 rounded">Ofertas</a>
              <a href="#produtos" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-1 hover:bg-white/10 rounded">Coleções</a>
              <button onClick={() => { onOpenWishlist(); setIsMobileMenuOpen(false); }} className="block text-left px-2 py-1 hover:bg-white/10 rounded">Lista de Desejos</button>
              <a href="#sobre" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-1 hover:bg-white/10 rounded">Quem Somos</a>
              {user && (
                 <button onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} className="block text-left px-2 py-1 hover:bg-white/10 text-red-200 rounded">Sair</button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};