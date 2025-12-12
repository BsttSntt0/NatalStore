import React, { useState } from 'react';
import { Save, QrCode, CreditCard, Landmark, ArrowLeft, Shield, AlertCircle } from 'lucide-react';

interface PaymentSettingsProps {
  onBack: () => void;
}

export const PaymentSettings: React.FC<PaymentSettingsProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    pixKey: '',
    pixHolder: '',
    bankName: '',
    agency: '',
    accountNumber: '',
    accountType: 'corrente',
    creditProvider: '',
    merchantId: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaved, setIsSaved] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Validação Chave Pix (Se preenchido)
    if (formData.pixKey) {
      const value = formData.pixKey.trim();
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
      const digitsOnly = value.replace(/\D/g, '');
      const isCpfCnpj = digitsOnly.length === 11 || digitsOnly.length === 14;
      const isPhone = digitsOnly.length >= 10 && digitsOnly.length <= 11;

      // Se não der match em nenhum formato comum e tiver caracteres especiais de formatação ou tamanho errado
      if (!isEmail && !isUUID && !isCpfCnpj && !isPhone) {
        newErrors.pixKey = "Formato inválido. Use E-mail, CPF/CNPJ, Telefone ou Chave Aleatória.";
      }
    }

    // Validação Numérica para Agência (permite hífen)
    if (formData.agency && !/^\d+(-\d+)?$/.test(formData.agency)) {
      newErrors.agency = "Apenas números (hífen opcional).";
    }

    // Validação Numérica para Conta (permite hífen)
    if (formData.accountNumber && !/^\d+(-\d+)?$/.test(formData.accountNumber)) {
      newErrors.accountNumber = "Apenas números (hífen opcional).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpa erro ao digitar
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    setIsSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      // Simulate API save
      console.log('Saving payment settings:', formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen animate-in fade-in duration-300">
      {/* Admin Header */}
      <div className="bg-christmas-dark text-white shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-christmas-gold" />
              <span className="font-display text-xl font-bold">Área Administrativa</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-christmas-green mb-2">Configuração de Pagamento</h1>
            <p className="text-gray-600">Vincule as contas para recebimento de vendas via Pix, Débito e Crédito.</p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Pix Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="bg-christmas-green/10 p-2 rounded-lg text-christmas-green">
                  <QrCode size={20} />
                </div>
                <h2 className="font-bold text-gray-800">Chave Pix</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-christmas-dark mb-2">Tipo de Chave / Chave Pix</label>
                  <input
                    type="text"
                    name="pixKey"
                    value={formData.pixKey}
                    onChange={handleChange}
                    placeholder="CPF, Email, Telefone ou Aleatória"
                    className={`w-full px-4 py-2 rounded-lg border ${errors.pixKey ? 'border-red-500 focus:ring-red-200' : 'border-christmas-green/30 focus:ring-christmas-green'} bg-white text-christmas-dark placeholder-christmas-green/40 focus:ring-2 focus:border-transparent outline-none transition-all`}
                  />
                  {errors.pixKey && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
                      <AlertCircle size={12} />
                      <span>{errors.pixKey}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-christmas-dark mb-2">Nome do Titular</label>
                  <input
                    type="text"
                    name="pixHolder"
                    value={formData.pixHolder}
                    onChange={handleChange}
                    placeholder="Nome completo ou Razão Social"
                    className="w-full px-4 py-2 rounded-lg border border-christmas-green/30 bg-white text-christmas-dark placeholder-christmas-green/40 focus:ring-2 focus:ring-christmas-green focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Bank Account Section (Debit Link) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="bg-christmas-green/10 p-2 rounded-lg text-christmas-green">
                  <Landmark size={20} />
                </div>
                <h2 className="font-bold text-gray-800">Conta Bancária (Recebimento Débito)</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-christmas-dark mb-2">Instituição Financeira</label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="Ex: Banco do Brasil, Nubank, Itaú..."
                    className="w-full px-4 py-2 rounded-lg border border-christmas-green/30 bg-white text-christmas-dark placeholder-christmas-green/40 focus:ring-2 focus:ring-christmas-green focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-christmas-dark mb-2">Agência</label>
                  <input
                    type="text"
                    name="agency"
                    value={formData.agency}
                    onChange={handleChange}
                    placeholder="0000"
                    className={`w-full px-4 py-2 rounded-lg border ${errors.agency ? 'border-red-500 focus:ring-red-200' : 'border-christmas-green/30 focus:ring-christmas-green'} bg-white text-christmas-dark placeholder-christmas-green/40 focus:ring-2 focus:border-transparent outline-none transition-all`}
                  />
                  {errors.agency && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
                      <AlertCircle size={12} />
                      <span>{errors.agency}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-christmas-dark mb-2">Número da Conta</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    placeholder="00000-0"
                    className={`w-full px-4 py-2 rounded-lg border ${errors.accountNumber ? 'border-red-500 focus:ring-red-200' : 'border-christmas-green/30 focus:ring-christmas-green'} bg-white text-christmas-dark placeholder-christmas-green/40 focus:ring-2 focus:border-transparent outline-none transition-all`}
                  />
                  {errors.accountNumber && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
                      <AlertCircle size={12} />
                      <span>{errors.accountNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Credit Provider Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="bg-christmas-green/10 p-2 rounded-lg text-christmas-green">
                  <CreditCard size={20} />
                </div>
                <h2 className="font-bold text-gray-800">Processamento de Crédito</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-christmas-dark mb-2">Provedor / Adquirente</label>
                  <input
                    type="text"
                    name="creditProvider"
                    value={formData.creditProvider}
                    onChange={handleChange}
                    placeholder="Ex: Cielo, Rede, Stone, Stripe"
                    className="w-full px-4 py-2 rounded-lg border border-christmas-green/30 bg-white text-christmas-dark placeholder-christmas-green/40 focus:ring-2 focus:ring-christmas-green focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-christmas-dark mb-2">ID do Estabelecimento / Chave de API</label>
                  <input
                    type="text"
                    name="merchantId"
                    value={formData.merchantId}
                    onChange={handleChange}
                    placeholder="Identificador da conta"
                    className="w-full px-4 py-2 rounded-lg border border-christmas-green/30 bg-white text-christmas-dark placeholder-christmas-green/40 focus:ring-2 focus:ring-christmas-green focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end pt-4">
              <button
                type="submit"
                className="bg-christmas-green hover:bg-christmas-dark text-white px-8 py-3 rounded-lg font-bold shadow-lg transition-all flex items-center gap-2"
              >
                <Save size={20} />
                Salvar Configurações
              </button>
            </div>

            {isSaved && (
              <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-center animate-in fade-in slide-in-from-bottom-2">
                Configurações de pagamento salvas com sucesso!
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
};