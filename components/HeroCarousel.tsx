import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    image: 'https://picsum.photos/id/42/1600/600',
    title: 'A Magia do Natal Começa Aqui',
    subtitle: 'Decore sua casa com elegância e tradição.',
    cta: 'Ver Coleção'
  },
  {
    id: 2,
    image: 'https://picsum.photos/id/292/1600/600',
    title: 'Luzes que Encantam',
    subtitle: 'Ilumine seu natal com nossas cascatas e pisca-piscas LED.',
    cta: 'Confira as Ofertas'
  },
  {
    id: 3,
    image: 'https://picsum.photos/id/353/1600/600',
    title: 'Mesas Postas Inesquecíveis',
    subtitle: 'Tudo para sua ceia ser o momento mais especial do ano.',
    cta: 'Comprar Agora'
  }
];

export const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));

  return (
    <section id="inicio" className="relative w-full h-[300px] md:h-[500px] overflow-hidden bg-gray-900 group">
      <div 
        className="flex transition-transform duration-700 ease-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {SLIDES.map((slide, index) => (
          <div key={slide.id} className="w-full flex-shrink-0 relative h-full">
            <img 
              src={slide.image} 
              alt={slide.title} 
              loading={index === 0 ? "eager" : "lazy"}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
              <h2 className="font-display text-4xl md:text-6xl mb-4 drop-shadow-lg animate-fade-in-up">
                {slide.title}
              </h2>
              <p className="text-lg md:text-2xl mb-8 font-light drop-shadow-md max-w-2xl">
                {slide.subtitle}
              </p>
              <a 
                href="#produtos"
                className="bg-christmas-red hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider transition-all transform hover:scale-105 shadow-lg"
              >
                {slide.cta}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft size={32} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight size={32} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === idx ? 'bg-christmas-gold w-8' : 'bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </section>
  );
};