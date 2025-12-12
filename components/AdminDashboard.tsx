import React, { useState, useEffect, useRef } from 'react';
import { Shield, Users, ShoppingBag, Package, Tag, Rocket, LogOut, Search, Printer, Edit, Trash2, Eye, Plus, Check, X, Calendar, Percent, Upload, Image as ImageIcon } from 'lucide-react';
import { User, Order, Product, Promotion, Category } from '../types';
import { CATEGORIES } from '../constants';

interface AdminDashboardProps {
  onLogout: () => void;
  users: User[];
  orders: Order[];
  products: Product[];
  promotions: Promotion[];
  onUpdateProduct: (p: Product) => void;
  onAddProduct: (p: Product) => void;
  onDeleteProduct: (id: number) => void;
  onUpdateUser: (u: User) => void;
  onUpdateOrder: (o: Order) => void;
  onAddPromotion: (p: Promotion) => void;
  onDeletePromotion: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onLogout, users, orders, products, promotions, 
  onUpdateProduct, onAddProduct, onDeleteProduct, 
  onUpdateUser, onUpdateOrder, onAddPromotion, onDeletePromotion 
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'orders' | 'products' | 'promotions' | 'dev'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals / Edit States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const [selectedPromoProducts, setSelectedPromoProducts] = useState<number[]>([]);
  
  // New Product Form State
  const [productImages, setProductImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [customCategory, setCustomCategory] = useState('');
  const [formError, setFormError] = useState('');

  // -- HELPERS --
  const inputClass = "w-full px-4 py-2.5 rounded-lg border border-christmas-green/30 bg-white text-christmas-dark placeholder-christmas-green/40 focus:ring-2 focus:ring-christmas-green focus:border-transparent outline-none transition-all shadow-sm";
  const labelClass = "block text-sm font-bold text-christmas-dark mb-1.5";

  // Reset form when modal opens
  useEffect(() => {
    if (isProductModalOpen) {
      setFormError('');
      setImageUrlInput('');
      
      if (editingProduct) {
        setProductImages(editingProduct.images && editingProduct.images.length > 0 ? editingProduct.images : (editingProduct.image ? [editingProduct.image] : []));
        
        const isStandardCategory = CATEGORIES.includes(editingProduct.category);
        if (isStandardCategory) {
          setSelectedCategory(editingProduct.category);
          setCustomCategory('');
        } else {
          setSelectedCategory('custom');
          setCustomCategory(editingProduct.category);
        }
      } else {
        setProductImages([]);
        setSelectedCategory(CATEGORIES.filter(c => c !== 'Todas')[0] || 'Árvores');
        setCustomCategory('');
      }
    }
  }, [isProductModalOpen, editingProduct]);

  const generateInvoiceHTML = (order: Order) => {
    // ... (same as before) ...
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html>
      <head>
        <title>Nota Fiscal - Pedido #${order.id}</title>
        <style>
          body { font-family: 'Courier New', Courier, monospace; padding: 20px; color: #333; }
          .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .title { font-weight: bold; font-size: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          .total { font-weight: bold; text-align: right; margin-top: 20px; font-size: 18px; }
          .footer { margin-top: 50px; font-size: 12px; text-align: center; border-top: 1px solid #ccc; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="row">
            <span class="title">NATAL STORE LTDA</span>
            <span>CNPJ: 00.000.000/0001-00</span>
          </div>
          <div class="row">
            <span>Rua do Papai Noel, 123 - Gramado, RS</span>
            <span>Danfe Simplificado</span>
          </div>
        </div>

        <div class="row">
          <strong>DESTINATÁRIO</strong>
        </div>
        <div>${order.userName}</div>
        <div>${order.userEmail}</div>
        <div>${order.shippingAddress}</div>

        <table style="margin-bottom: 20px;">
          <tr>
            <th>PEDIDO</th>
            <th>EMISSÃO</th>
            <th>MÉTODO PGTO</th>
          </tr>
          <tr>
            <td>${order.id}</td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>${order.paymentMethod}</td>
          </tr>
        </table>

        <table>
          <thead>
            <tr>
              <th>PRODUTO</th>
              <th>QTD</th>
              <th>UNIT (R$)</th>
              <th>TOTAL (R$)</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total">
          TOTAL A PAGAR: R$ ${order.total.toFixed(2)}
        </div>

        <div class="footer">
          Documento Auxiliar da Nota Fiscal Eletrônica - Não possui valor fiscal para fins de tributação neste ambiente de demonstração.
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      const allowedFiles = files.filter(f => f.type.startsWith('image/'));
      
      const newImages = await Promise.all(allowedFiles.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      }));
      
      setProductImages(prev => [...prev, ...newImages]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newImages = await Promise.all(files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      }));
      setProductImages(prev => [...prev, ...newImages]);
    }
  };

