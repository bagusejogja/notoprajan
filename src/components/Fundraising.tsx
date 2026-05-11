"use client";

import { useEffect, useState } from "react";
import { Target, TrendingUp, HandCoins, Quote, Users, Calendar, Wallet } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Fundraising() {
  const [hasMounted, setHasMounted] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    setHasMounted(true);
    async function fetchData() {
      // Safe Fetch: Get all campaigns and filter/sort in JS to avoid 400 errors
      const { data: campaignData, error } = await supabase
        .from('donation_campaigns')
        .select('*');
      
      if (campaignData && campaignData.length > 0) {
        // Filter and sort in JS
        const activeCampaigns = campaignData
          .filter((c: any) => c.is_active !== false)
          .sort((a, b) => (b.created_at || b.id) - (a.created_at || a.id));

        // For each campaign, fetch logs
        const enrichedCampaigns = await Promise.all(activeCampaigns.map(async (c) => {
          const { data: logs } = await supabase
            .from('donation_logs')
            .select('*')
            .eq('campaign_id', c.id)
            .order('donation_date', { ascending: false })
            .limit(5);
          
          const { count } = await supabase
            .from('donation_logs')
            .select('*', { count: 'exact', head: true })
            .eq('campaign_id', c.id);
            
          return { ...c, logs: logs || [], donorCount: count || 0 };
        }));
        setCampaigns(enrichedCampaigns);
      }
    }
    fetchData();
  }, []);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID').format(val || 0);
  };

  if (!hasMounted || campaigns.length === 0) return null;

  return (
    <section className="py-24 px-4 bg-[#022c22] relative overflow-hidden" id="donasi">
      {/* BACKGROUND ORNAMENT */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-24">
        {campaigns.map((campaign, idx) => {
          const percent = Math.min(100, Math.floor((campaign.current_amount / campaign.target_amount) * 100));
          
          return (
            <div key={campaign.id} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start border-b border-white/5 pb-24 last:border-0 last:pb-0">
              
              {/* LEFT CONTENT: THE MESSAGE */}
              <div className="lg:col-span-7 space-y-10 text-left">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-black uppercase tracking-[0.2em]">
                    <Target size={14} className="animate-pulse" />
                    <span>Sodakoh Jariyah #{idx + 1}</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black font-outfit text-white leading-tight uppercase tracking-tight">
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">
                      {campaign.title}
                    </span>
                  </h2>
                  
                  <div className="bg-emerald-950/50 border-l-4 border-amber-500 p-6 rounded-2xl relative group">
                    <Quote className="absolute -top-4 -right-4 text-amber-500 opacity-20" size={60} />
                    <p className="text-emerald-50 text-lg italic leading-relaxed">
                       "{campaign.description || "Mari berinvestasi untuk rumah Allah di akhirat nanti."}"
                    </p>
                  </div>
                </div>

                {/* QUICK STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-amber-500"><Users size={24} /></div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-emerald-500/60 tracking-widest">Donatur</div>
                        <div className="text-xl font-bold text-white">{campaign.donorCount} Orang</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-amber-500"><Calendar size={24} /></div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-emerald-500/60 tracking-widest">Deadline</div>
                        <div className="text-xl font-bold text-white">{campaign.deadline || "Open"}</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-amber-500"><TrendingUp size={24} /></div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-emerald-500/60 tracking-widest">Progres</div>
                        <div className="text-xl font-bold text-white">{percent}%</div>
                      </div>
                   </div>
                </div>

                {/* RECENT DONORS TABLE */}
                <div className="bg-emerald-950/40 rounded-[2rem] border border-white/5 p-8 space-y-6">
                   <div className="flex justify-between items-center">
                      <h3 className="text-white font-bold text-xl font-outfit">Pencatatan Donatur</h3>
                      <HandCoins size={24} className="text-amber-500" />
                   </div>
                   <div className="overflow-hidden">
                      <table className="w-full text-left">
                         <thead className="text-[10px] uppercase font-black text-emerald-500/40 border-b border-white/5">
                            <tr><th className="pb-4">Nama Donatur</th><th className="pb-4 text-center">Via</th><th className="pb-4 text-right">Nominal</th></tr>
                         </thead>
                         <tbody className="divide-y divide-white/5">
                            {campaign.logs.length > 0 ? campaign.logs.map((donor: any) => (
                               <tr key={donor.id} className="group hover:bg-white/5 transition-colors">
                                  <td className="py-4 font-bold text-emerald-50">{donor.donor_name}<div className="text-[9px] font-medium text-emerald-500/50 uppercase">{donor.donation_date}</div></td>
                                  <td className="py-4 text-center"><span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-black">{donor.via}</span></td>
                                  <td className="py-4 text-right font-black text-amber-500">Rp {formatIDR(donor.amount)}</td>
                               </tr>
                            )) : (
                               <tr><td colSpan={3} className="py-8 text-center text-emerald-500/20 italic text-sm">Belum ada donasi masuk</td></tr>
                            )}
                         </tbody>
                      </table>
                   </div>
                </div>
              </div>

              {/* RIGHT CONTENT: THE PROGRESS & ACCOUNT */}
              <div className="lg:col-span-5 relative group sticky top-32">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/50 to-emerald-500/50 rounded-[3rem] blur opacity-25" />
                <div className="relative bg-[#043d31] p-10 rounded-[3rem] border border-white/10 shadow-2xl space-y-10">
                  <div className="space-y-6 text-center">
                    <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase text-amber-500 tracking-[0.3em]">Target Donasi</span>
                      <div className="text-4xl md:text-5xl font-black font-outfit text-white">Rp {formatIDR(campaign.target_amount)}</div>
                    </div>
                    <div className="space-y-4">
                       <div className="h-4 w-full bg-emerald-950/50 rounded-full p-1 border border-white/5">
                          <div className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 rounded-full" style={{ width: `${percent}%` }} />
                       </div>
                       <div className="flex justify-between text-[11px] font-black uppercase text-emerald-200/40 tracking-widest">
                          <span>Terkumpul: Rp {formatIDR(campaign.current_amount)}</span>
                          <span>{percent}% Selesai</span>
                       </div>
                    </div>
                  </div>
                  <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="w-full py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl flex items-center justify-center gap-3">
                    <HandCoins size={20} /> Berdonasi Sekarang
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}
