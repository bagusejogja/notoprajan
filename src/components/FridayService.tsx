"use client";

import { useEffect, useState } from "react";
import { BookOpen, User, Clock, Calendar, Quote, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function FridayService() {
  const [friday, setFriday] = useState<any>(null);

  useEffect(() => {
    async function fetchFriday() {
      const { data } = await supabase
        .from('friday_schedules')
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(1)
        .single();
      
      if (data) setFriday(data);
    }
    fetchFriday();
  }, []);

  if (!friday || !friday.kotib) return null;

  return (
    <section className="py-24 px-4 bg-slate-50" id="kegiatan">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-slate-100 flex flex-col lg:flex-row">
          
          {/* LEFT: TITLE & DECORATION */}
          <div className="lg:w-1/3 bg-emerald-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
             <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                   <BookOpen size={32} />
                </div>
                <h2 className="text-4xl font-black font-outfit uppercase tracking-tight leading-none">
                   Jadwal<br />Shalat Jumat
                </h2>
                <div className="h-1 w-12 bg-white/40 rounded-full" />
                <p className="text-emerald-50 text-sm font-medium opacity-80 leading-relaxed">
                   Informasi petugas dan materi khutbah shalat Jumat di Masjid Notoprajan.
                </p>
             </div>
             
             <div className="relative z-10 pt-12">
                <div className="flex items-center gap-3 text-sm font-bold text-emerald-100 uppercase tracking-widest">
                   <Calendar size={18} />
                   <span>{new Date(friday.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
             </div>
          </div>

          {/* RIGHT: DETAILS */}
          <div className="lg:w-2/3 p-12 space-y-10 text-left">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                
                {/* PREACHER */}
                <div className="space-y-4">
                   <div className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.3em]">Khotib & Imam</div>
                   <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                         <User size={28} />
                      </div>
                      <div>
                         <h3 className="text-2xl font-bold text-slate-900">{friday.kotib}</h3>
                         <p className="text-slate-500 text-sm">Hafidzahullahu Ta'ala</p>
                      </div>
                   </div>
                </div>

                {/* THEME */}
                <div className="space-y-4">
                   <div className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.3em]">Tema Khutbah</div>
                   <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                         <Quote size={28} />
                      </div>
                      <div>
                         <h3 className="text-xl font-bold text-slate-900 leading-tight">"{friday.tema || "Meningkatkan Ketaqwaan di Era Digital"}"</h3>
                      </div>
                   </div>
                </div>

             </div>

             <div className="h-px w-full bg-slate-100" />

             {/* OTHER OFFICIALS */}
             <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div className="space-y-1">
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Imam Cadangan</div>
                   <div className="font-bold text-slate-700">{friday.imam || "-"}</div>
                </div>
                <div className="space-y-1">
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Muadzin</div>
                   <div className="font-bold text-slate-700">{friday.muadzin || "-"}</div>
                </div>
                <div className="space-y-1">
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Waktu</div>
                   <div className="font-bold text-slate-700 flex items-center gap-2">
                      <Clock size={14} className="text-emerald-500" />
                      11:55 WIB
                   </div>
                </div>
             </div>

             {/* LOCATION INFO */}
             <div className="bg-slate-50 p-6 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <MapPin size={20} className="text-emerald-500" />
                   <span className="text-sm font-bold text-slate-600">Lantai Utama & Selasar Masjid</span>
                </div>
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Notoprajan Yogyakarta</div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
