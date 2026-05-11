"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    image: "/mosque_slider_1_1778417755267.png",
    title: "Selamat Datang di Masjid Notoparaja",
    subtitle: "Pusat Dakwah & Ekonomi Umat di Ngampilan, Yogyakarta"
  },
  {
    image: "/mosque_slider_2_1778417774086.png",
    title: "Makmurkan Masjid, Sejahterakan Umat",
    subtitle: "Mari berpartisipasi dalam berbagai kegiatan syiar islam"
  },
  {
    image: "/mosque_slider_3_1778417789099.png",
    title: "Transparansi & Amanah",
    subtitle: "Laporan keuangan dan kegiatan yang dapat diakses kapan saja"
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  return (
    <section className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden bg-slate-900">
      {/* Slides */}
      {SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <img src={slide.image} className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/70" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <div className="max-w-4xl space-y-4 md:space-y-6">
              <h1 className="text-3xl md:text-7xl font-bold text-white font-outfit leading-tight drop-shadow-2xl">
                {slide.title}
              </h1>
              <p className="text-base md:text-2xl text-emerald-100 font-medium max-w-2xl mx-auto drop-shadow-lg">
                {slide.subtitle}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <div className="absolute inset-x-4 md:inset-x-8 top-1/2 -translate-y-1/2 flex justify-between z-30 pointer-events-none">
        <button 
          onClick={prevSlide} 
          className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-emerald-500 transition-all pointer-events-auto group"
        >
          <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={nextSlide} 
          className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-emerald-500 transition-all pointer-events-auto group"
        >
          <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-1.5 transition-all duration-500 rounded-full ${
              i === currentSlide ? "w-10 md:w-16 bg-emerald-500" : "w-3 md:w-4 bg-white/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
