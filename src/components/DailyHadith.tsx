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
    <section className="relative min-h-[600px] flex items-center justify-center bg-[#050505] overflow-hidden py-24">
      {/* 1. SPIRITUAL AMBIANCE (The Background) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(217,119,6,0.15),transparent_60%)]" />
      
      {/* 2. ROTATING MANDALA (Infinite Spiritual Cycle) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.05] pointer-events-none">
        <motion.svg 
          animate={{ rotate: 360 }}
          transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
          viewBox="0 0 100 100" className="w-full h-full fill-amber-500"
        >
          <path d="M50 0l5 15h15l-12 10 5 15-13-10-13 10 5-15-12-10h15z" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="1 2" />
          {[...Array(12)].map((_, i) => (
            <circle key={i} cx="50" cy="10" r="1" transform={`rotate(${i * 30} 50 50)`} />
          ))}
        </motion.svg>
      </div>

      {/* 3. 3D STAGE FLOOR (Grounding the content) */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black to-transparent opacity-80" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-amber-500/20 blur-2xl rounded-full" />

      {/* 4. FLOATING CONTENT (The "WOW" part) */}
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="text-center space-y-10"
        >
          {/* Floating Sacred Label */}
          <div className="flex justify-center mb-4">
            <div className="relative group">
              <div className="absolute -inset-4 bg-amber-500/20 rounded-full blur-xl animate-pulse" />
              <div className="relative flex flex-col items-center gap-3">
                 <Quote size={40} className="text-amber-500 fill-amber-500/10 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                 <span className="text-[10px] font-black tracking-[0.6em] text-amber-500/80 uppercase">Mutiara Hadits</span>
              </div>
            </div>
          </div>

          {/* The Content: Glowing Typography */}
          <div className="relative py-12">
            {/* Side Ornaments (The Mihrab Wings - Minimalist 3D) */}
            <div className="absolute -left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-500/50 to-transparent hidden md:block" />
            <div className="absolute -right-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-500/50 to-transparent hidden md:block" />

            <h2 className="text-3xl md:text-5xl font-medium text-white leading-tight font-outfit italic tracking-wide">
              <span className="bg-gradient-to-b from-white to-amber-100 bg-clip-text text-transparent">
                "{hadith.content}"
              </span>
            </h2>
          </div>

          {/* The Narrator: Podium Finish */}
          <div className="flex flex-col items-center gap-6">
             <div className="h-0.5 w-40 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
             <div className="space-y-1">
               <motion.p 
                 animate={{ opacity: [0.5, 1, 0.5] }}
                 transition={{ duration: 4, repeat: Infinity }}
                 className="text-amber-500 font-black tracking-[0.4em] uppercase text-sm"
               >
                 {hadith.narrator}
               </motion.p>
               <p className="text-white/30 text-xs italic font-medium">{hadith.source}</p>
             </div>
          </div>
        </motion.div>
      </div>

      {/* 5. FLOATING LANTERNS (Depth) */}
      <div className="absolute top-10 left-10 md:left-24">
        <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
           <div className="w-0.5 h-32 bg-gradient-to-b from-transparent to-amber-500/40" />
           <div className="w-10 h-16 bg-amber-950 border border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)] rounded-t-full relative">
              <div className="absolute inset-2 bg-amber-500/20 blur-sm rounded-full animate-pulse" />
           </div>
        </motion.div>
      </div>
      <div className="absolute top-20 right-10 md:right-24">
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
           <div className="w-0.5 h-48 bg-gradient-to-b from-transparent to-amber-600/40" />
           <div className="w-10 h-16 bg-amber-950 border border-amber-600 shadow-[0_0_20px_rgba(217,119,6,0.3)] rounded-t-full relative">
              <div className="absolute inset-2 bg-amber-600/20 blur-sm rounded-full animate-pulse" />
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
