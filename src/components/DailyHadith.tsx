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
    <section className="h-64 bg-slate-50 animate-pulse" />
  );

  if (!hadith) return null;

  return (
    <section className="relative py-28 px-4 overflow-hidden bg-slate-50">
      {/* Side Ornaments (Left & Right) */}
      <div className="absolute top-0 left-0 bottom-0 w-1/4 bg-[#0a0a0a] hidden lg:block overflow-hidden">
         <div className="absolute inset-0 opacity-20" style={{
           backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z' fill='%23d97706'/%3E%3C/svg%3E")`,
           backgroundSize: '40px 40px'
         }} />
         <div className="absolute top-0 right-0 bottom-0 w-2 bg-gradient-to-l from-amber-500/50 to-transparent" />
      </div>
      <div className="absolute top-0 right-0 bottom-0 w-1/4 bg-[#0a0a0a] hidden lg:block overflow-hidden">
         <div className="absolute inset-0 opacity-20" style={{
           backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z' fill='%23d97706'/%3E%3C/svg%3E")`,
           backgroundSize: '40px 40px'
         }} />
         <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-r from-amber-500/50 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          {/* Main Content Area: Clean White/Cream */}
          <div className="bg-white rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.1)] border border-amber-100 overflow-hidden relative">
            
            {/* Hanging Lanterns Decoration */}
            <div className="absolute top-0 left-12 w-0.5 h-20 bg-amber-500/30">
               <div className="absolute -bottom-4 -left-3 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-lg">
                 <div className="w-2 h-4 bg-white/50 rounded-sm" />
               </div>
            </div>
            <div className="absolute top-0 right-12 w-0.5 h-32 bg-amber-500/30">
               <div className="absolute -bottom-4 -left-3 w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center text-white shadow-lg">
                 <div className="w-2 h-4 bg-white/50 rounded-sm" />
               </div>
            </div>

            {/* Inner Content */}
            <div className="px-10 py-20 md:px-24 md:py-28 text-center space-y-10">
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-xs font-black uppercase tracking-[0.3em]">
                  <Quote size={14} className="fill-current" />
                  Hadits Hari Ini
                </div>
              </div>

              <h2 className="text-3xl md:text-5xl font-medium text-slate-800 leading-relaxed font-outfit italic">
                "{hadith.content}"
              </h2>
              
              <div className="flex flex-col items-center gap-6 pt-4">
                <div className="flex items-center gap-4 w-32">
                   <div className="h-px flex-1 bg-amber-300" />
                   <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                   <div className="h-px flex-1 bg-amber-300" />
                </div>
                <div className="space-y-1">
                  <p className="text-amber-600 font-black tracking-widest uppercase text-sm">
                    {hadith.narrator}
                  </p>
                  <p className="text-slate-400 text-xs italic">
                    {hadith.source}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Arch Decoration */}
            <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-amber-500/10 to-transparent" />
          </div>

          {/* Decorative Side Wings (Arch feel) */}
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-64 bg-amber-500 rounded-full blur-3xl opacity-10" />
          <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-64 bg-amber-500 rounded-full blur-3xl opacity-10" />
        </motion.div>
      </div>
    </section>
  );
}
