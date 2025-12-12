import React, { useState } from 'react';
import { MessageCircle, X, ChevronRight, Send } from 'lucide-react';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{text: string, isUser: boolean}[]>([
    { text: 'Olá! Bem-vindo à Natal Store. Como posso ajudar você hoje?', isUser: false }
  ]);

  const faq = [
    { q: 'Qual o prazo de entrega?', a: 'O prazo médio é de 3 a 7 dias úteis para Sul e Sudeste, e 7 a 15 dias para demais regiões.' },
    { q: 'Como rastrear meu pedido?', a: 'Assim que seu pedido for despachado, enviaremos o código de rastreio para seu e-mail cadastrado.' },
    { q: 'Formas de pagamento?', a: 'Aceitamos Pix (5% off), Cartão de Crédito em até 12x e Boleto Bancário.' },
  ];

  const handleOptionClick = (question: string, answer: string) => {
    setMessages(prev => [
      ...prev, 
      { text: question, isUser: true },
      { text: answer, isUser: false }
    ]);
  };

  const handleWhatsapp = () => {
     window.open('https://wa.me/5554999999999', '_blank');
  };

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-christmas-green text-white p-4 rounded-full shadow-lg hover:bg-christmas-dark transition-all z-40 hover:scale-110 duration-300 ${isOpen ? 'hidden' : 'flex'}`}
        title="Ajuda e Suporte"
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col border border-gray-200 animate-in slide-in-from-bottom-5 duration-300 overflow-hidden">
          {/* Header */}
          <div className="bg-christmas-green p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <span className="font-bold">Suporte Natal Store</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 h-80 overflow-y-auto bg-gray-50 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.isUser ? 'bg-christmas-green text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none shadow-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Options */}
            <div className="flex flex-col gap-2 mt-4">
              {faq.map((item, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleOptionClick(item.q, item.a)}
                  className="text-left text-sm text-christmas-green bg-white border border-christmas-green/30 hover:bg-green-50 p-2 rounded-lg transition-colors"
                >
                  {item.q}
                </button>
              ))}
              <button 
                onClick={handleWhatsapp}
                className="text-left text-sm text-white bg-green-600 hover:bg-green-700 p-2 rounded-lg transition-colors flex items-center justify-between"
              >
                Falar com Atendente Humano
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Input Area (Mock) */}
          <div className="p-3 border-t border-gray-100 bg-white flex gap-2">
            <input 
              type="text" 
              placeholder="Digite sua mensagem..." 
              className="flex-1 text-sm border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:border-christmas-green"
            />
            <button className="bg-christmas-green text-white p-2 rounded-full hover:bg-christmas-dark">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};