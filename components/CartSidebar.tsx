import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Truck } from 'lucide-react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, delta: number) => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, cartItems, onRemove, onUpdateQuantity }) => {
  const [zipCode, setZipCode] = useState('');
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + (shippingCost || 0);

  const handleCalculateShipping = () => {
    if (zipCode.length !== 8) return;
    setIsCalculating(true);
    setTimeout(() => {
      // Mock shipping logic
      setShippingCost(18.50);
      setIsCalculating(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-5 bg-christmas-green text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6" />
            <h2 className="text-xl font-bold">Seu Carrinho</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-70">
              <ShoppingBag size={64} className="mb-4 text-gray-300" />
              <p className="text-lg">Seu carrinho está vazio.</p>
              <button onClick={onClose} className="mt-4 text-christmas-green hover:underline font-semibold">
                Começar a comprar
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 border border-gray-100 rounded-lg bg-gray-50 items-center">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  loading="lazy"
                  className="w-16 h-16 object-cover rounded-md border border-gray-200" 
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-gray-800 line-clamp-1">{item.name}</h4>
                  <div className="text-christmas-red font-bold text-sm">
                    R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-6 h-6 flex items-center justify-center bg-white border border-gray-300 rounded text-gray-600 hover:border-christmas-green"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-6 h-6 flex items-center justify-center bg-white border border-gray-300 rounded text-gray-600 hover:border-christmas-green"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => onRemove(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-gray-50">
            {/* Shipping Calc in Cart */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Calcular Frete</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="CEP" 
                  maxLength={8}
                  value={zipCode}
                  onChange={(e) => {
                     const val = e.target.value.replace(/\D/g, '').slice(0,8);
                     setZipCode(val);
                     if (val.length < 8) setShippingCost(null);
                  }}
                  className="flex-1 border border-christmas-green/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-christmas-green focus:ring-1 focus:ring-christmas-green/50 bg-white"
                />
                <button 
                  onClick={handleCalculateShipping}
                  disabled={zipCode.length !== 8 || isCalculating}
                  className="bg-christmas-green text-white px-3 py-2 rounded text-sm font-medium hover:bg-christmas-dark disabled:opacity-50 transition-colors shadow-sm"
                >
                  {isCalculating ? '...' : 'OK'}
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              {shippingCost !== null && (
                <div className="flex justify-between text-green-700">
                  <span className="flex items-center gap-1"><Truck size={12}/> Frete</span>
                  <span>R$ {shippingCost.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-lg font-bold text-gray-800 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <button className="w-full bg-christmas-green hover:bg-christmas-dark text-white py-3 rounded-lg font-bold shadow-lg transition-transform active:scale-[0.98]">
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </div>
  );
};