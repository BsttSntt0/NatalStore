import React, { useState } from 'react';
import { ShoppingCart, User, Menu, X, TreePine, Search } from 'lucide-react';
import { CartItem } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenLogin: () => void;
  onSearch: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart, onOpenLogin, onSearch }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-christmas-green text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-pointer shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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
              className="w-full pl-10 pr-4 py-2 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-christmas-gold text-gray-800 placeholder-gray-500"
              onChange={(e) => onSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 font-medium shrink-0">
            <a href="#inicio" className="hover:text-christmas-gold transition-colors text-sm">Início</a>
            <a href="#ofertas" className="hover:text-christmas-gold transition-colors text-sm">Ofertas</a>
            <a href="#produtos" className="hover:text-christmas-gold transition-colors text-sm">Coleções</a>
            <a href="#sobre" className="hover:text-christmas-gold transition-colors text-sm">Quem Somos</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={onOpenLogin}
              className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
            >
              <User className="h-5 w-5" />
              <span className="hidden md:inline text-sm font-semibold">Entrar</span>
            </button>
            
            <button 
              onClick={onOpenCart}
              className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
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
              className="w-full pl-10 pr-4 py-2 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-christmas-gold text-gray-800 text-sm"
              onChange={(e) => onSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 pb-4 border-t border-white/10 pt-4 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-4">
              <a href="#inicio" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-1 hover:bg-white/10 rounded">Início</a>
              <a href="#ofertas" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-1 hover:bg-white/10 rounded">Ofertas</a>
              <a href="#produtos" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-1 hover:bg-white/10 rounded">Coleções</a>
              <a href="#sobre" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-1 hover:bg-white/10 rounded">Quem Somos</a>
              <a href="#contato" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-1 hover:bg-white/10 rounded">Contato</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};