import React, { useState } from 'react';
import { Shield, Lock, ArrowLeft, Key, AlertTriangle } from 'lucide-react';
import { authService } from '../auth';
import { User } from '../types';

interface AdminLoginPageProps {
  onBack: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onBack, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Authenticate directly against the Auth Service
      const user = await authService.login(email, password);
      
      if (user.role !== 'ADMIN') {
        throw new Error('Acesso negado. Esta área é restrita a administradores.');
      }

      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Falha na autenticação administrativa.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-christmas-snow flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background decoration - Lighter and festive */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-christmas-red/5 rounded-full filter blur-3xl translate-x-[-30%] translate-y-[-30%]"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-christmas-green/5 rounded-full filter blur-3xl translate-x-[30%] translate-y-[30%]"></div>
      </div>

      <button 
        onClick={onBack}
        className="absolute top-6 left-6 text-gray-500 hover:text-christmas-green flex items-center gap-2 z-20 transition-colors font-medium"
      >
        <ArrowLeft size={20} />
        <span>Voltar para Loja</span>
      </button>

      <div className="bg-white/80 backdrop-blur-xl border border-white/50 w-full max-w-md rounded-2xl shadow-2xl p-8 z-10 relative overflow-hidden">
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green"></div>

        <div className="flex flex-col items-center mb-8 mt-2">
          <div className="bg-christmas-green/10 p-4 rounded-full mb-4 ring-4 ring-white shadow-lg">
            <Shield size={32} className="text-christmas-green" />
          </div>
          <h1 className="text-2xl font-display font-bold text-christmas-dark tracking-wide">Área Administrativa</h1>
          <p className="text-gray-500 text-sm mt-1">Acesso restrito para gestão da loja</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-lg mb-6 flex items-start gap-3 text-sm animate-in slide-in-from-top-2">
            <AlertTriangle className="shrink-0 mt-0.5" size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
              Usuário de Acesso
            </label>
            <div className="relative group">
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-200 text-christmas-dark px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-christmas-green/20 focus:border-christmas-green outline-none transition-all pl-11 text-sm shadow-sm group-hover:border-christmas-green/50"
                placeholder="Ex: snttbstt@01"
                required
              />
              <Key size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-christmas-green transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
              Senha de Segurança
            </label>
            <div className="relative group">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-200 text-christmas-dark px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-christmas-green/20 focus:border-christmas-green outline-none transition-all pl-11 text-sm shadow-sm group-hover:border-christmas-green/50"
                placeholder="••••••••••••"
                required
              />
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-christmas-green transition-colors" />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-christmas-green hover:bg-christmas-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-christmas-green/20 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4 tracking-wide text-sm flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Autenticando...</span>
              </>
            ) : (
              'Entrar no Painel'
            )}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
            <Lock size={12} />
            Conexão segura. Tentativas monitoradas.
          </p>
        </div>
      </div>
    </div>
  );
};