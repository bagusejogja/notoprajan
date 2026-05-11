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
    <section className="relative py-20 px-4 bg-[#fcfaf7] overflow-hidden">
      {/* Intricate Islamic Pattern Background (Full Section) */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
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
            <div className="absolute -inset-4 bg-gradient-to-b from-amber-600 to-amber-900 rounded-t-[10rem] opacity-5 blur-2xl" />
            
            {/* The Main Iconic Mihrab Shape Card */}
            <div className="relative bg-white rounded-t-[10rem] rounded-b-[2rem] shadow-[0_30px_70px_rgba(120,53,15,0.12)] border-[8px] border-[#0a0a0a] overflow-hidden min-h-[380px] flex flex-col items-center justify-center">
              
              {/* INTERNAL MOTIF PATTERN - Richer Gold */}
              <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z' fill='%23d97706'/%3E%3C/svg%3E")`,
                backgroundSize: '40px 40px'
              }} />

              {/* Internal Gold Arch Border */}
              <div className="absolute inset-2 border border-amber-500/20 rounded-t-[9rem] rounded-b-[1.2rem] pointer-events-none" />

              {/* Decorative Lanterns (Shorter) */}
              <div className="absolute top-0 left-12 flex flex-col items-center opacity-80">
                <div className="w-px h-16 bg-amber-600/40" />
                <div className="w-8 h-12 bg-[#1a1a1a] rounded-t-full border-2 border-amber-500 flex items-center justify-center relative shadow-lg">
                   <div className="w-3 h-5 bg-amber-400 rounded-full blur-[3px] animate-pulse" />
                </div>
              </div>
              <div className="absolute top-0 right-12 flex flex-col items-center opacity-80">
                <div className="w-px h-24 bg-amber-600/40" />
                <div className="w-8 h-12 bg-[#1a1a1a] rounded-t-full border-2 border-amber-500 flex items-center justify-center relative shadow-lg">
                   <div className="w-3 h-5 bg-amber-400 rounded-full blur-[3px] animate-pulse" />
                </div>
              </div>

              {/* Content Area (More compact) */}
              <div className="px-8 py-14 md:px-16 text-center space-y-8 relative z-20">
                <div className="flex flex-col items-center gap-3">
                  <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black uppercase tracking-[0.4em] shadow-sm">
                    <Quote size={12} className="fill-current" />
                    Mutiara Hadits
                  </div>
                </div>

                <h2 className="text-xl md:text-3xl font-medium text-slate-800 leading-[1.6] font-outfit italic">
                  "{hadith.content}"
                </h2>
                
                <div className="flex flex-col items-center gap-5">
                  <div className="flex items-center gap-2">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400" />
                    <div className="w-1.5 h-1.5 rotate-45 bg-amber-500" />
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400" />
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
