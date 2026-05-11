"use client";

import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
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
        console.log("Fetching hadith...");
        const { data, error } = await supabase
          .from('hadith')
          .select('*')
          .lte('display_date', new Date().toISOString().split('T')[0])
          .order('display_date', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error("Supabase Error:", error.message);
          return;
        }

        if (data) {
          console.log("Hadith found:", data);
          setHadith(data);
        } else {
          // Default fallback
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
    <section className="relative py-24 px-4 overflow-hidden bg-slate-50">
      {/* Islamic Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0l10 30 30 10-30 10-10 30-10-30-30-10 30-10z' fill='%23000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        backgroundSize: '40px 40px'
      }} />
      
      <div className="max-w-4xl mx-auto relative">
        <div className="glass-dark p-8 rounded-[2.5rem] border-white/20 animate-pulse h-48" />
      </div>
    </section>
  );

  if (!hadith) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-20">
      <div className="glass-dark p-8 md:p-10 rounded-[2.5rem] border-white/20 shadow-2xl overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
          <Quote size={80} className="text-emerald-400" />
        </div>
        
        <div className="relative space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-emerald-900/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-100"></span>
            </span>
            Hadits Hari Ini
          </div>
          
          <blockquote className="text-xl md:text-2xl font-medium text-white leading-relaxed font-outfit italic">
            "{hadith.content}"
          </blockquote>
          
          <div className="flex items-center gap-4 pt-4 border-t border-white/10">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
              {hadith.narrator?.[0] || "H"}
            </div>
            <div>
              <div className="text-white font-bold">{hadith.narrator}</div>
              <div className="text-slate-400 text-sm">{hadith.source}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
