import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Phone, Lock, Calendar, Check, MessageCircle, Shield, AlertTriangle, Eye, EyeOff, Send } from 'lucide-react';
import { authService } from '../auth';
import { User as UserType } from '../types';

interface RegisterPageProps {
  onBack: () => void;
  onRegisterSuccess: (user: UserType) => void;
}

type RegistrationStep = 'details' | 'verification';

export const RegisterPage: React.FC<RegisterPageProps> = ({ onBack, onRegisterSuccess }) => {
  const [step, setStep] = useState<RegistrationStep>('details');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    phone: '',
    isWhatsapp: true,
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
    marketingAccepted: false,
    marketingChannel: 'email' as 'email' | 'whatsapp'
  });

  // Verification State
  const [phoneOtp, setPhoneOtp] = useState('');
  const [emailOtp, setEmailOtp] = useState('');

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const ADMIN_UNLOCK_EMAIL = "snttbstt@01";

  // Real-time Validation
  useEffect(() => {
    validatePassword(formData.password);
  }, [formData.password]);

  const validatePassword = (pass: string) => {
    let score = 0;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    setPasswordStrength(score);
  };

  const validateDetails = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.includes(' ')) newErrors.fullName = "Digite seu nome completo";
    
    // Validação de Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Digite um e-mail válido (ex: nome@dominio.com).";
    }

    // Validação de Telefone (considerando apenas dígitos para contagem)
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
       newErrors.phone = "Digite um telefone válido com DDD (10 ou 11 dígitos).";
    }

    // Strict Password Rules
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
    if (!strongPasswordRegex.test(formData.password)) {
      newErrors.password = "A senha deve ter no mínimo 12 caracteres, incluindo maiúsculas, minúsculas, números e símbolos.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem.";
    }

    if (!formData.termsAccepted) {
      newErrors.terms = "Você deve aceitar os termos.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtps = () => {
    if (validateDetails()) {
      // Simulate Backend API Call
      setStep('verification');
      // Demo OTP
      alert(`[SIMULAÇÃO] Códigos de Verificação:\nSMS: 123456\nEmail: 654321`);
    }
  };

  const handleVerifyAndRegister = async () => {
    // Simulate OTP Validation
    if (phoneOtp === '123456' && emailOtp === '654321') {
      setIsLoading(true);
      try {
        const user = await authService.register({
          ...formData
        });
        
        alert(user.role === 'ADMIN' ? 'Conta ADMINISTRATIVA ativada com sucesso!' : 'Conta criada com sucesso!');
        onRegisterSuccess(user);
      } catch (err: any) {
        setErrors({ ...errors, verification: err.message || "Erro ao criar conta." });
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors({ ...errors, verification: "Códigos de verificação inválidos." });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            <span className="font-medium hidden sm:inline">Voltar</span>
          </button>
          <span className="text-gray-400 text-sm hidden sm:inline">|</span>
          <span className="text-christmas-green font-display font-bold text-xl">
            {step === 'details' ? 'Criar Conta Segura' : 'Verificação de Identidade'}
          </span>
        </div>
      </div>

      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          
          {step === 'details' && (
            <div className="animate-in slide-in-from-right duration-300">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-christmas-green/10 rounded-full mb-4 text-christmas-green">
                  <Shield size={32} />
                </div>
                <h1 className="font-display text-3xl font-bold text-christmas-green mb-2">Cadastro Seguro</h1>
                <p className="text-gray-600">Seus dados são criptografados e armazenados com segurança.</p>
              </div>

              <div className="space-y-6">
                {/* Personal Info */}
                <div className="space-y-4">
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">Dados Pessoais</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-christmas-dark mb-1">Nome Completo</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-christmas-green/30'} bg-white text-christmas-dark placeholder-christmas-green/40 focus:ring-2 focus:ring-christmas-green outline-none`}
                        placeholder="Nome civil completo"
                      />
                      {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-christmas-dark mb-1">Data de Nascimento</label>
                      <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-christmas-green/30 bg-white text-christmas-dark placeholder-christmas-green/40 focus:ring-2 focus:ring-christmas-green outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-christmas-dark mb-1">Celular</label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="(00) 00000-0000"
                          className={`w-full px-4 py-2.5 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-christmas-green/30'} bg-white text-christmas-dark placeholder-christmas-green/40 focus:ring-2 focus:ring-christmas-green outline-none`}
                        />
                        {formData.isWhatsapp && (
                          <MessageCircle size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                        )}
                      </div>
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isWhatsapp"
                          name="isWhatsapp"
                          checked={formData.isWhatsapp}
                          onChange={handleChange}
                          className="rounded text-green-600 focus:ring-green-600 border-gray-300"
                        />
                        <label htmlFor="isWhatsapp" className="text-sm text-gray-600 cursor-pointer">Possui WhatsApp</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Login Info */}
                <div className="space-y-4 pt-4">
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">Segurança da Conta</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-christmas-dark mb-1">E-mail de Login</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-christmas-green/30'} bg-white text-christmas-dark placeholder-christmas-green/40 focus:ring-2 focus:ring-christmas-green outline-none`}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    {formData.email === ADMIN_UNLOCK_EMAIL && (
                      <div className="mt-1 text-xs text-amber-600 flex items-center gap-1">
                        <Shield size={10} />
                        Detectada credencial administrativa. Verificação adicional será exigida.
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-christmas-dark mb-1">Nome de Usuário</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-christmas-green/30 bg-white text-christmas-dark placeholder-christmas-green/40 focus:ring-2 focus:ring-christmas-green outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-christmas-dark mb-1">Senha Forte</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full px-4 py-2.5 rounded-lg border ${errors.password ? 'border-red-500' : 'border-christmas-green/30'} bg-white text-christmas-dark placeholder-christmas-green/40 focus:ring-2 focus:ring-christmas-green outline-none`}
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      
                      {/* Strength Indicator */}
                      <div className="mt-2 flex gap-1 h-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div 
                            key={level} 
                            className={`flex-1 rounded-full transition-colors ${
                              passwordStrength >= level 
                                ? (passwordStrength < 3 ? 'bg-red-500' : passwordStrength < 5 ? 'bg-yellow-500' : 'bg-green-500') 
                                : 'bg-gray-200'
                            }`} 
                          />
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1">
                        Mínimo 12 caracteres, maiúsculas, minúsculas, números e símbolos.
                      </p>
                      {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-christmas-dark mb-1">Confirmar Senha</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-christmas-green/30'} bg-white text-christmas-dark placeholder-christmas-green/40 focus:ring-2 focus:ring-christmas-green outline-none`}
                      />
                      {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>

                {/* Terms and Consent */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-100 mt-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                      className="mt-1 rounded text-christmas-green focus:ring-christmas-green border-gray-300"
                    />
                    <span className="text-sm text-gray-600">
                      Aceito os <a href="#" className="text-christmas-green font-bold hover:underline">Termos de Uso</a> e a <a href="#" className="text-christmas-green font-bold hover:underline">Política de Responsabilidade de Dados</a>.
                    </span>
                  </label>
                  {errors.terms && <p className="text-xs text-red-500 pl-7">{errors.terms}</p>}

                  <div className="border-t border-gray-200 pt-3">
                    <label className="flex items-start gap-3 cursor-pointer mb-2">
                      <input
                        type="checkbox"
                        name="marketingAccepted"
                        checked={formData.marketingAccepted}
                        onChange={handleChange}
                        className="mt-1 rounded text-christmas-green focus:ring-christmas-green border-gray-300"
                      />
                      <span className="text-sm text-gray-600">
                        Desejo receber atualizações e alertas de segurança.
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleSendOtps}
                  className="w-full bg-christmas-green hover:bg-christmas-dark text-white font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-8"
                >
                  <Send size={20} />
                  Continuar para Verificação
                </button>
              </div>
            </div>
          )}

          {step === 'verification' && (
            <div className="animate-in slide-in-from-right duration-300 text-center">
              <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-4 text-blue-600">
                <Shield size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Verificação em Duas Etapas</h2>
              <p className="text-gray-500 mb-8 text-sm">
                Para sua segurança, enviamos códigos de confirmação para seus contatos cadastrados.
              </p>

              <div className="space-y-6 text-left max-w-sm mx-auto">
                <div>
                  <label className="block text-sm font-medium text-christmas-dark mb-1">
                    Código SMS enviado para {formData.phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')}
                  </label>
                  <input
                    type="text"
                    value={phoneOtp}
                    onChange={(e) => setPhoneOtp(e.target.value)}
                    maxLength={6}
                    placeholder="000000"
                    className="w-full text-center tracking-[1em] font-mono text-xl px-4 py-3 rounded-lg border border-christmas-green/30 bg-white text-christmas-dark placeholder-christmas-green/40 focus:ring-2 focus:ring-christmas-green outline-none uppercase"
                  />
                </div>

                <div className="relative">
                   <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 bg-white text-sm text-gray-500">E</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-christmas-dark mb-1">
                    Código E-mail enviado para {formData.email}
                  </label>
                  <input
                    type="text"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value)}
                    maxLength={6}
                    placeholder="000000"
                    className="w-full text-center tracking-[1em] font-mono text-xl px-4 py-3 rounded-lg border border-christmas-green/30 bg-white text-christmas-dark placeholder-christmas-green/40 focus:ring-2 focus:ring-christmas-green outline-none uppercase"
                  />
                </div>

                {errors.verification && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                    <AlertTriangle size={16} />
                    {errors.verification}
                  </div>
                )}

                <button
                  onClick={handleVerifyAndRegister}
                  disabled={isLoading}
                  className="w-full bg-christmas-green hover:bg-christmas-dark text-white font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
                >
                  {isLoading ? 'Verificando...' : <><Check size={20} /> Confirmar e Criar Conta</>}
                </button>

                <button 
                  onClick={() => setStep('details')}
                  className="w-full text-gray-500 hover:text-gray-700 text-sm mt-4 underline"
                >
                  Voltar e corrigir dados
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};