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
          {/* Main Card with Internal Pattern */}
          <div className="relative bg-[#022c22] rounded-[3.5rem] p-10 md:p-20 shadow-[0_30px_60px_rgba(2,44,34,0.2)] overflow-hidden">
            {/* Authentic Islamic Geometric Pattern */}
            <div className="absolute inset-0 opacity-[0.12]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0l5 15 15 5-15 5-5 15-5-15-15-5 15-5 5-15z M0 40l5 15 15 5-15 5-5 15-5-15-15-5 15-5 5-15z M80 40l5 15 15 5-15 5-5 15-5-15-15-5 15-5 5-15z M40 80l5 15 15 5-15 5-5 15-5-15-15-5 15-5 5-15z' fill='%23ffffff'/%3E%3Cpath d='M20 20l3 9 9 3-9 3-3 9-3-9-9-3 9-3 3-9z M60 20l3 9 9 3-9 3-3 9-3-9-9-3 9-3 3-9z M20 60l3 9 9 3-9 3-3 9-3-9-9-3 9-3 3-9z M60 60l3 9 9 3-9 3-3 9-3-9-9-3 9-3 3-9z' fill='%23ffffff'/%3E%3C/svg%3E")`,
              backgroundSize: '100px 100px'
            }} />
            
            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.2),transparent_100%)]" />

            <div className="relative z-10 space-y-10 text-center">
              {/* Top Badge */}
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/10 border border-white/20 text-emerald-400 text-xs font-black uppercase tracking-[0.3em]">
                  <Quote size={14} className="fill-current" />
                  Mutiara Hadits
                </div>
              </div>

              <h2 className="text-2xl md:text-4xl font-medium text-white leading-relaxed font-outfit italic">
                "{hadith.content}"
              </h2>
              
              <div className="flex flex-col items-center gap-6">
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
                <div className="space-y-1">
                  <p className="text-emerald-400 font-black tracking-widest uppercase text-sm">
                    {hadith.narrator}
                  </p>
                  <p className="text-emerald-400/40 text-xs italic">
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
