"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/mosque_slider_1_1778417755267.png",
    title: "Masjid Notoparaja",
    description: "Pusat Ibadah dan Pemberdayaan Ummat di Yogyakarta."
  },
  {
    id: 2,
    image: "/mosque_slider_2_1778417774086.png",
    title: "Ketenangan Ibadah",
    description: "Rasulullah ﷺ bersabda: Salatlah kalian sebagaimana kalian melihat aku salat."
  },
  {
    id: 3,
    image: "/mosque_slider_3_1778417789099.png",
    title: "Kajian Ilmu",
    description: "Menuntut ilmu adalah kewajiban bagi setiap muslim."
  }
];

export default function Slider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((current + 1) % slides.length);
  const prev = () => setCurrent((current - 1 + slides.length) % slides.length);

  return (
    <div className="relative h-[550px] md:h-[700px] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          </div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 space-y-4">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-6xl font-bold font-outfit text-white drop-shadow-2xl"
            >
              {slides[current].title}
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-lg md:text-xl text-slate-200 max-w-2xl font-inter font-light"
            >
              {slides[current].description}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute inset-x-0 bottom-10 flex justify-center gap-4 z-30">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-12 h-1.5 rounded-full transition-all ${
              current === i ? "bg-emerald-500 w-20" : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all hidden md:block">
        <ChevronLeft size={24} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all hidden md:block">
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
