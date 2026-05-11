"use client";

import { useEffect, useState } from "react";
import { Heart, CreditCard, QrCode } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Donation() {
  const [settings, setSettings] = useState<any>({ bank_name: "BSI", account_number: "-", account_name: "Masjid Notoprajan", qris_url: "" });
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    async function fetchInfo() {
      // Safe Fetch: Get all settings and map manually
      const { data } = await supabase.from('mosque_settings').select('*');
      if (data) {
        const info: any = {};
        data.forEach(item => { 
          const k = item.key || item.setting_key || item.name;
          const v = item.value || item.setting_value;
          if (['bank_name', 'account_number', 'account_name', 'qris_url'].includes(k)) {
            info[k] = v;
          }
        });
        setSettings(prev => ({ ...prev, ...info }));
      }
    }
    fetchInfo();
  }, []);

  return (
    <section className="py-24 px-4 bg-[#022c22] relative overflow-hidden" id="donation">
      <div className="absolute inset-0 bg-gradient-to-br from-[#022c22] to-[#043d31] opacity-90" />
      
      <div className="max-w-4xl mx-auto relative text-center space-y-12">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-6">
            <Heart size={32} fill="currentColor" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white font-outfit">Sedekah Jariyah</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Satu kebaikan yang Anda tanam hari ini, akan menjadi peneduh di hari esok. Salurkan donasi Anda untuk operasional dan kemakmuran masjid.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass p-8 rounded-[2rem] space-y-6 text-left group hover:bg-white/15 transition-all">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white">
              <QrCode size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Donasi via QRIS</h3>
              <p className="text-slate-400 text-sm">Scan kode QR di bawah menggunakan aplikasi pembayaran apapun.</p>
            </div>
            <div className="bg-white p-4 rounded-2xl w-48 h-48 mx-auto md:mx-0 flex items-center justify-center">
               {settings.qris_url ? (
                 <img src={settings.qris_url} alt="QRIS" className="w-full h-full object-contain" />
               ) : (
                 <QrCode size={64} className="text-slate-200" />
               )}
            </div>
          </div>

          <div className="glass p-8 rounded-[2rem] space-y-6 text-left group hover:bg-white/15 transition-all">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white">
              <CreditCard size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Transfer Bank</h3>
              <p className="text-slate-400 text-sm">Gunakan detail rekening di bawah ini untuk transfer langsung.</p>
            </div>
            <div className="space-y-4 pt-4">
              <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                <div className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">{settings.bank_name}</div>
                <div className="text-xl font-bold text-white tracking-wide">
                  {settings.account_number}
                  <div className="text-sm font-medium text-slate-400 mt-1 uppercase text-emerald-400">
                    A.N {settings.account_name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-slate-500 text-sm italic">
          "Perumpamaan orang yang menginfakkan hartanya di jalan Allah seperti sebutir biji yang menumbuhkan tujuh tangkai, pada setiap tangkai ada seratus biji." (Al-Baqarah: 261)
        </p>
      </div>
    </section>
  );
}
