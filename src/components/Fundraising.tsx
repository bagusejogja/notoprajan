"use client";

import { useEffect, useState } from "react";
import { Target, TrendingUp, HandCoins } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Fundraising() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Demo data for now, could be fetched from Supabase
  const campaign = {
    title: "Renovasi Atap & Plafon",
    target: 75000000,
    collected: 42500000,
    donors: 124,
    deadline: "20 Mei 2024"
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID').format(val);
  };

  const percent = Math.min(100, Math.floor((campaign.collected / campaign.target) * 100));

  if (!hasMounted) return <div className="h-96" />; // Prevent mismatch

  return (
    <section className="py-24 px-4 bg-slate-50" id="fundraising">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-8 text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-600 text-sm font-semibold">
                <Target size={14} />
                <span>Donasi Khusus</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold font-outfit text-slate-900">{campaign.title}</h2>
              <p className="text-slate-500 text-lg">
                Masjid kita sedang membutuhkan perbaikan pada struktur atap yang sudah mulai bocor. Mari berinvestasi untuk rumah Allah di akhirat nanti.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Terkumpul</span>
                <span className="text-2xl font-bold text-emerald-600">Rp {formatIDR(campaign.collected)}</span>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Target</span>
                <span className="text-2xl font-bold text-indigo-950">Rp {formatIDR(campaign.target)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-end text-sm font-bold">
                <span className="text-slate-900">Progres Penggalangan</span>
                <span className="text-emerald-600 text-2xl">{percent}%</span>
              </div>
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-1000"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center py-6 border-y border-slate-100">
               <div className="text-center">
                 <span className="text-[10px] font-bold text-slate-400 uppercase block">Donatur</span>
                 <span className="text-xl font-bold">{campaign.donors} Orang</span>
               </div>
               <div className="h-10 w-[1px] bg-slate-100" />
               <div className="text-center">
                 <span className="text-[10px] font-bold text-slate-400 uppercase block">Batas Waktu</span>
                 <span className="text-xl font-bold">{campaign.deadline}</span>
               </div>
            </div>

            <a 
              href="#donation" 
              className="w-full py-5 bg-indigo-950 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-900 transition-all shadow-lg shadow-indigo-200"
            >
              <HandCoins size={20} />
              Salurkan Donasi Sekarang
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
