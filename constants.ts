import { Category, Product, Review } from './types';

export const CATEGORIES: Category[] = [
  'Todas',
  'Árvores',
  'Luzes',
  'Mesa',
  'Fachada',
  'Infláveis',
  'Acessórios'
];

const DEFAULT_REVIEWS: Review[] = [
  { id: 1, name: 'Ana Clara', comment: 'Produto lindo, superou as expectativas!', rating: 5, date: '10/11/2024' },
  { id: 2, name: 'Carlos Eduardo', comment: 'Entrega rápida e bem embalado.', rating: 4, date: '12/11/2024' },
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Cortina 400 Leds 3x4 Luzes Natal Decoração Festas Casamentos',
    price: 80.00,
    oldPrice: 210.90,
    category: 'Luzes',
    image: 'https://down-br.img.susercontent.com/file/br-11134207-7r98o-lz0sx7cxfb85dd@resize_w450_nl.webp',
    images: [
      'https://down-br.img.susercontent.com/file/br-11134207-7r98o-lz0sx7cxfb85dd@resize_w450_nl.webp',
      'https://images.unsplash.com/photo-1576669932649-1667b973c1d9?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&q=80&w=600'
    ],
    isFeatured: true,
    rating: 5,
    description: 'Transforme qualquer ambiente com a mágica da Cortina de 400 LEDs. Ideal para decorações de Natal, casamentos e festas, ela proporciona um efeito cascata deslumbrante. Resistente e fácil de instalar, cobre uma área de 3x4 metros com brilho intenso e econômico.',
    specifications: ['Voltagem: 110v/220v (Bivolt)', 'Quantidade de LEDs: 400', 'Dimensões: 3m (altura) x 4m (largura)', 'Cor do fio: Transparente', 'Modos de luz: 8 funções'],
    reviews: DEFAULT_REVIEWS,
    stock: 50,
    isActive: true
  },
  {
    id: 2,
    name: '1 à 10m Mangueira de Led + Conector 5 cores disponíveis IP65 Iluminação Natal Decoração apenas 220V',
    price: 19.77,
    oldPrice: 34.90,
    category: 'Luzes',
    image: 'https://down-br.img.susercontent.com/file/sg-11134201-824jb-mffonp1ob66j88@resize_w450_nl.webp',
    images: [
      'https://down-br.img.susercontent.com/file/sg-11134201-824jb-mffonp1ob66j88@resize_w450_nl.webp',
      'https://down-br.img.susercontent.com/file/br-11134207-7r98o-lz0sx8j56q7c2b.webp',
      'https://images.unsplash.com/photo-1574880556277-c990c74f076f?auto=format&fit=crop&q=80&w=600'
    ],
    isFeatured: true,
    rating: 4,
    description: 'Mangueira de LED flexível e resistente à água (IP65), perfeita para contornar fachadas, árvores e vitrines. Disponível em 5 cores vibrantes, oferece alta luminosidade com baixo consumo de energia. Acompanha conector para ligação imediata.',
    specifications: ['Tensão: 220V', 'Proteção: IP65 (Uso externo)', 'Espessura: 11mm', 'Vida útil: 50.000 horas', 'Corte: A cada 1 metro'],
    reviews: [
      { id: 101, name: 'Roberto M.', comment: 'Iluminação forte, ficou lindo no jardim.', rating: 5, date: '01/11/2024' }
    ],
    stock: 150,
    isActive: true
  },
  {
    id: 3,
    name: 'Mangueira de Led + Conector 5 Cores IP65 220V',
    price: 19.77,
    oldPrice: 34.68,
    category: 'Fachada',
    image: 'https://down-br.img.susercontent.com/file/sg-11134201-821gf-mh8wz9bkl5oo05.webp',
    images: [
       'https://down-br.img.susercontent.com/file/sg-11134201-821gf-mh8wz9bkl5oo05.webp',
       'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?auto=format&fit=crop&q=80&w=600'
    ],
    rating: 4.8,
    isFeatured: true,
    description: 'Destaque sua casa neste Natal com a Mangueira LED de alta performance. Com revestimento de silicone de alta qualidade, não amarela com o tempo e resiste a chuvas. Ideal para criar desenhos e contornos iluminados.',
    specifications: ['Material: Silicone flexível', 'Cores: Branco Frio, Branco Quente, Azul, Verde, Vermelho', 'Potência: 4.8W/metro'],
    reviews: DEFAULT_REVIEWS,
    stock: 80,
    isActive: true
  },
  {
    id: 4,
    name: 'Stranger Things Christmas Advent Calendar',
    price: 140.90,
    category: 'Acessórios',
    image: 'https://down-br.img.susercontent.com/file/sg-11134201-82596-mfusosv6dibt52@resize_w450_nl.webp',
    images: ['https://down-br.img.susercontent.com/file/sg-11134201-825b3-mfusov1kjhn2f1.webp', 'https://down-br.img.susercontent.com/file/sg-11134201-825b0-mfusp93dfkstca.webp'],
    isFeatured: true,
    rating: 4,
    description: 'Receba seus convidados com estilo. Guirlanda artesanal com pinhas naturais, laços de veludo e acabamento premium.',
    specifications: ['Diâmetro: 40cm', 'Material: PVC e Tecido', 'Uso: Interno/Externo coberto'],
    reviews: DEFAULT_REVIEWS,
    stock: 20,
    isActive: true
  },
  {
    id: 5,
    name: 'Papai Noel Inflável Gigante 2m',
    price: 349.90,
    oldPrice: 420.00,
    category: 'Infláveis',
    image: 'https://picsum.photos/id/50/400/400',
    images: ['https://picsum.photos/id/50/600/600', 'https://picsum.photos/id/51/600/600'],
    rating: 5,
    description: 'A atração principal da vizinhança! Papai Noel gigante com motor embutido que infla em segundos. Possui luzes internas para destaque noturno.',
    specifications: ['Altura: 2.0 metros', 'Voltagem: Bivolt', 'Incluso: Estacas e cordas para fixação'],
    reviews: DEFAULT_REVIEWS,
    stock: 10,
    isActive: true
  },
  {
    id: 6,
    name: 'Toalha de Mesa Natalina Bordada',
    price: 159.90,
    category: 'Mesa',
    image: 'https://picsum.photos/id/60/400/400',
    images: ['https://picsum.photos/id/60/600/600'],
    rating: 4,
    description: 'Elegância para sua ceia. Toalha com bordados dourados e tecido repelente a líquidos.',
    specifications: ['Tamanho: 2.20m x 1.40m', 'Tecido: Jacquard', 'Lugares: 6 a 8'],
    reviews: DEFAULT_REVIEWS,
    stock: 35,
    isActive: true
  },
  {
    id: 7,
    name: 'Árvore de Natal Nevada 1.5m',
    price: 299.90,
    category: 'Árvores',
    image: 'https://picsum.photos/id/70/400/400',
    images: ['https://picsum.photos/id/70/600/600', 'https://picsum.photos/id/71/600/600'],
    rating: 5,
    description: 'Árvore pinheiro com efeito de neve nas pontas. Galhos cheios e estruturados para suportar enfeites pesados.',
    specifications: ['Altura: 1.50m', 'Galhos: 450 ramos', 'Base: Metal reforçado'],
    reviews: DEFAULT_REVIEWS,
    stock: 15,
    isActive: true
  },
  {
    id: 8,
    name: 'Estrela de Topo Luminosa',
    price: 45.90,
    category: 'Acessórios',
    image: 'https://picsum.photos/id/80/400/400',
    images: ['https://picsum.photos/id/80/600/600'],
    rating: 3,
    description: 'O toque final que sua árvore merece. Estrela com luz LED interna pulsante.',
    specifications: ['Tamanho: 20cm', 'Alimentação: 2 Pilhas AA', 'Material: Acrílico'],
    reviews: DEFAULT_REVIEWS,
    stock: 100,
    isActive: true
  },
  {
    id: 9,
    name: 'Cortina 400 Leds 3x4m Decoração Festas',
    price: 46.55,
    oldPrice: 155.85,
    category: 'Luzes',
    image: 'https://images.unsplash.com/photo-1514339396263-89684b065476?auto=format&fit=crop&q=80&w=400',
    images: ['https://images.unsplash.com/photo-1514339396263-89684b065476?auto=format&fit=crop&q=80&w=600'],
    isFeatured: true,
    rating: 4.8,
    description: 'Luzes LED de alta qualidade para decorar grandes espaços com economia e segurança.',
    specifications: ['Tamanho: 3x4m', 'Lâmpadas: LED', 'Cor: Branco Quente'],
    reviews: DEFAULT_REVIEWS,
    stock: 200,
    isActive: true
  },
  {
    id: 10,
    name: 'Kit Guardanapos Temáticos (6 peças)',
    price: 59.90,
    category: 'Mesa',
    image: 'https://picsum.photos/id/100/400/400',
    images: ['https://picsum.photos/id/100/600/600'],
    rating: 5,
    description: 'Conjunto de guardanapos 100% algodão com estampas exclusivas de Natal.',
    specifications: ['Quantidade: 6 unidades', 'Tamanho: 45x45cm', 'Tecido: Algodão'],
    reviews: DEFAULT_REVIEWS,
    stock: 60,
    isActive: true
  },
  {
    id: 11,
    name: 'Luzes Solares Externas Papai Noel e Renas',
    price: 91.00,
    oldPrice: 185.00,
    category: 'Fachada',
    image: 'https://images.unsplash.com/photo-1610052570742-15967b57b12c?auto=format&fit=crop&q=80&w=400',
    images: [
      'https://images.unsplash.com/photo-1610052570742-15967b57b12c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1545648585-177242c36660?auto=format&fit=crop&q=80&w=600'
    ],
    rating: 0,
    isFeatured: true,
    description: 'Decoração sustentável e encantadora. Regador solar que projeta luzes simulando água, com silhueta de Papai Noel.',
    specifications: ['Painel Solar: Incluso', 'Autonomia: Até 8 horas', 'Instalação: Espeto de jardim'],
    reviews: [],
    stock: 40,
    isActive: true
  },
  {
    id: 12,
    name: 'Boneco de Neve Inflável com Luz',
    price: 189.90,
    category: 'Infláveis',
    image: 'https://picsum.photos/id/120/400/400',
    images: ['https://picsum.photos/id/120/600/600'],
    rating: 4,
    description: 'Boneco de neve simpático para áreas internas ou externas.',
    specifications: ['Altura: 1.20m', 'Material: Poliéster impermeável'],
    reviews: DEFAULT_REVIEWS,
    stock: 25,
    isActive: true
  }
];

export const REVIEWS: Review[] = [
  {
    id: 1,
    name: 'Maria Silva',
    comment: 'Amei a árvore! Chegou super rápido e é muito cheia, exatamente como na foto.',
    rating: 5,
    date: '10/11/2024'
  },
  {
    id: 2,
    name: 'João Souza',
    comment: 'Os preços são ótimos. O pisca-pisca tem uma cor bem aconchegante.',
    rating: 4,
    date: '12/11/2024'
  },
  {
    id: 3,
    name: 'Ana Pereira',
    comment: 'Atendimento excelente pelo WhatsApp. Resolveram minha dúvida na hora.',
    rating: 5,
    date: '15/11/2024'
  }
];