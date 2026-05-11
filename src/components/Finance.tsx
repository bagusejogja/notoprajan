"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Finance() {
  const [finance, setFinance] = useState<any[]>([]);
  const [stats, setStats] = useState({ income: 0, expense: 0, balance: 0 });

  useEffect(() => {
    async function fetchFinance() {
      const { data } = await supabase
        .from('finance_reports')
        .select('*');
      
      if (data) {
        const income = data.filter(f => f.type === 'income').reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
        const expense = data.filter(f => f.type === 'expense').reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
        setStats({ income, expense, balance: income - expense });
        setFinance(data);
      }
    }
    fetchFinance();
  }, []);

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-sm font-semibold">
              <Wallet size={14} />
              <span>Transparansi</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-outfit text-indigo-950">Laporan Keuangan</h2>
            <p className="text-slate-500 max-w-md">
              Amanah jamaah adalah prioritas kami. Seluruh laporan keuangan dapat diakses secara transparan.
            </p>
          </div>
          
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-indigo-950 hover:bg-slate-50 transition-all shadow-sm">
            Lihat Mutasi Bulanan
            <ChevronRight size={16} className="text-emerald-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white mb-4">
                  <TrendingUp size={24} />
                </div>
                <div className="text-sm text-emerald-600 font-bold mb-1">Total Pemasukan</div>
                <div className="text-2xl font-bold text-slate-900 font-outfit">Rp {stats.income.toLocaleString('id-ID')}</div>
              </div>
              
              <div className="p-6 rounded-3xl bg-rose-50 border border-rose-100">
                <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center text-white mb-4">
                  <TrendingDown size={24} />
                </div>
                <div className="text-sm text-rose-600 font-bold mb-1">Total Pengeluaran</div>
                <div className="text-2xl font-bold text-slate-900 font-outfit">Rp {stats.expense.toLocaleString('id-ID')}</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-indigo-950 rounded-[3rem] p-8 md:p-12 text-white overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                    <Wallet size={24} className="text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">Saldo Kas Saat Ini</div>
                    <div className="text-4xl font-bold font-outfit">Rp {stats.balance.toLocaleString('id-ID')}</div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10">
                   <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4">Amanah Jamaah</h4>
                   <p className="text-slate-400 text-sm leading-relaxed italic">
                     "Harta tidak akan berkurang karena sedekah." (HR. Muslim)
                   </p>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Update Terakhir</span>
                    <span className="text-slate-300 font-medium">{new Date().toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