  const addImageUrl = () => {
    if (imageUrlInput.trim()) {
      setProductImages(prev => [...prev, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const removeImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (productImages.length < 3) {
      setFormError('Por favor, adicione pelo menos 3 imagens do produto para garantir uma boa apresentação na loja.');
      return;
    }

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const finalCategory = selectedCategory === 'custom' ? customCategory : selectedCategory;
    
    if (!finalCategory) {
      setFormError('Selecione ou crie uma categoria.');
      return;
    }

    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name: formData.get('name') as string,
      price: parseFloat(formData.get('price') as string),
      oldPrice: formData.get('oldPrice') ? parseFloat(formData.get('oldPrice') as string) : undefined,
      category: finalCategory,
      stock: parseInt(formData.get('stock') as string),
      isActive: formData.get('isActive') === 'on',
      description: formData.get('description') as string,
      image: productImages[0], // First image is cover
      images: productImages,
      rating: editingProduct?.rating || 0,
      reviews: editingProduct?.reviews || [],
      specifications: (formData.get('specifications') as string).split('\n').filter(s => s.trim())
    };

    if (editingProduct) {
      onUpdateProduct(newProduct);
    } else {
      onAddProduct(newProduct);
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handlePromotionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const newPromo: Promotion = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      discountPercentage: Number(formData.get('discount')),
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      active: true,
      productIds: selectedPromoProducts
    };

    onAddPromotion(newPromo);
    setIsPromotionModalOpen(false);
    setSelectedPromoProducts([]);
  };

  const togglePromoProduct = (id: number) => {
    setSelectedPromoProducts(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans text-gray-800">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-christmas-dark text-white flex flex-col shrink-0">
        <div className="h-16 flex items-center gap-3 px-6 bg-black/20">
          <Shield className="text-christmas-red" size={24} />
          <span className="font-bold tracking-wider">ADMIN PAINEL</span>
        </div>

        <nav className="flex-1 py-6 space-y-1">
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${activeTab === 'users' ? 'bg-christmas-red text-white' : 'hover:bg-white/10 text-gray-300'}`}>
            <Users size={20} /> Usuários
          </button>
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${activeTab === 'orders' ? 'bg-christmas-red text-white' : 'hover:bg-white/10 text-gray-300'}`}>
            <ShoppingBag size={20} /> Pedidos
          </button>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${activeTab === 'products' ? 'bg-christmas-red text-white' : 'hover:bg-white/10 text-gray-300'}`}>
            <Package size={20} /> Produtos & Estoque
          </button>
          <button onClick={() => setActiveTab('promotions')} className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${activeTab === 'promotions' ? 'bg-christmas-red text-white' : 'hover:bg-white/10 text-gray-300'}`}>
            <Tag size={20} /> Promoções
          </button>
          <button onClick={() => setActiveTab('dev')} className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${activeTab === 'dev' ? 'bg-christmas-red text-white' : 'hover:bg-white/10 text-gray-300'}`}>
            <Rocket size={20} /> Desenv. Futuro
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={onLogout} className="w-full flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <LogOut size={16} /> Sair do Painel
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-2xl font-bold text-christmas-dark uppercase">
            {activeTab === 'users' && 'Gestão de Usuários'}
            {activeTab === 'orders' && 'Controle de Pedidos'}
            {activeTab === 'products' && 'Catálogo e Estoque'}
            {activeTab === 'promotions' && 'Campanhas Promocionais'}
            {activeTab === 'dev' && 'Roteiro de Desenvolvimento'}
          </h1>
          <div className="flex items-center gap-4">
             <div className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-bold">
               Sessão Segura Ativa
             </div>
             <div className="w-8 h-8 bg-christmas-green rounded-full flex items-center justify-center text-white font-bold">
               A
             </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* ... existing users table ... */}
              <div className="flex justify-between items-center">
                <div className="relative w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Buscar por nome ou email..." 
                    className={inputClass}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-600 font-semibold text-sm border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4">Nome</th>
                      <th className="px-6 py-4">Email / Contato</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500 font-mono">{user.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div>{user.email}</div>
                          <div className="text-xs text-gray-500">{user.phone || '-'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {user.status || 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                           <button 
                            onClick={() => {
                                const newStatus = user.status === 'Active' ? 'Locked' : 'Active';
                                onUpdateUser({...user, status: newStatus});
                            }}
                            className="text-xs border border-gray-300 px-3 py-1 rounded hover:bg-gray-100"
                           >
                             {user.status === 'Active' ? 'Bloquear' : 'Desbloquear'}
                           </button>
                           <button 
                            onClick={() => alert(`Email de redefinição de senha enviado para ${user.email}`)}
                            className="text-xs border border-gray-300 px-3 py-1 rounded hover:bg-gray-100"
                           >
                             Resetar Senha
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* ... existing orders table ... */}
               <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-600 font-semibold text-sm border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4">Pedido #</th>
                      <th className="px-6 py-4">Cliente</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Data</th>
                      <th className="px-6 py-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono text-sm font-bold">{order.id}</td>
                        <td className="px-6 py-4">
                          <div className="font-bold">{order.userName}</div>
                          <div className="text-xs text-gray-500">{order.items.length} itens</div>
                        </td>
                        <td className="px-6 py-4 font-bold text-christmas-green">
                          R$ {order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <select 
                            value={order.status}
                            onChange={(e) => onUpdateOrder({...order, status: e.target.value as any})}
                            className="text-xs bg-white border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="Pendente">Pendente</option>
                            <option value="Pago">Pago</option>
                            <option value="Enviado">Enviado</option>
                            <option value="Entregue">Entregue</option>
                            <option value="Cancelado">Cancelado</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                           <button 
                            onClick={() => generateInvoiceHTML(order)}
                            className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 px-3 py-1 rounded text-gray-700"
                           >
                             <Printer size={12} />
                             NF-e
                           </button>
                           <button className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 px-3 py-1 rounded text-gray-700">
                             <Eye size={12} />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                 <div className="relative w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Buscar produtos..." 
                    className={inputClass}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
                  className="bg-christmas-green text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-christmas-dark shadow-md"
                >
                  <Plus size={20} />
                  Novo Produto
                </button>
              </div>

              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-600 font-semibold text-sm border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4">Produto</th>
                      <th className="px-6 py-4">Categoria</th>
                      <th className="px-6 py-4">Preço</th>
                      <th className="px-6 py-4">Estoque</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map(product => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img src={product.image} className="w-10 h-10 rounded object-cover border border-gray-200" alt="" />
                          <span className="font-medium text-sm line-clamp-1">{product.name}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                        <td className="px-6 py-4 font-bold text-gray-700">R$ {product.price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm">{product.stock} un</td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => onUpdateProduct({...product, isActive: !product.isActive})}
                            className={`w-10 h-6 rounded-full p-1 transition-colors ${product.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                          >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${product.isActive ? 'translate-x-4' : ''}`} />
                          </button>
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                           <button 
                            onClick={() => { setEditingProduct(product); setIsProductModalOpen(true); }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                           >
                             <Edit size={16} />
                           </button>
                           <button 
                             onClick={() => { if(window.confirm('Excluir produto?')) onDeleteProduct(product.id) }}
                             className="p-2 text-red-600 hover:bg-red-50 rounded"
                            >
                             <Trash2 size={16} />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PROMOTIONS TAB */}
          {activeTab === 'promotions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-christmas-dark">Campanhas Ativas</h2>
                <button 
                  onClick={() => setIsPromotionModalOpen(true)}
                  className="bg-christmas-green text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-christmas-dark shadow-md"
                >
                  <Plus size={20} />
                  Nova Campanha
                </button>
              </div>

              {promotions.length === 0 ? (
                <div className="bg-white p-12 rounded-lg border border-dashed border-gray-300 text-center text-gray-400">
                  <Tag size={48} className="mx-auto mb-4 opacity-50 text-christmas-green" />
                  <p className="text-lg font-medium text-gray-600">Nenhuma campanha ativa</p>
                  <p className="text-sm">Clique em "Nova Campanha" para criar ofertas especiais.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {promotions.map(promo => (
                    <div key={promo.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative group overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-christmas-red"></div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{promo.title}</h3>
                          <p className="text-xs text-gray-500">
                             {new Date(promo.startDate).toLocaleDateString()} até {new Date(promo.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Percent size={12} />
                          {promo.discountPercentage}% OFF
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2 font-semibold">Produtos na oferta:</p>
                        <div className="flex flex-wrap gap-2">
                           {products.filter(p => promo.productIds.includes(p.id)).slice(0, 3).map(p => (
                             <span key={p.id} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 border border-gray-200 truncate max-w-[150px]">
                               {p.name}
                             </span>
                           ))}
                           {promo.productIds.length > 3 && (
                             <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 border border-gray-200">
                               +{promo.productIds.length - 3}
                             </span>
                           )}
                        </div>
                      </div>

                      <button 
                        onClick={() => onDeletePromotion(promo.id)}
                        className="text-red-500 text-xs hover:underline flex items-center gap-1"
                      >
                        <Trash2 size={12} /> Excluir Campanha
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

           {/* FUTURE DEV TAB */}
           {activeTab === 'dev' && (
            <div className="space-y-6">
              {/* ... existing dev content ... */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white shadow-lg">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Rocket />
                  Roadmap de Desenvolvimento
                </h2>
                <p className="mb-6 opacity-90">Anote aqui ideias para módulos futuros ou tarefas técnicas pendentes.</p>
                
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Integração Real com Gateway de Pagamento (Stripe/Pagar.me)</li>
                    <li>Sistema de Cálculo de Frete via API Correios</li>
                    <li>Dashboard Analítico (Gráficos de Vendas)</li>
                    <li>App Mobile (React Native)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h3 className="font-bold text-gray-800 mb-4">Notas do Desenvolvedor</h3>
                <textarea className={inputClass.replace('py-2.5', 'h-40 p-4')} placeholder="Digite suas anotações aqui..."></textarea>
                <div className="mt-4 flex justify-end">
                   <button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black transition-colors">Salvar Notas</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsProductModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-2xl font-display font-bold text-christmas-green">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h3>
              <button onClick={() => setIsProductModalOpen(false)}><X className="text-gray-400 hover:text-gray-600" /></button>
            </div>
            
            <form onSubmit={handleProductSubmit} className="p-6 space-y-5">
              {formError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 flex items-center gap-2 animate-in slide-in-from-top-2">
                   <Tag size={16} /> {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className={labelClass}>Nome do Produto</label>
                  <input name="name" defaultValue={editingProduct?.name} required className={inputClass} placeholder="Ex: Árvore de Natal 1.80m" />
                </div>
                <div>
                  <label className={labelClass}>Preço (R$)</label>
                  <input name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required className={inputClass} placeholder="0,00" />
                </div>
                <div>
                  <label className={labelClass}>Estoque</label>
                  <input name="stock" type="number" defaultValue={editingProduct?.stock || 100} className={inputClass} />
                </div>
                
                <div className="col-span-2">
                  <label className={labelClass}>Categoria</label>
                  <select 
                    className={inputClass} 
                    value={selectedCategory} 
                    onChange={e => setSelectedCategory(e.target.value)}
                  >
                    {CATEGORIES.filter(c => c !== 'Todas').map(c => <option key={c} value={c}>{c}</option>)}
                    <option value="custom">+ Nova Categoria...</option>
                  </select>
                  {selectedCategory === 'custom' && (
                    <input 
                      type="text" 
                      placeholder="Digite o nome da nova categoria" 
                      className={`${inputClass} mt-2 animate-in slide-in-from-top-1`}
                      value={customCategory}
                      onChange={e => setCustomCategory(e.target.value)}
                      required
                    />
                  )}
                </div>

                {/* Images Upload Section */}
                <div className="col-span-2 space-y-2">
                  <label className={labelClass}>Imagens do Produto (Mínimo 3)</label>
                  
                  {/* Drag Drop Area */}
                  <div 
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${isDragActive ? 'border-christmas-green bg-christmas-green/5' : 'border-gray-300 hover:border-christmas-green/50'}`}
                    onDragEnter={() => setIsDragActive(true)}
                    onDragLeave={() => setIsDragActive(false)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                  >
                     <div className="flex flex-col items-center gap-2 text-gray-500">
                        <Upload size={32} className="text-gray-400" />
                        <p className="text-sm">Arraste e solte suas fotos aqui</p>
                        <span className="text-xs">- OU -</span>
                        <label className="cursor-pointer bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700 shadow-sm transition-all">
                           Selecionar Arquivos
                           <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileInput} />
                        </label>
                     </div>
                  </div>

                  {/* URL Fallback */}
                  <div className="mt-3 flex gap-2">
                     <input 
                       type="text" 
                       placeholder="Ou cole uma URL de imagem..." 
                       className={inputClass}
                       value={imageUrlInput}
                       onChange={e => setImageUrlInput(e.target.value)}
                       onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); addImageUrl(); }}}
                     />
                     <button type="button" onClick={addImageUrl} className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg px-4 text-gray-700">
                        <Plus size={20} />
                     </button>
                  </div>

                  {/* Previews */}
                  {productImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mt-4">
                       {productImages.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group bg-gray-50">
                             <img src={img} className="w-full h-full object-cover" alt={`Preview ${idx}`} />
                             <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110">
                                <X size={12} />
                             </button>
                             {idx === 0 && <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5">Capa</span>}
                          </div>
                       ))}
                    </div>
                  )}
                  <p className={`text-xs text-right mt-1 ${productImages.length < 3 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                    {productImages.length} de 3 fotos necessárias
                  </p>
                </div>

                <div className="col-span-2">
                  <label className={labelClass}>Descrição</label>
                  <textarea name="description" rows={3} defaultValue={editingProduct?.description} className={inputClass} placeholder="Descreva o produto..." />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Especificações (uma por linha)</label>
                  <textarea name="specifications" rows={3} defaultValue={editingProduct?.specifications.join('\n')} className={inputClass} placeholder="Altura: 1.5m&#10;Material: PVC" />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" name="isActive" id="isActive" defaultChecked={editingProduct?.isActive ?? true} className="w-5 h-5 rounded text-christmas-green focus:ring-christmas-green border-gray-300" />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Produto Ativo na Loja</label>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-4">
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-2.5 bg-christmas-green text-white rounded-lg hover:bg-christmas-dark font-bold shadow-md transition-colors">Salvar Produto</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROMOTION MODAL */}
      {isPromotionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsPromotionModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-display font-bold text-christmas-dark">Nova Campanha Promocional</h3>
              <button onClick={() => setIsPromotionModalOpen(false)}><X className="text-gray-400 hover:text-gray-600" /></button>
            </div>
            
            <form onSubmit={handlePromotionSubmit} className="p-6 space-y-5">
              <div>
                <label className={labelClass}>Título da Campanha</label>
                <input name="title" required className={inputClass} placeholder="Ex: Natal Antecipado, Black Friday..." />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                   <label className={labelClass}>Desconto (%)</label>
                   <input name="discount" type="number" min="1" max="100" required className={inputClass} placeholder="Ex: 20" />
                </div>
                <div>
                   <label className={labelClass}>Início</label>
                   <input name="startDate" type="date" required className={inputClass} />
                </div>
                 <div>
                   <label className={labelClass}>Fim</label>
                   <input name="endDate" type="date" required className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Selecione os Produtos</label>
                <div className="border border-christmas-green/20 rounded-lg max-h-60 overflow-y-auto p-2 bg-gray-50">
                  {products.map(product => (
                    <label key={product.id} className="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer transition-colors border-b border-transparent hover:border-gray-100 last:border-0">
                      <input 
                        type="checkbox" 
                        checked={selectedPromoProducts.includes(product.id)}
                        onChange={() => togglePromoProduct(product.id)}
                        className="w-4 h-4 rounded text-christmas-green focus:ring-christmas-green border-gray-300"
                      />
                      <img src={product.image} className="w-8 h-8 rounded object-cover" alt="" />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-800 block line-clamp-1">{product.name}</span>
                        <span className="text-xs text-gray-500">R$ {product.price.toFixed(2)}</span>
                      </div>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2 text-right">{selectedPromoProducts.length} produtos selecionados</p>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-4">
                <button type="button" onClick={() => setIsPromotionModalOpen(false)} className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-2.5 bg-christmas-green text-white rounded-lg hover:bg-christmas-dark font-bold shadow-md transition-colors">Criar Campanha</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};