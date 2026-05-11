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
    <section className="h-[400px] bg-[#022c22] flex items-center justify-center relative overflow-hidden">
       <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </section>
  );

  if (!hadith) return null;

  return (
    <section className="relative py-24 px-4 bg-[#fcfaf7] overflow-hidden">
      {/* Soft Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0l5 35h35l-28 22 10 35-27-21-27 21 10-35-28-22h35z' fill='%2378350f'/%3E%3C/svg%3E")`,
        backgroundSize: '120px 120px'
      }} />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          {/* THE MIHRAB CONTAINER (Highly Refined) */}
          <div className="relative mx-auto max-w-xl">
            {/* Soft Shadow Glow */}
            <div className="absolute -inset-6 bg-amber-600/10 rounded-t-[10rem] opacity-20 blur-3xl" />
            
            {/* The Main Iconic Mihrab Shape Card */}
            <div className="relative bg-[#fffdfa] rounded-t-[10rem] rounded-b-[3rem] shadow-[0_40px_80px_rgba(120,53,15,0.1)] border-[10px] border-[#111] overflow-hidden min-h-[420px] flex flex-col items-center justify-center group">
              
              {/* LUXURY GOLD FOIL MOTIF */}
              <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0l5 15 15 5-15 5-5 15-5-15-15-5 15-5 5-15z M0 40l5 15 15 5-15 5-5 15-5-15-15-5 15-5 5-15z M80 40l5 15 15 5-15 5-5 15-5-15-15-5 15-5 5-15z M40 80l5 15 15 5-15 5-5 15-5-15-15-5 15-5 5-15z' fill='%23d97706'/%3E%3C/svg%3E")`,
                backgroundSize: '100px 100px'
              }} />

              {/* Internal Arch Frame - Double Gold Line */}
              <div className="absolute inset-2 border-[1.5px] border-amber-500/30 rounded-t-[9.2rem] rounded-b-[2.2rem] pointer-events-none" />
              <div className="absolute inset-4 border-[0.5px] border-amber-500/10 rounded-t-[8.8rem] rounded-b-[2rem] pointer-events-none" />

              {/* Hanging Lanterns (More Aesthetic) */}
              <div className="absolute top-0 left-10 flex flex-col items-center">
                <div className="w-[0.5px] h-20 bg-gradient-to-b from-transparent via-amber-600/40 to-amber-600" />
                <div className="w-8 h-12 bg-amber-900 rounded-t-full border border-amber-400/50 flex items-center justify-center relative shadow-lg">
                   <div className="w-3 h-5 bg-amber-400 rounded-full blur-[4px] animate-pulse" />
                   <div className="absolute -top-1 w-2 h-2 bg-amber-400 rounded-full" />
                </div>
              </div>
              <div className="absolute top-0 right-10 flex flex-col items-center">
                <div className="w-[0.5px] h-32 bg-gradient-to-b from-transparent via-amber-600/40 to-amber-600" />
                <div className="w-8 h-12 bg-amber-900 rounded-t-full border border-amber-400/50 flex items-center justify-center relative shadow-lg">
                   <div className="w-3 h-5 bg-amber-400 rounded-full blur-[4px] animate-pulse" />
                   <div className="absolute -top-1 w-2 h-2 bg-amber-400 rounded-full" />
                </div>
              </div>

              {/* Hadith Content Area */}
              <div className="px-10 py-16 md:px-16 text-center space-y-10 relative z-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-amber-500 rounded-full blur-xl opacity-20" />
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-700 rounded-full flex items-center justify-center text-white shadow-xl relative border-2 border-white/20">
                      <Quote size={24} className="fill-current drop-shadow-md" />
                    </div>
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-800/60 flex items-center gap-2">
                    <span className="h-px w-4 bg-amber-800/20" />
                    Mutiara Hadits
                    <span className="h-px w-4 bg-amber-800/20" />
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-medium text-slate-900 leading-[1.6] font-outfit italic tracking-wide">
                  "{hadith.content}"
                </h2>
                
                <div className="flex flex-col items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500/40" />
                    <div className="w-2 h-2 rotate-45 bg-amber-600 shadow-[0_0_10px_rgba(217,119,6,0.5)]" />
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500/40" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-amber-700 font-black tracking-[0.3em] uppercase text-xs">
                      {hadith.narrator}
                    </p>
                    <p className="text-slate-400 text-[10px] italic font-medium">
                      {hadith.source}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Gold Base Accent */}
              <div className="absolute bottom-0 inset-x-0 h-2 bg-gradient-to-r from-transparent via-amber-600/50 to-transparent" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
