"use client";

import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { motion } from "framer-motion";
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

        if (data) {
          setHadith(data);
        } else {
          setHadith({
            content: "Barangsiapa yang menempuh jalan untuk mencari ilmu, maka Allah akan mudahkan baginya jalan menuju surga.",
            narrator: "HR. Muslim",
            source: "Shahih Muslim no. 2699"
          });
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHadith();
  }, []);

  if (loading) return (
    <section className="h-[500px] bg-[#022c22] flex items-center justify-center">
       <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </section>
  );

  if (!hadith) return null;

  return (
    <section className="relative py-32 px-4 bg-[#fcfaf7] overflow-hidden">
      {/* Intricate Islamic Pattern Background (Full Section) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0l5 15 15 5-15 5-5 15-5-15-15-5 15-5 5-15z' fill='%2378350f'/%3E%3C/svg%3E")`,
        backgroundSize: '100px 100px'
      }} />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative group"
        >
          {/* THE MIHRAB CONTAINER (Narrowed) */}
          <div className="relative mx-auto max-w-2xl">
            {/* The Outer Arch Frame */}
            <div className="absolute -inset-4 bg-gradient-to-b from-amber-600 to-amber-900 rounded-t-[10rem] opacity-10 blur-2xl" />
            
            {/* The Main Iconic Mihrab Shape Card */}
            <div className="relative bg-white rounded-t-[10rem] rounded-b-[2rem] shadow-[0_40px_100px_rgba(120,53,15,0.15)] border-[10px] border-[#0a0a0a] overflow-hidden min-h-[480px] flex flex-col items-center justify-center">
              
              {/* INTERNAL MOTIF PATTERN */}
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l5 15 15 5-15 5-5 15-5-15-15-5 15-5 5-15z' fill='%2378350f'/%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }} />

              {/* Internal Gold Arch Border */}
              <div className="absolute inset-2 border-2 border-amber-500/30 rounded-t-[9rem] rounded-b-[1.2rem] pointer-events-none" />

              {/* Decorative Lanterns (Realistic SVG) */}
              <div className="absolute top-0 left-16 flex flex-col items-center">
                <div className="w-px h-24 bg-amber-600/40" />
                <div className="w-10 h-14 bg-[#1a1a1a] rounded-t-full border-2 border-amber-500 flex items-center justify-center relative shadow-lg">
                   <div className="w-4 h-6 bg-amber-400 rounded-full blur-[4px] animate-pulse" />
                   <div className="absolute -top-1 w-2 h-2 bg-amber-500 rounded-full" />
                </div>
              </div>
              <div className="absolute top-0 right-16 flex flex-col items-center">
                <div className="w-px h-36 bg-amber-600/40" />
                <div className="w-10 h-14 bg-[#1a1a1a] rounded-t-full border-2 border-amber-500 flex items-center justify-center relative shadow-lg">
                   <div className="w-4 h-6 bg-amber-400 rounded-full blur-[4px] animate-pulse" />
                   <div className="absolute -top-1 w-2 h-2 bg-amber-500 rounded-full" />
                </div>
              </div>

              {/* Content Area */}
              <div className="px-10 py-20 md:px-24 text-center space-y-12 relative z-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-amber-900/20">
                    <Quote size={20} className="fill-current" />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-700">Mutiara Hadits</div>
                </div>

                <h2 className="text-2xl md:text-4xl font-medium text-slate-800 leading-[1.6] font-outfit italic">
                  "{hadith.content}"
                </h2>
                
                <div className="flex flex-col items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rotate-45 bg-amber-500" />
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                    <div className="w-2 h-2 rotate-45 bg-amber-500" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-amber-700 font-black tracking-[0.3em] uppercase text-xs md:text-sm">
                      {hadith.narrator}
                    </p>
                    <p className="text-slate-400 text-[10px] md:text-xs font-medium tracking-wide">
                      {hadith.source}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Decorative Base */}
              <div className="absolute bottom-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
            </div>

            {/* Floating Dust/Light Particles for extra WOW */}
            <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden rounded-t-[12rem]">
               {[1,2,3,4,5].map(i => (
                 <motion.div 
                   key={i}
                   animate={{ 
                     y: [0, -100, 0],
                     opacity: [0, 1, 0],
                     x: Math.random() * 20 - 10
                   }}
                   transition={{ 
                     duration: 5 + Math.random() * 5, 
                     repeat: Infinity,
                     delay: Math.random() * 5 
                   }}
                   className="absolute w-1 h-1 bg-amber-400 rounded-full"
                   style={{ 
                     left: `${Math.random() * 100}%`,
                     bottom: '10%'
                   }}
                 />
               ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
