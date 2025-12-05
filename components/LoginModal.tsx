import React from 'react';
import { X, Shield } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminLogin?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onAdminLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-display text-christmas-green font-bold mb-2">Bem-vindo de volta!</h2>
          <p className="text-gray-500">Entre para acessar seus pedidos e favoritos.</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-christmas-green focus:border-transparent outline-none transition-all"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-christmas-green focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded text-christmas-green focus:ring-christmas-green" />
              <span className="text-gray-600">Lembrar-me</span>
            </label>
            <a href="#" className="text-christmas-red hover:underline">Esqueceu a senha?</a>
          </div>

          <button className="w-full bg-christmas-green hover:bg-christmas-dark text-white font-bold py-3 rounded-lg shadow-md transition-transform active:scale-[0.98]">
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Não tem uma conta? <a href="#" className="text-christmas-green font-bold hover:underline">Cadastre-se</a>
        </div>

        {/* Admin Access Link */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <button 
            onClick={() => {
              onClose();
              if (onAdminLogin) onAdminLogin();
            }}
            className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-christmas-green transition-colors"
          >
            <Shield size={12} />
            <span>Acesso Administrativo</span>
          </button>
        </div>
      </div>
    </div>
  );
};