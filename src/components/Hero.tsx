"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1597404294360-fedede44308a?auto=format&fit=crop&q=80&w=2000",
    title: "Masjid Notoprajan",
    subtitle: "Pusat Syiar & Ukhuwah Islamiyah Notoprajan Yogyakarta"
  },
  {
    image: "https://images.unsplash.com/photo-1519817650390-64a934479f61?auto=format&fit=crop&q=80&w=2000",
    title: "Kajian & Pendidikan",
    subtitle: "Program rutin kajian islami dan pendidikan TPA di Notoprajan"
  },
  {
    image: "https://images.unsplash.com/photo-1526674179247-f39ed5ffa0d8?auto=format&fit=crop&q=80&w=2000",
    title: "Transparansi & Amanah",
    subtitle: "Laporan keuangan dan kegiatan warga Notoprajan yang transparan"
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
    <section className="relative h-[80vh] md:h-[90vh] w-full overflow-hidden bg-slate-900">
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
            <div className="max-w-4xl space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-sm font-bold tracking-widest uppercase mb-4 mx-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Informasi Masjid Notoprajan
              </div>
              <h1 className="text-4xl md:text-8xl font-black text-white font-outfit leading-tight drop-shadow-2xl">
                {slide.title}
              </h1>
              <p className="text-lg md:text-2xl text-emerald-100 font-medium max-w-2xl mx-auto drop-shadow-lg">
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
          className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-emerald-500 hover:border-emerald-500 transition-all pointer-events-auto shadow-xl"
        >
          <ChevronLeft size={32} />
        </button>
        <button 
          onClick={nextSlide}
          className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-emerald-500 hover:border-emerald-500 transition-all pointer-events-auto shadow-xl"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`transition-all duration-500 rounded-full ${
              i === currentSlide ? "w-12 bg-emerald-500 h-2" : "w-2 bg-white/30 h-2 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
