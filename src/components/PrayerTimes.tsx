"use client";

import { useEffect, useState } from "react";
import { Clock, MapPin } from "lucide-react";

export default function PrayerTimes() {
  const [times, setTimes] = useState<any>(null);

  useEffect(() => {
    async function fetchTimes() {
      const today = new Date().toISOString().split('T')[0].split('-').join('/');
      // ID 1602 is Yogyakarta
      try {
        const res = await fetch(`https://api.myquran.com/v2/sholat/jadwal/1602/${today}`);
        const data = await res.json();
        if (data.status) setTimes(data.data.jadwal);
      } catch (e) {
        console.error(e);
      }
    }
    fetchTimes();
  }, []);

  const pNames = [
    { key: "subuh", label: "Subuh" },
    { key: "terbit", label: "Terbit" },
    { key: "dzuhur", label: "Dzuhur" },
    { key: "ashar", label: "Ashar" },
    { key: "maghrib", label: "Maghrib" },
    { key: "isya", label: "Isya" }
  ];

  return (
    <div className="bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-8">
          {times ? pNames.map((p) => (
            <div key={p.key} className="text-center space-y-1 group">
              <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-emerald-600 transition-colors">
                {p.label}
              </span>
              <div className="text-xl md:text-3xl font-bold text-indigo-950 font-outfit">
                {times[p.key]}
              </div>
            </div>
          )) : (
            <div className="col-span-6 text-center text-slate-400 text-sm animate-pulse flex items-center justify-center gap-2">
              <Clock size={16} /> Memuat jadwal shalat...
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-center items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           <div className="flex items-center gap-2"><MapPin size={12} className="text-emerald-500" /> Yogyakarta</div>
           <div className="flex items-center gap-2"><Clock size={12} className="text-emerald-500" /> {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}</div>
        </div>
      </div>
    </div>
  );
}
