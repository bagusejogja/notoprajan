import { useState, useEffect } from "react";
import { Wallet, Edit2, Trash2, Save, ArrowUpCircle, ArrowDownCircle, PieChart } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface FinanceProps {
  canDo: (menuId: string, action: string) => boolean;
}

export default function FinanceManager({ canDo }: FinanceProps) {
  const [financeList, setFinanceList] = useState<any[]>([]);
  const [newFinance, setNewFinance] = useState({ title: "", report_date: new Date().toISOString().split('T')[0], total_income: "", total_expenditure: "", category: "Kas Masjid" });
  const [editingFinance, setEditingFinance] = useState<any>(null);
  const [bulkFinance, setBulkFinance] = useState("");

  useEffect(() => {
    fetchFinance();
  }, []);

  const fetchFinance = async () => {
    const { data } = await supabase.from('financial_reports').select('*').order('report_date', { ascending: false });
    if (data) setFinanceList(data);
  };

  const handleSaveFinance = async () => {
    const data = editingFinance || newFinance;
    if (!data.title) return alert("Judul wajib diisi");
    const payload = { title: data.title, report_date: data.report_date, total_income: Number(data.total_income) || 0, total_expenditure: Number(data.total_expenditure) || 0, category: data.category };
    if (editingFinance) { await supabase.from('financial_reports').update(payload).eq('id', editingFinance.id); setEditingFinance(null); }
    else { await supabase.from('financial_reports').insert([payload]); setNewFinance({ title: "", report_date: new Date().toISOString().split('T')[0], total_income: "", total_expenditure: "", category: "Kas Masjid" }); }
    fetchFinance();
  };

  const handleBulkFinance = async () => {
    if (!bulkFinance) return alert("Masukkan data keuangan!");
    const lines = bulkFinance.split('\n');
    const records = lines.map(line => {
      const parts = line.split('|').map(s => s.trim());
      if (!parts[0] || !parts[1]) return null;
      return { 
        title: parts[1], 
        report_date: parts[0], 
        total_income: Number(parts[2]) || 0, 
        total_expenditure: Number(parts[3]) || 0, 
        category: parts[4] || "Kas Masjid" 
      };
    }).filter(r => r !== null) as any[];
    if (records.length > 0) {
      await supabase.from('financial_reports').insert(records);
      setBulkFinance(""); fetchFinance(); alert(`Berhasil mengunggah ${records.length} laporan keuangan!`);
    }
  };

  const totalIncome = financeList.reduce((acc, curr) => acc + (Number(curr.total_income) || 0), 0);
  const totalExpenditure = financeList.reduce((acc, curr) => acc + (Number(curr.total_expenditure) || 0), 0);
  const balance = totalIncome - totalExpenditure;

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-500">
      {/* FINANCE SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1 flex items-center gap-1">
                <ArrowUpCircle size={12}/> Total Pemasukan
              </div>
              <div className="text-3xl font-black text-slate-800 font-outfit">Rp {totalIncome.toLocaleString()}</div>
            </div>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-1 flex items-center gap-1">
                <ArrowDownCircle size={12}/> Total Pengeluaran
              </div>
              <div className="text-3xl font-black text-slate-800 font-outfit">Rp {totalExpenditure.toLocaleString()}</div>
            </div>
         </div>
         <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-xl flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-1 flex items-center gap-1">
                <PieChart size={12}/> Saldo Kas Aktif
              </div>
              <div className="text-3xl font-black font-outfit">Rp {balance.toLocaleString()}</div>
            </div>
         </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border space-y-4 shadow-sm">
        <h2 className="text-xl font-bold text-emerald-600 flex items-center gap-2">
          <Wallet size={20} /> Input Laporan Keuangan
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" value={editingFinance ? editingFinance.title : newFinance.title} onChange={(e) => editingFinance ? setEditingFinance({...editingFinance, title: e.target.value}) : setNewFinance({...newFinance, title: e.target.value})} className="bg-slate-50 border p-4 rounded-xl outline-none" placeholder="Keterangan (Infaq Jumat, dll)" />
          <input type="date" value={editingFinance ? editingFinance.report_date : newFinance.report_date} onChange={(e) => editingFinance ? setEditingFinance({...editingFinance, report_date: e.target.value}) : setNewFinance({...newFinance, report_date: e.target.value})} className="bg-slate-50 border p-4 rounded-xl outline-none" />
          <input type="number" value={editingFinance ? editingFinance.total_income : newFinance.total_income} onChange={(e) => editingFinance ? setEditingFinance({...editingFinance, total_income: e.target.value}) : setNewFinance({...newFinance, total_income: e.target.value})} className="bg-slate-50 border p-4 rounded-xl outline-none" placeholder="Pemasukan (Rp)" />
          <input type="number" value={editingFinance ? editingFinance.total_expenditure : newFinance.total_expenditure} onChange={(e) => editingFinance ? setEditingFinance({...editingFinance, total_expenditure: e.target.value}) : setNewFinance({...newFinance, total_expenditure: e.target.value})} className="bg-slate-50 border p-4 rounded-xl outline-none" placeholder="Pengeluaran (Rp)" />
        </div>
        {((!editingFinance && canDo('finance', 'create')) || (editingFinance && canDo('finance', 'update'))) && (
          <button onClick={handleSaveFinance} className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold shadow-lg transition-transform active:scale-95">Simpan Laporan</button>
        )}
      </div>

      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
         <table className="w-full text-sm">
           <thead className="bg-slate-50 font-bold border-b text-[10px] uppercase tracking-widest text-slate-400">
             <tr>
               <th className="p-4 text-left">Tanggal</th>
               <th className="p-4 text-left">Keterangan</th>
               <th className="p-4 text-right text-emerald-600">Masuk</th>
               <th className="p-4 text-right text-rose-500">Keluar</th>
               <th className="p-4 text-center">Aksi</th>
             </tr>
           </thead>
           <tbody className="divide-y">
              {financeList.map(f => (
                <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">{f.report_date}</td>
                  <td className="p-4 font-bold">{f.title}</td>
                  <td className="p-4 text-right text-emerald-600">Rp {f.total_income.toLocaleString()}</td>
                  <td className="p-4 text-right text-rose-500">Rp {f.total_expenditure.toLocaleString()}</td>
                  <td className="p-4 text-center">
                     <div className="flex justify-center gap-1">
                        {canDo('finance', 'update') && <button onClick={() => setEditingFinance(f)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg"><Edit2 size={16}/></button>}
                        {canDo('finance', 'delete') && <button onClick={async () => { if(confirm("Hapus?")){ await supabase.from('financial_reports').delete().eq('id', f.id); fetchFinance(); } }} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={16}/></button>}
                     </div>
                  </td>
                </tr>
              ))}
           </tbody>
         </table>
      </div>
      
      {canDo('finance', 'create') && (
         <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
            <h3 className="font-bold mb-2 text-emerald-700 flex items-center gap-2">📦 Bulk Upload Keuangan</h3>
            <p className="text-[10px] text-emerald-600 mb-2 uppercase font-bold">Format: Tanggal (YYYY-MM-DD) | Keterangan | Nominal Masuk | Nominal Keluar | Kategori</p>
            <textarea value={bulkFinance} onChange={(e) => setBulkFinance(e.target.value)} className="w-full bg-white border p-3 rounded-xl h-24 mb-3 outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="2024-12-25 | Infaq Jumat | 1500000 | 0 | Kas Masjid" />
            <button onClick={handleBulkFinance} className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-emerald-700 transition-colors">Upload Massal</button>
         </div>
      )}
    </div>
  );
}
