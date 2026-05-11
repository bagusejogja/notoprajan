"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, User, MapPin, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Schedules() {
  const [studies, setStudies] = useState<any[]>([]);
  const [friday, setFriday] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: s } = await supabase.from('study_schedules').select('*').gte('date', new Date().toISOString().split('T')[0]).order('date', { ascending: true }).limit(3);
      const { data: f } = await supabase.from('friday_schedules').select('*').gte('date', new Date().toISOString().split('T')[0]).order('date', { ascending: true }).limit(1).single();
      if (s) setStudies(s);
      if (f) setFriday(f);
    }
    fetchData();
  }, []);

  return (
    <section className="py-24 px-4 bg-slate-50" id="kegiatan">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Friday Schedule Card */}
          <div className="lg:col-span-1">
            <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white h-full shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative space-y-6">
                <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full w-fit text-xs font-bold uppercase tracking-wider">
                  <Calendar size={12} />
                  <span>Jadwal Jumat</span>
                </div>
                
                {friday ? (
                  <div className="space-y-6 text-left">
                    <div>
                      <h3 className="text-3xl font-bold font-outfit mb-1">{new Date(friday.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
                      <p className="text-emerald-100 text-sm">Masjid Notoparaja Yogyakarta</p>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                          <User size={20} className="text-emerald-200" />
                        </div>
                        <div>
                          <p className="text-[10px] text-emerald-200 font-bold uppercase tracking-widest">Khotib</p>
                          <p className="font-bold">{friday.khotib}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                          <User size={20} className="text-emerald-200" />
                        </div>
                        <div>
                          <p className="text-[10px] text-emerald-200 font-bold uppercase tracking-widest">Imam</p>
                          <p className="font-bold">{friday.imam}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-emerald-100 italic">Jadwal Jumat belum diupdate.</p>
                )}
              </div>
            </div>
          </div>

          {/* Study Schedules */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex justify-between items-end px-4 text-left">
              <div className="space-y-1">
                <h2 className="text-3xl font-bold font-outfit text-slate-900">Agenda Kajian</h2>
                <p className="text-slate-500 text-sm">Perdalam ilmu agama bersama ustadz pilihan.</p>
              </div>
              <button className="text-emerald-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                Semua Jadwal <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studies.length > 0 ? studies.map((s) => (
                <div key={s.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 hover:border-emerald-500/50 hover:shadow-xl transition-all group text-left">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {new Date(s.date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                      </div>
                      <span className="text-xs font-bold text-emerald-500">{s.time}</span>
                    </div>
                    <h3 className="font-bold text-slate-800 line-clamp-2 group-hover:text-emerald-600 transition-colors">{s.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <User size={14} className="text-emerald-500" />
                      <span>{s.speaker}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-2 py-12 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                   <p className="text-slate-400 italic">Belum ada jadwal kajian terbaru.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
