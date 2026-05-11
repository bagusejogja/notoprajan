"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const IMAGES = [
  "https://images.unsplash.com/photo-1542623024-a797a7cbd0ed?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=80&w=2000"
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % IMAGES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % IMAGES.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);

  return (
    <section className="relative h-[90vh] min-h-[700px] w-full overflow-hidden bg-slate-900">
      {/* Background Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img 
            src={IMAGES[current]} 
            className="w-full h-full object-cover" 
            alt="Mosque View"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content */}
      <div className="relative h-full max-w-6xl mx-auto px-4 flex flex-col justify-center items-center text-center space-y-8 z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-400 text-sm font-bold tracking-widest uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Selamat Datang di Masjid Notoprajan
          </div>
          <h1 className="text-5xl md:text-8xl font-black font-outfit text-white leading-tight">
            Pusat Syiar & <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Ukhuwah Islamiyah</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Membangun peradaban dari masjid untuk mewujudkan masyarakat Notoprajan yang religius, harmonis, dan mandiri.
          </p>
        </motion.div>
      </div>

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

      {/* Slider Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-500 rounded-full ${
              i === current ? "w-12 bg-emerald-500 h-2" : "w-2 bg-white/30 h-2 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
