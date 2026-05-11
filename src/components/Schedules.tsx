"use client";

import { useEffect, useState } from "react";
import { Calendar, User, Clock, Mic2, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Schedules() {
  const [studies, setStudies] = useState<any[]>([]);
  const [friday, setFriday] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const today = new Date().toISOString().split('T')[0];

      // Fetch upcoming studies
      const { data: studyData } = await supabase
        .from('study_schedules')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(3);
      if (studyData) setStudies(studyData);

      // Fetch next friday
      const { data: fridayData } = await supabase
        .from('friday_schedules')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(1)
        .single();
      if (fridayData) setFriday(fridayData);
    }
    fetchData();
  }, []);

  function getFullJavaneseDate(dateStr: string) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const pasarans = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    
    const baseDate = new Date(1970, 0, 1);
    const diffDays = Math.floor((date.getTime() - baseDate.getTime()) / (24 * 60 * 60 * 1000));
    const pasaran = pasarans[(diffDays + 3) % 5];
    
    return `${days[date.getDay()]} ${pasaran}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  return (
    <section className="py-24 px-4 bg-slate-50" id="kegiatan">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* JADWAL JUMAT */}
          <div className="lg:col-span-1 space-y-8">
            <div className="space-y-2 text-left">
              <h2 className="text-3xl font-bold font-outfit text-indigo-950">Jadwal Jumat</h2>
              <p className="text-slate-500 text-sm">Petugas shalat jumat pekan ini.</p>
            </div>

            <div className="bg-[#022c22] rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Calendar size={120} />
              </div>
              
              <div className="relative space-y-8">
                <div className="bg-emerald-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-full w-fit uppercase tracking-widest">
                  {friday ? getFullJavaneseDate(friday.date) : "Memuat..."}
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                      <User size={20} className="text-emerald-400" />
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Khotib</span>
                      <span className="text-xl font-bold">{friday?.khotib || "-"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                      <User size={20} className="text-emerald-400" />
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Imam</span>
                      <span className="text-xl font-bold">{friday?.imam || "-"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                      <Mic2 size={20} className="text-emerald-400" />
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Muadzin</span>
                      <span className="text-xl font-bold">{friday?.muadzin || "-"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AGENDA KAJIAN */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex justify-between items-end">
              <div className="space-y-2 text-left">
                <h2 className="text-3xl font-bold font-outfit text-indigo-950">Agenda Kajian</h2>
                <p className="text-slate-500 text-sm">Jadwal tholabul 'ilmi rutin dan tematik.</p>
              </div>
              <a href="#kegiatan" className="flex items-center gap-2 text-emerald-600 font-bold text-sm hover:gap-3 transition-all">
                Lihat Semua <ArrowRight size={16} />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studies.length > 0 ? studies.map((s) => (
                <div key={s.id} className="bg-[#043d31] p-8 rounded-[2.5rem] border border-emerald-900/50 shadow-sm hover:shadow-xl transition-all group text-left space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-900/50 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      <Clock size={24} />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-200/50 uppercase tracking-widest">
                      {s.time} WIB
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white leading-tight">{s.title}</h3>
                    <p className="text-emerald-100/70 flex items-center gap-2 text-sm font-medium">
                      <User size={14} className="text-emerald-400" />
                      {s.speaker}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-emerald-900/50 flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
                    <Calendar size={14} />
                    {getFullJavaneseDate(s.date)}
                  </div>
                </div>
              )) : (
                <div className="col-span-2 py-12 text-center bg-[#043d31] rounded-3xl border border-dashed border-emerald-900/50 text-emerald-100/50 italic">
                  Belum ada jadwal kajian terbaru.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
