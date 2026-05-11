"use client";

import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface HadithData {
  content: string;
  narrator: string;
  source: string;
}

export default function DailyHadith() {
  const [hadith, setHadith] = useState<HadithData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHadith() {
      try {
        const { data, error } = await supabase
          .from('hadith')
          .select('*')
          .lte('display_date', new Date().toISOString().split('T')[0])
          .order('display_date', { ascending: false })
          .limit(1)
          .single();

        if (data) setHadith(data);
        else setHadith({
          content: "Barangsiapa yang menempuh jalan untuk mencari ilmu, maka Allah akan mudahkan baginya jalan menuju surga.",
          narrator: "HR. Muslim",
          source: "Shahih Muslim no. 2699"
        });
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    }
    fetchHadith();
  }, []);

  if (loading) return <div className="h-96 bg-[#050505]" />;
  if (!hadith) return null;

  return (
    <section className="relative min-h-[400px] flex items-center justify-center bg-[#022c22] overflow-hidden py-12">
      {/* 1. THE GIRIH PATTERN BACKGROUND (Soft Gradient 3D Effect) */}
      <div className="absolute inset-0 opacity-60 pointer-events-none overflow-hidden">
        <svg width="100%" height="100%" className="w-full h-full" style={{ filter: 'drop-shadow(4px 6px 12px rgba(0,0,0,0.6))' }}>
          <defs>
            {/* Elegant Gold Gradient */}
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />    {/* Bright Gold */}
              <stop offset="50%" stopColor="#d97706" />   {/* Mid Gold */}
              <stop offset="100%" stopColor="#78350f" />  {/* Dark Bronze */}
            </linearGradient>

            <pattern id="girihSoft3d" x="0" y="0" width="160" height="160" patternUnits="userSpaceOnUse">
              <g fill="none" strokeLinejoin="round" strokeLinecap="round">
                {/* Layer 1: Soft Dark Base (Shadow thickness) */}
                <g stroke="#022c22" strokeWidth="8" strokeOpacity="0.8">
                  <path d="M80 0 L105 55 L160 80 L105 105 L80 160 L55 105 L0 80 L55 55 Z" />
                  <path d="M0 0 L40 40 M160 0 L120 40 M160 160 L120 120 M0 160 L40 120" />
                  <rect x="40" y="40" width="80" height="80" />
                </g>
                
                {/* Layer 2: Main Gradient Gold Body */}
                <g stroke="url(#goldGrad)" strokeWidth="4">
                  <path d="M80 0 L105 55 L160 80 L105 105 L80 160 L55 105 L0 80 L55 55 Z" />
                  <path d="M0 0 L40 40 M160 0 L120 40 M160 160 L120 120 M0 160 L40 120" />
                  <rect x="40" y="40" width="80" height="80" />
                </g>

                {/* Layer 3: Delicate Highlight */}
                <g stroke="#fef08a" strokeWidth="1" strokeOpacity="0.6">
                  <path d="M80 0 L105 55 L160 80 L105 105 L80 160 L55 105 L0 80 L55 55 Z" />
                  <path d="M0 0 L40 40 M160 0 L120 40 M160 160 L120 120 M0 160 L40 120" />
                  <rect x="40" y="40" width="80" height="80" />
                </g>
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#girihSoft3d)" />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#022c22]/50 to-[#022c22]" />
      </div>

      {/* 2. ATMOSPHERIC LIGHTING */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.12),transparent_70%)]" />
      
      {/* 3. MAJESTIC GOLDEN MIHRAB ARCH */}
      <div className="absolute inset-0 flex justify-center opacity-30 pointer-events-none">
         <div className="w-full max-w-5xl border-t-2 border-x-2 border-amber-500/40 rounded-t-[25rem] mt-10 shadow-[0_0_150px_rgba(245,158,11,0.15)_inset]" />
      </div>

      {/* 4. 3D STAGE FLOOR (With Reflection) */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#022c22] via-[#022c22]/90 to-transparent z-10" />
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90%] h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent shadow-[0_0_25px_rgba(245,158,11,1)] z-20" />

      {/* 5. FLOATING CONTENT */}
      <div className="max-w-4xl mx-auto px-6 relative z-30">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-center space-y-12"
        >
          {/* Golden Badge */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-8 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="relative flex flex-col items-center gap-5">
                 <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-[1px] rotate-45 shadow-2xl">
                   <div className="w-full h-full bg-[#0a0a0a] rounded-2xl flex items-center justify-center -rotate-45">
                      <Quote size={28} className="text-amber-500 fill-amber-500/10" />
                   </div>
                 </div>
                 <span className="text-xs font-black tracking-[0.8em] text-amber-500 uppercase ml-[0.8em]">Mutiara Hadits</span>
              </div>
            </div>
          </div>

          {/* The Hadith: High-End Typography */}
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-medium text-white leading-[1.5] font-outfit italic tracking-wide drop-shadow-2xl">
              <span className="bg-gradient-to-b from-white via-white to-amber-200 bg-clip-text text-transparent">
                "{hadith.content}"
              </span>
            </h2>
          </div>

          {/* The Narrator */}
          <div className="flex flex-col items-center gap-8">
             <div className="flex items-center gap-4">
                <div className="h-px w-20 bg-gradient-to-r from-transparent to-amber-500" />
                <div className="w-2 h-2 rotate-45 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.6)]" />
                <div className="h-px w-20 bg-gradient-to-l from-transparent to-amber-500" />
             </div>
             <div className="space-y-2">
               <p className="text-amber-500 font-black tracking-[0.5em] uppercase text-sm md:text-base">
                 {hadith.narrator}
               </p>
               <p className="text-white/40 text-[10px] md:text-xs font-bold tracking-widest uppercase">
                 {hadith.source}
               </p>
             </div>
          </div>
        </motion.div>
      </div>

      {/* 6. FLOATING LANTERNS (Refined) */}
      <div className="absolute top-0 left-10 md:left-28 z-20">
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
           <div className="w-px h-40 bg-gradient-to-b from-transparent via-amber-500/50 to-amber-500" />
           <div className="w-12 h-20 bg-[#1a0f05] border-2 border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.5)] rounded-t-full relative flex items-center justify-center">
              <div className="w-4 h-8 bg-amber-400 blur-md rounded-full animate-pulse" />
           </div>
        </motion.div>
      </div>
      <div className="absolute top-10 right-10 md:right-28 z-20">
        <motion.div animate={{ y: [0, -30, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
           <div className="w-px h-64 bg-gradient-to-b from-transparent via-amber-600/50 to-amber-600" />
           <div className="w-12 h-20 bg-[#1a0f05] border-2 border-amber-600 shadow-[0_0_40px_rgba(217,119,6,0.5)] rounded-t-full relative flex items-center justify-center">
              <div className="w-4 h-8 bg-amber-400 blur-md rounded-full animate-pulse" />
           </div>
        </motion.div>
      </div>

      {/* 6. SPIRITUAL DUST (Floating Particles) */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-amber-400 rounded-full opacity-20"
          animate={{
            y: [-20, -120],
            x: [0, Math.random() * 40 - 20],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            bottom: '10%',
          }}
        />
      ))}
    </section>
  );
}
