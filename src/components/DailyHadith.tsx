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
    <section className="relative py-28 px-4 overflow-hidden bg-[#022c22]">
      {/* Intricate Islamic Geometric Pattern */}
      <div className="absolute inset-0 opacity-[0.08]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0l10 35h35l-28 22 10 35-27-21-27 21 10-35-28-22h35z' fill='%23ffffff'/%3E%3C/svg%3E")`,
        backgroundSize: '120px 120px'
      }} />
      
      {/* Emerald Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.15),transparent_75%)]" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          {/* Decorative Corner Ornaments */}
          <div className="absolute -top-8 -left-8 w-24 h-24 border-t-2 border-l-2 border-emerald-400/20 rounded-tl-[4rem] hidden md:block" />
          <div className="absolute -bottom-8 -right-8 w-24 h-24 border-b-2 border-r-2 border-emerald-400/20 rounded-br-[4rem] hidden md:block" />

          {/* Premium Glass Card */}
          <div className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[3.5rem] p-10 md:p-20 shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden">
            {/* Subtle Gold Inner Glow */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(217,176,82,0.03)_50%,transparent_75%)]" />

            {/* Floating Top Label */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex items-center gap-3 px-8 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-[0.4em] shadow-inner">
                <Quote size={14} className="fill-current animate-pulse" />
                Hadits Hari Ini
              </div>
            </div>

            <div className="space-y-10 text-center relative">
              <h2 className="text-2xl md:text-5xl font-medium text-emerald-50 leading-[1.4] font-outfit italic tracking-wide">
                "{hadith.content}"
              </h2>
              
              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-4 w-full">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-emerald-500/30" />
                  <div className="w-2 h-2 rounded-full bg-emerald-400/40 rotate-45" />
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-emerald-500/30" />
                </div>
                
                <div className="space-y-1">
                  <p className="text-emerald-400 font-black tracking-[0.2em] uppercase text-sm">
                    {hadith.narrator}
                  </p>
                  <p className="text-emerald-400/40 text-xs font-medium italic">
                    {hadith.source}
                  </p>
                </div>
              </div>
            </div>

            {/* Aesthetic Ornament at bottom */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 opacity-30">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 scale-125 mx-1" />
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
