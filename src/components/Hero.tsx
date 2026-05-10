"use client";

import { useEffect, useState } from "react";
import { Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PrayerTimesData {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

const slides = [
  { id: 1, image: "/mosque_slider_1_1778417755267.png", title: "Masjid Notoparaja", desc: "Pusat Ibadah & Pemberdayaan Umat" },
  { id: 2, image: "/mosque_slider_2_1778417774086.png", title: "Shalat Berjamaah", desc: "Mari Memakmurkan Rumah Allah" },
  { id: 3, image: "/mosque_slider_3_1778417789099.png", title: "Kajian Ilmu", desc: "Taman-taman Surga di Dunia" }
];

export default function Hero() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [countdown, setCountdown] = useState<string>("00:00:00");
  const [nextPrayerName, setNextPrayerName] = useState<string>("Memuat...");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = (now.getMonth() + 1).toString().padStart(2, "0");
    const d = now.getDate().toString().padStart(2, "0");

    fetch(`https://api.myquran.com/v2/sholat/jadwal/1505/${y}/${m}/${d}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.data.jadwal) {
          const j = data.data.jadwal;
          const timings = { Fajr: j.subuh, Dhuhr: j.dzuhur, Asr: j.ashar, Maghrib: j.maghrib, Isha: j.isya };
          setPrayerTimes(timings);
          updateNextPrayer(timings);
        }
      })
      .catch(err => console.error("API Error:", err));

    const interval = setInterval(() => {
      if (prayerTimes) updateNextPrayer(prayerTimes);
    }, 1000);

    return () => clearInterval(interval);
  }, [prayerTimes]);

  const updateNextPrayer = (timings: PrayerTimesData) => {
    const now = new Date();
    const times = Object.entries(timings).map(([name, time]) => {
      const [hours, minutes] = time.split(":").map(Number);
      const prayerDate = new Date();
      prayerDate.setHours(hours, minutes, 0);
      if (prayerDate < now) prayerDate.setDate(prayerDate.getDate() + 1);
      return { name, time: prayerDate };
    });
    times.sort((a, b) => a.time.getTime() - b.time.getTime());
    const next = times[0];
    setNextPrayerName(next.name);
    const diff = next.time.getTime() - now.getTime();
    const h = Math.floor(diff / 3600000).toString().padStart(2, "0");
    const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, "0");
    const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, "0");
    setCountdown(`${h}:${m}:${s}`);
  };

  return (
    <section className="relative h-[600px] md:h-[750px] w-full overflow-hidden flex flex-col items-center justify-center">
      {/* Background Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          >
            <div className="absolute inset-0 bg-slate-950/60" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="relative z-20 max-w-6xl w-full text-center text-white px-4 space-y-8">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-400 text-sm font-medium mx-auto"
        >
          <MapPin size={16} />
          <span>Masjid Notoparaja, Yogyakarta</span>
        </motion.div>
        
        <div className="space-y-2">
          <motion.h1 
            key={`t-${currentSlide}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-7xl font-bold font-outfit"
          >
            {slides[currentSlide].title}
          </motion.h1>
          <motion.p 
             key={`d-${currentSlide}`}
             initial={{ y: 10, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="text-slate-300 text-lg md:text-xl font-light"
          >
            {slides[currentSlide].desc}
          </motion.p>
        </div>

        {/* Prayer Times Widget */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-12 w-full max-w-4xl mx-auto">
          {prayerTimes ? (
            Object.entries(prayerTimes).map(([name, time]) => (
              <div key={name} className={`p-4 md:p-6 rounded-3xl border transition-all backdrop-blur-md ${nextPrayerName === name ? 'bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/40 scale-105 z-30' : 'bg-white/5 border-white/10 shadow-xl'}`}>
                <span className={`text-[10px] md:text-xs uppercase tracking-widest block mb-1 ${nextPrayerName === name ? 'text-emerald-100 font-bold' : 'text-slate-400'}`}>
                  {name}
                </span>
                <span className="text-xl md:text-3xl font-bold font-outfit">
                  {time}
                </span>
              </div>
            ))
          ) : (
            Array(5).fill(0).map((_, i) => <div key={i} className="h-24 bg-white/5 rounded-3xl animate-pulse" />)
          )}
        </div>
        
        <div className="flex items-center justify-center gap-3 text-emerald-400 font-bold bg-black/40 backdrop-blur-xl py-4 px-8 rounded-2xl border border-white/10 w-fit mx-auto mt-10">
          <Clock size={22} />
          <span className="text-sm md:text-base">Menuju <span className="text-white uppercase">{nextPrayerName}</span>: <span className="text-white font-mono text-2xl">{countdown}</span></span>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 flex gap-2 z-30">
        {slides.map((_, i) => (
          <div key={i} className={`h-1 rounded-full transition-all ${currentSlide === i ? 'w-8 bg-emerald-500' : 'w-4 bg-white/30'}`} />
        ))}
      </div>
    </section>
  );
}
