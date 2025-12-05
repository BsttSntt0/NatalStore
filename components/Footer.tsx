import React from 'react';
import { Mail, MapPin, Phone, CreditCard, Banknote, QrCode } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-christmas-dark text-white pt-16 pb-8 border-t-4 border-christmas-gold">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* About */}
          <div id="sobre">
            <h3 className="font-display text-3xl mb-4 text-christmas-gold">Quem Somos</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              A <strong className="text-white">Natal Store</strong> nasceu da paixão por transformar lares em cenários mágicos. 
              Nossa missão é levar o espírito natalino para cada família através de produtos de alta qualidade e um atendimento acolhedor.
            </p>
            <p className="text-gray-300">
              Valores: Tradição, Qualidade e Encantamento.
            </p>
          </div>

          {/* Contact */}
          <div id="contato">
            <h3 className="font-display text-3xl mb-4 text-christmas-gold">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-300">
                <MapPin className="mt-1 text-christmas-red shrink-0" />
                <span>Rua do Papai Noel, 123 - Centro<br />Gramado, RS - CEP 95670-000</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Phone className="text-christmas-red shrink-0" />
                <span>(54) 3286-0000 / (54) 99999-9999 (WhatsApp)</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Mail className="text-christmas-red shrink-0" />
                <span>contato@natalstore.com.br</span>
              </li>
            </ul>
          </div>

          {/* Payment */}
          <div>
            <h3 className="font-display text-3xl mb-4 text-christmas-gold">Formas de Pagamento</h3>
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center p-3 bg-white/5 rounded-lg border border-white/10 hover:border-christmas-gold transition-colors">
                  <QrCode className="mb-2 text-christmas-gold h-8 w-8" />
                  <span className="text-sm font-medium">Pix</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-white/5 rounded-lg border border-white/10 hover:border-christmas-gold transition-colors">
                  <CreditCard className="mb-2 text-christmas-gold h-8 w-8" />
                  <span className="text-sm font-medium">Cartão</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-white/5 rounded-lg border border-white/10 hover:border-christmas-gold transition-colors col-span-2">
                  <Banknote className="mb-2 text-christmas-gold h-8 w-8" />
                  <span className="text-sm font-medium">Boleto Bancário</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Natal Store. Todos os direitos reservados. Feito com espírito natalino.</p>
        </div>
      </div>
    </footer>
  );
};