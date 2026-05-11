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
    <section className="h-[500px] bg-[#022c22] flex items-center justify-center relative overflow-hidden">
       <div className="absolute inset-0 opacity-10" style={{
         backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l5 15 15 5-15 5-5 15-5-15-15-5 15-5 5-15z' fill='%23ffffff'/%3E%3C/svg%3E")`,
       }} />
       <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin relative z-10" />
    </section>
  );

  if (!hadith) return null;

  return (
    <section className="relative py-24 bg-slate-100 overflow-hidden min-h-[500px] flex items-center">
      {/* BACKGROUND DECORATION (The Side Wings) */}
      <div className="absolute inset-0 flex">
        {/* Left Wing */}
        <div className="w-1/4 bg-[#0a0a0a] relative border-r-4 border-amber-500/50">
          <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l5 15 15 5-15 5-5 15-5-15-15-5 15-5 5-15z' fill='%23d97706'/%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px'
          }} />
          <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-amber-500/20 to-transparent" />
        </div>
        
        {/* Center Space (Empty for the card) */}
        <div className="flex-1 bg-[#f8f5f0]" />
        
        {/* Right Wing */}
        <div className="w-1/4 bg-[#0a0a0a] relative border-l-4 border-amber-500/50">
          <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l5 15 15 5-15 5-5 15-5-15-15-5 15-5 5-15z' fill='%23d97706'/%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px'
          }} />
          <div className="absolute top-0 left-0 bottom-0 w-24 bg-gradient-to-r from-amber-500/20 to-transparent" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full relative z-20 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Main Content Card (The Podium) */}
          <div className="bg-white rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.15)] border-x-8 border-amber-500/10 overflow-hidden relative min-h-[350px] flex items-center justify-center">
            
            {/* Hanging Lanterns (More realistic) */}
            <div className="absolute top-0 left-8 md:left-20 flex flex-col items-center">
              <div className="w-0.5 h-24 bg-amber-600/40" />
              <div className="w-8 h-10 bg-amber-500 rounded-t-full rounded-b-lg border-2 border-amber-300 shadow-lg shadow-amber-500/40" />
            </div>
            <div className="absolute top-0 right-8 md:right-20 flex flex-col items-center">
              <div className="w-0.5 h-32 bg-amber-600/40" />
              <div className="w-8 h-10 bg-amber-600 rounded-t-full rounded-b-lg border-2 border-amber-400 shadow-lg shadow-amber-600/40" />
            </div>

            {/* Hadith Content */}
            <div className="px-8 py-16 md:px-24 text-center space-y-10">
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-[10px] font-black uppercase tracking-[0.4em]">
                  <Quote size={14} className="fill-current" />
                  Mutiara Hadits
                </div>
              </div>

              <h2 className="text-2xl md:text-4xl font-medium text-slate-800 leading-relaxed font-outfit italic">
                "{hadith.content}"
              </h2>
              
              <div className="flex flex-col items-center gap-6">
                <div className="h-0.5 w-16 bg-amber-500/30" />
                <div className="space-y-1">
                  <p className="text-amber-600 font-black tracking-widest uppercase text-xs md:text-sm">
                    {hadith.narrator}
                  </p>
                  <p className="text-slate-400 text-[10px] md:text-xs italic">
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
