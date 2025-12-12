import React, { useState } from 'react';
import { CartItem, User } from '../types';
import { ArrowLeft, MapPin, CreditCard, CheckCircle, Truck, ShieldCheck } from 'lucide-react';

interface CheckoutPageProps {
  cartItems: CartItem[];
  user: User | null;
  onBack: () => void;
  onPlaceOrder: (data: any) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ cartItems, user, onBack, onPlaceOrder }) => {
  const [step, setStep] = useState<'address' | 'payment' | 'success'>('address');
  
  // Initialize address with existing user data or empty strings, including new fields
  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    number: user?.address?.number || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    neighborhood: user?.address?.neighborhood || '',
    complement: user?.address?.complement || ''
  });

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 18.50; // Mock fixed shipping
  const total = subtotal + shipping;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleFinalize = () => {
    // Construct full address string for the order record
    const fullAddress = `${address.street}, ${address.number} - ${address.neighborhood}, ${address.city} - CEP: ${address.zip}${address.complement ? ` (${address.complement})` : ''}`;
    onPlaceOrder({ items: cartItems, total, address: fullAddress, method: 'Pix' });
    setStep('success');
  };

  const inputClass = "w-full px-4 py-2.5 border border-christmas-green/30 rounded-lg focus:ring-2 focus:ring-christmas-green focus:border-transparent outline-none bg-white text-christmas-dark transition-all placeholder-gray-400 shadow-sm";
  const labelClass = "block text-sm font-bold text-christmas-dark mb-1.5";

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
          <CheckCircle size={48} />
        </div>
        <h1 className="text-3xl font-display font-bold text-christmas-green mb-2">Pedido Confirmado!</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          Obrigado por comprar na Natal Store. Enviaremos as atualizações do seu pedido para o seu e-mail.
        </p>
        <button onClick={onBack} className="bg-christmas-green text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-christmas-dark transition-transform hover:scale-105">
          Voltar para a Loja
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 animate-in fade-in duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="text-gray-500 hover:text-christmas-green">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-display font-bold text-christmas-dark">Finalizar Compra</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Forms */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Steps Indicator */}
            <div className="flex items-center gap-4 mb-6 text-sm font-semibold">
              <div className={`flex items-center gap-2 ${step === 'address' ? 'text-christmas-green' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'address' ? 'border-christmas-green bg-green-50' : 'border-gray-300'}`}>1</div>
                Endereço
              </div>
              <div className="w-10 h-0.5 bg-gray-200"></div>
              <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-christmas-green' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'payment' ? 'border-christmas-green bg-green-50' : 'border-gray-300'}`}>2</div>
                Pagamento
              </div>
            </div>

            {step === 'address' ? (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <MapPin className="text-christmas-green" /> Endereço de Entrega
                </h2>
                <form id="address-form" onSubmit={handleAddressSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                     <label className={labelClass}>CEP</label>
                     <input required type="text" placeholder="00000-000" className={inputClass} value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                     <label className={labelClass}>Rua / Avenida</label>
                     <input required type="text" className={inputClass} value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
                  </div>
                  <div>
                     <label className={labelClass}>Número</label>
                     <input required type="text" className={inputClass} value={address.number} onChange={e => setAddress({...address, number: e.target.value})} />
                  </div>
                  <div>
                     <label className={labelClass}>Bairro</label>
                     <input required type="text" className={inputClass} value={address.neighborhood} onChange={e => setAddress({...address, neighborhood: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                     <label className={labelClass}>Complemento / Referência (Opcional)</label>
                     <input type="text" className={inputClass} placeholder="Ex: Apto 101, Próximo ao mercado..." value={address.complement} onChange={e => setAddress({...address, complement: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                     <label className={labelClass}>Cidade</label>
                     <input required type="text" className={inputClass} value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
                  </div>
                </form>
                <div className="mt-8 flex justify-end">
                   <button form="address-form" type="submit" className="bg-christmas-green text-white px-8 py-3 rounded-lg font-bold hover:bg-christmas-dark transition-colors shadow-md">
                     Ir para Pagamento
                   </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <CreditCard className="text-christmas-green" /> Pagamento
                </h2>
                
                <div className="space-y-3">
                   <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 border-christmas-green bg-green-50/50 transition-colors">
                      <input type="radio" name="payment" defaultChecked className="text-christmas-green focus:ring-christmas-green w-5 h-5" />
                      <div className="flex-1">
                        <span className="font-bold text-gray-800 block">Pix (Aprovação Imediata)</span>
                        <span className="text-sm text-gray-500">5% de desconto aplicado no final</span>
                      </div>
                   </label>
                   <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input type="radio" name="payment" className="text-christmas-green focus:ring-christmas-green w-5 h-5" />
                      <div className="flex-1">
                        <span className="font-bold text-gray-800 block">Cartão de Crédito</span>
                        <span className="text-sm text-gray-500">Até 12x sem juros</span>
                      </div>
                   </label>
                </div>

                <div className="mt-8 flex justify-between items-center">
                   <button onClick={() => setStep('address')} className="text-gray-600 hover:text-gray-800 font-medium px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                     Voltar
                   </button>
                   <button onClick={handleFinalize} className="bg-christmas-red text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-lg">
                     Finalizar Pedido
                   </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-display text-xl font-bold text-gray-800 mb-4">Resumo do Pedido</h3>
              <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <img src={item.image} className="w-12 h-12 rounded object-cover border" alt="" />
                    <div className="flex-1">
                      <p className="font-medium line-clamp-2">{item.name}</p>
                      <p className="text-gray-500">{item.quantity}x R$ {item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-700 font-medium">
                  <span className="flex items-center gap-1"><Truck size={14}/> Frete</span>
                  <span>R$ {shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-christmas-dark pt-2 border-t border-gray-100 mt-2">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 bg-gray-50 p-3 rounded-lg text-xs text-gray-500 flex items-start gap-2">
                <ShieldCheck size={16} className="shrink-0 text-christmas-green" />
                <span>Ambiente seguro. Seus dados estão protegidos por criptografia de ponta a ponta.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};