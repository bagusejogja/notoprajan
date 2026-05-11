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
    <section className="relative min-h-[650px] flex items-center justify-center bg-[#050505] overflow-hidden py-24">
      {/* 1. SPIRITUAL AMBIANCE (The Background) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(217,119,6,0.2),transparent_70%)]" />
      
      {/* 2. GOLDEN CORNER ORNAMENTS */}
      <div className="absolute top-10 left-10 w-32 h-32 opacity-40 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-amber-500">
          <path d="M0 0c50 0 100 50 100 100v-20c0-40-40-80-80-80h-20z M0 20c30 0 60 30 60 60h-10c0-20-20-40-40-40v-20z" />
        </svg>
      </div>
      <div className="absolute top-10 right-10 w-32 h-32 opacity-40 pointer-events-none rotate-90">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-amber-500">
          <path d="M0 0c50 0 100 50 100 100v-20c0-40-40-80-80-80h-20z M0 20c30 0 60 30 60 60h-10c0-20-20-40-40-40v-20z" />
        </svg>
      </div>

      {/* 3. MAJESTIC GOLDEN ARCH (Background Frame) */}
      <div className="absolute inset-x-0 top-0 bottom-20 flex justify-center opacity-20 pointer-events-none">
         <div className="w-full max-w-4xl border-t-[1px] border-x-[1px] border-amber-500/50 rounded-t-[20rem] shadow-[0_0_100px_rgba(245,158,11,0.1)_inset]" />
      </div>
      
      {/* 4. ROTATING GOLD MANDALA */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-[0.08] pointer-events-none">
        <motion.svg 
          animate={{ rotate: 360 }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
          viewBox="0 0 100 100" className="w-full h-full fill-amber-500"
        >
          <path d="M50 0l5 15h15l-12 10 5 15-13-10-13 10 5-15-12-10h15z" />
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="1 3" />
        </motion.svg>
      </div>

      {/* 5. 3D STAGE FLOOR (With Gold Trim) */}
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black via-black/90 to-transparent opacity-95" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent shadow-[0_0_20px_rgba(245,158,11,0.8)]" />

      {/* 6. FLOATING CONTENT */}
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="text-center space-y-12"
        >
          {/* Floating Sacred Label */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-6 bg-amber-500/30 rounded-full blur-2xl animate-pulse" />
              <div className="relative flex flex-col items-center gap-4">
                 <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-800 p-px">
                   <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                      <Quote size={24} className="text-amber-500 fill-amber-500/20" />
                   </div>
                 </div>
                 <span className="text-[10px] font-black tracking-[0.7em] text-amber-500 uppercase">Mutiara Hadits</span>
              </div>
            </div>
          </div>

          {/* The Content: Glowing Gold Typography */}
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-medium text-white leading-[1.4] font-outfit italic tracking-wide">
              <span className="bg-gradient-to-b from-white via-white to-amber-200 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                "{hadith.content}"
              </span>
            </h2>
          </div>

          {/* The Narrator: Gold Foil Style */}
          <div className="flex flex-col items-center gap-6">
             <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
             <div className="space-y-1">
               <motion.p 
                 animate={{ opacity: [0.6, 1, 0.6] }}
                 transition={{ duration: 5, repeat: Infinity }}
                 className="text-amber-500 font-black tracking-[0.5em] uppercase text-sm drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]"
               >
                 {hadith.narrator}
               </motion.p>
               <p className="text-white/40 text-[10px] font-bold tracking-widest">{hadith.source}</p>
             </div>
          </div>
        </motion.div>
      </div>

      {/* 7. FLOATING LANTERNS */}
      <div className="absolute top-10 left-10 md:left-24">
        <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
           <div className="w-[0.5px] h-32 bg-gradient-to-b from-transparent to-amber-500" />
           <div className="w-10 h-16 bg-[#1a0f05] border-2 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.4)] rounded-t-full relative">
              <div className="absolute inset-2 bg-amber-400 blur-md rounded-full animate-pulse" />
           </div>
        </motion.div>
      </div>
      <div className="absolute top-20 right-10 md:right-24">
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
           <div className="w-[0.5px] h-48 bg-gradient-to-b from-transparent to-amber-600" />
           <div className="w-10 h-16 bg-[#1a0f05] border-2 border-amber-600 shadow-[0_0_30px_rgba(217,119,6,0.4)] rounded-t-full relative">
              <div className="absolute inset-2 bg-amber-500 blur-md rounded-full animate-pulse" />
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
