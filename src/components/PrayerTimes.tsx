"use client";

import { useEffect, useState } from "react";
import { Clock, MapPin, Calendar as CalIcon } from "lucide-react";

export default function PrayerTimes() {
  const [times, setTimes] = useState<any>(null);
  const [nextPrayer, setNextPrayer] = useState<string>("");
  const [countdown, setCountdown] = useState<string>("");
  const [dates, setDates] = useState({ gregorian: "", hijri: "", javanese: "" });

  useEffect(() => {
    async function fetchData() {
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0].split('-').join('/');
      
      const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      const formattedGregorian = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

      try {
        const res = await fetch(`https://api.myquran.com/v2/sholat/jadwal/1505/${dateStr}`);
        const data = await res.json();
        
        // Dynamic Hijri Calculation with +1 day adjustment
        const hijriDate = new Intl.DateTimeFormat('id-TN-u-ca-islamic-umalqura-nu-latn', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }).format(new Date(today.getTime() + (24 * 60 * 60 * 1000))); // +1 day adjustment

        if (data.status) {
          const j = data.data.jadwal;
          setTimes(j);
          setDates({
             gregorian: formattedGregorian,
             hijri: hijriDate.replace('H', '').trim() + " H", 
             javanese: getJavaneseDate(today)
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!times) return;
    const interval = setInterval(() => {
      calculateNextPrayer();
    }, 1000);
    return () => clearInterval(interval);
  }, [times]);

  function getJavaneseDate(date: Date) {
    const pasarans = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    
    // Reference: Dec 31, 2023 was Sunday Pahing (Index 1 in pasarans if Sunday is ref)
    // Actually simpler: Total days since epoch % 5
    const baseDate = new Date(1970, 0, 1); // Jan 1, 1970 was Thursday Wage
    const diffDays = Math.floor((date.getTime() - baseDate.getTime()) / (24 * 60 * 60 * 1000));
    
    // Jan 1, 1970 was Wage (Index 3)
    const pasaranIndex = (diffDays + 3) % 5;
    const dayName = days[date.getDay()];
    return `${dayName} ${pasarans[pasaranIndex]}`;
  }

  function calculateNextPrayer() {
    const now = new Date();
    const pOrder = [
      { id: 'subuh', label: 'Subuh' },
      { id: 'dzuhur', label: 'Dzuhur' },
      { id: 'ashar', label: 'Ashar' },
      { id: 'maghrib', label: 'Maghrib' },
      { id: 'isya', label: 'Isya' }
    ];

    let next = null;
    for (let p of pOrder) {
      const [h, m] = times[p.id].split(':').map(Number);
      const pDate = new Date();
      pDate.setHours(h, m, 0);
      if (pDate > now) {
        next = { ...p, time: pDate };
        break;
      }
    }

    if (!next) { // If all passed, next is Subuh tomorrow
      const [h, m] = times.subuh.split(':').map(Number);
      const pDate = new Date();
      pDate.setDate(pDate.getDate() + 1);
      pDate.setHours(h, m, 0);
      next = { ...pOrder[0], time: pDate };
    }

    setNextPrayer(next.id);
    const diff = next.time.getTime() - now.getTime();
    const hh = Math.floor(diff / 3600000).toString().padStart(2, '0');
    const mm = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
    const ss = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
    setCountdown(`${hh}:${mm}:${ss}`);
  }

  const pList = [
    { key: "subuh", label: "Subuh" },
    { key: "terbit", label: "Terbit" },
    { key: "dzuhur", label: "Dzuhur" },
    { key: "ashar", label: "Ashar" },
    { key: "maghrib", label: "Maghrib" },
    { key: "isya", label: "Isya" }
  ];

  return (
    <div className="bg-white border-b border-slate-100 shadow-sm relative z-40">
      <div className="max-w-6xl mx-auto px-4 py-10">
        
        {/* Date Info Bar */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 mb-10 text-slate-500 font-medium">
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
            <CalIcon size={16} className="text-emerald-500" />
            <span className="text-sm">{dates.javanese}, {dates.gregorian}</span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
            <CalIcon size={16} className="text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700">{dates.hijri}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-rose-500" />
            <span className="text-sm font-bold">Yogyakarta</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {times ? pList.map((p) => {
            const isNext = nextPrayer === p.key;
            return (
              <div 
                key={p.key} 
                className={`relative p-6 rounded-[2rem] transition-all duration-500 overflow-hidden ${
                  isNext 
                  ? 'bg-emerald-600 text-white shadow-2xl shadow-emerald-200 scale-105 z-10' 
                  : 'bg-slate-50 text-slate-800 border border-slate-100'
                }`}
              >
                {isNext && (
                   <div className="absolute top-0 right-0 p-2 opacity-20">
                     <Clock size={40} />
                   </div>
                )}
                <div className="space-y-1 relative">
                  <span className={`text-[10px] font-bold uppercase tracking-[0.2em] block ${isNext ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {p.label}
                  </span>
                  <div className="text-2xl md:text-4xl font-bold font-outfit">
                    {times[p.key]}
                  </div>
                  {isNext && (
                    <div className="pt-2 mt-2 border-t border-white/20">
                      <span className="text-[9px] font-bold uppercase block text-emerald-100 opacity-80 mb-1">Menuju {p.label}</span>
                      <span className="text-lg font-mono font-bold">{countdown}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          }) : (
            Array(6).fill(0).map((_, i) => <div key={i} className="h-24 bg-slate-50 rounded-[2rem] animate-pulse" />)
          )}
        </div>
      </div>
    </div>
  );
}
