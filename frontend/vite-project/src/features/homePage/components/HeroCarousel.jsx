// import React, { useState } from 'react';
// import Button from '../../../components/molecules/Button';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// const HeroCarousel = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const slides = [
//     {
//       title: "Traditional Dupattas",
//       subtitle: "Handcrafted with love and tradition",
//       bg: "bg-[#EAE0D5]", // Light beige tone from your design
//     },
//     // You can add more slides here later
//   ];

//   return (
//     <div className="relative w-full h-[400 md:h-[320px]  overflow-hidden mb-6">
//       {/* Slide Content */}
//       <div className={`w-full h-full ${slides[currentSlide].bg} flex flex-col bg-[rgb(219,194,189)] rounded-2xl items-center justify-center text-center px-4 transition-all duration-700`}>
//         <h1 className="text-4xl md:text-6xl font-serif text-[#333] mb-4">
//           {slides[currentSlide].title}
//         </h1>
//         <p className="text-lg md:text-xl text-gray-600 mb-8 font-light italic">
//           {slides[currentSlide].subtitle}
//         </p>
//         <Button className="px-10 py-3 text-lg">Shop Now</Button>
//       </div>

//       {/* Navigation Arrows */}
//       <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white transition-colors">
//         <ChevronLeft size={24} className="text-gray-700" />
//       </button>
//       <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white transition-colors">
//         <ChevronRight size={24} className="text-gray-700" />
//       </button>

//       {/* Indicators (Dots) */}
//       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
//         {slides.map((_, index) => (
//           <div 
//             key={index}
//             className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentSlide ? 'bg-[#7A3E3E] w-6' : 'bg-gray-400'}`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HeroCarousel;

import React, { useState } from 'react';
import Button from '../../../components/molecules/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHeroCarousel } from '../hooks/useHeroCarousel';

const HeroCarousel = () => {
  const { slides, loading } = useHeroCarousel();
  const [currentSlide, setCurrentSlide] = useState(0);

  // next / prev handlers
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  if (loading) return <p>Loading...</p>;

  if (!slides.length) return <p>No slides available</p>;

  const slide = slides[currentSlide];

  return (
    <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden mb-6">

      {/* Slide Content */}
      <div className="w-full h-full bg-[#EAE0D5] flex flex-col items-center justify-center text-center px-4 transition-all duration-700 rounded-2xl">

        {/* 🔥 IMAGE */}
        <img
          src={slide.image}
          alt={slide.title}
          className="absolute inset-0 w-full rounded-3xl h-full object-contain opacity-80"
        />

        {/* Overlay */}
        <div className="relative  z-10 p-6 mt-45 rounded-lg">

          {slide.buttonText && (
            <Button className="px-10 py-3 text-lg">
              {slide.buttonText}
            </Button>
          )}

        </div>
      </div>

      {/* Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-2.5 h-2.5 rounded-full ${
              index === currentSlide ? 'bg-white w-6' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>

    </div>
  );
};

export default HeroCarousel;