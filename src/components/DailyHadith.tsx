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
    <section className="h-64 bg-[#022c22] animate-pulse" />
  );

  if (!hadith) return null;

  return (
    <section className="relative py-24 px-4 bg-white overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Main Card: Luxury Mandala Design */}
          <div className="relative bg-[#0a0a0a] rounded-[4rem] p-12 md:p-24 shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden border border-amber-900/20">
            
            {/* Large Central Mandala Pattern */}
            <div className="absolute inset-0 opacity-[0.15] flex items-center justify-center pointer-events-none">
              <svg width="600" height="600" viewBox="0 0 200 200" className="animate-[spin_120s_linear_infinite]">
                <path fill="url(#goldGradient)" d="M100 0c-55.2 0-100 44.8-100 100s44.8 100 100 100 100-44.8 100-100-44.8-100-100-100zm0 190c-49.7 0-90-40.3-90-90s40.3-90 90-90 90 40.3 90 90-40.3 90-90 90z"/>
                <path fill="url(#goldGradient)" d="M100 20c-44.1 0-80 35.9-80 80s35.9 80 80 80 80-35.9 80-80-35.9-80-80-80zm0 140c-33.1 0-60-26.9-60-60s26.9-60 60-60 60 26.9 60 60-26.9 60-60 60z"/>
                <path fill="url(#goldGradient)" d="M100 40c-33.1 0-60 26.9-60 60s26.9 60 60 60 60-26.9 60-60-26.9-60-60-60zm0 100c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40z"/>
                <defs>
                  <radialGradient id="goldGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#78350f" />
                  </radialGradient>
                </defs>
                {[0,45,90,135,180,225,270,315].map(deg => (
                  <g key={deg} transform={`rotate(${deg} 100 100)`}>
                    <path fill="url(#goldGradient)" d="M100 10l5 15h-10zM100 180l5 15h-10z" />
                    <circle fill="url(#goldGradient)" cx="100" cy="50" r="2" />
                  </g>
                ))}
              </svg>
            </div>
            
            {/* Decorative Side Borders (Inspired by reference) */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 md:w-8 h-3/4 bg-gradient-to-b from-transparent via-amber-500/20 to-transparent border-r border-amber-500/30 rounded-r-full" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 md:w-8 h-3/4 bg-gradient-to-b from-transparent via-amber-500/20 to-transparent border-l border-amber-500/30 rounded-l-full" />

            {/* Subtle Gold Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,119,6,0.05),transparent_70%)]" />

            <div className="relative z-10 space-y-12 text-center">
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-3 px-8 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-black uppercase tracking-[0.4em]">
                  <Quote size={16} className="fill-current" />
                  Mutiara Hadits
                </div>
              </div>

              <h2 className="text-3xl md:text-5xl font-medium text-amber-50 leading-[1.4] font-outfit italic drop-shadow-2xl">
                "{hadith.content}"
              </h2>
              
              <div className="flex flex-col items-center gap-6">
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                <div className="space-y-2">
                  <p className="text-amber-500 font-black tracking-[0.3em] uppercase text-sm">
                    {hadith.narrator}
                  </p>
                  <p className="text-amber-500/40 text-xs italic">
                    {hadith.source}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
