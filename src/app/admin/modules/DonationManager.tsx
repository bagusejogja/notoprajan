import { useState, useEffect } from "react";
import { Target, UserPlus, ArrowLeft, Edit2, Trash2, Save, Loader } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface DonationProps {
  canDo: (menuId: string, action: string) => boolean;
}

export default function DonationManager({ canDo }: DonationProps) {
  const [donationList, setDonationList] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [donationLogs, setDonationLogs] = useState<any[]>([]);
  const [editingDonation, setEditingDonation] = useState<any>(null);
  const [editingLog, setEditingLog] = useState<any>(null);
  const [newDonation, setNewDonation] = useState({ title: "", description: "", target_amount: "", current_amount: "0", deadline: "", is_active: true });
  const [newLog, setNewLog] = useState({ donor_name: "", amount: "", via: "BSI", donation_date: new Date().toISOString().split('T')[0] });
  const [bulkLog, setBulkLog] = useState("");

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    const { data } = await supabase.from('donation_campaigns').select('*').order('id', { ascending: false });
    if (data) setDonationList(data);
  };

  const fetchLogs = async (campaignId: number) => {
    const { data } = await supabase.from('donation_logs').select('*').eq('campaign_id', campaignId).order('id', { ascending: false });
    if (data) setDonationLogs(data);
  };

  const handleSaveDonation = async () => {
    const data = editingDonation || newDonation;
    if (!data.title) return alert("Judul wajib diisi");
    const payload = { ...data, target_amount: Number(data.target_amount), current_amount: Number(data.current_amount) };
    if (editingDonation) { await supabase.from('donation_campaigns').update(payload).eq('id', editingDonation.id); setEditingDonation(null); }
    else { await supabase.from('donation_campaigns').insert([payload]); setNewDonation({ title: "", description: "", target_amount: "", current_amount: "0", deadline: "", is_active: true }); }
    fetchDonations();
  };

  const handleSaveLog = async () => {
    const data = editingLog || newLog;
    if (!data.donor_name || !data.amount) return alert("Nama dan Nominal wajib diisi");
    const payload = { ...data, amount: Number(data.amount), campaign_id: selectedCampaign.id };
    if (editingLog) { await supabase.from('donation_logs').update(payload).eq('id', editingLog.id); setEditingLog(null); }
    else { 
      await supabase.from('donation_logs').insert([payload]); 
      // Update current_amount in campaign
      await supabase.from('donation_campaigns').update({ current_amount: Number(selectedCampaign.current_amount) + Number(data.amount) }).eq('id', selectedCampaign.id);
      setNewLog({ donor_name: "", amount: "", via: "BSI", donation_date: new Date().toISOString().split('T')[0] }); 
    }
    fetchLogs(selectedCampaign.id);
    fetchDonations(); // Refresh campaign list to update totals
    // Update selectedCampaign locally to show new total
    if (!editingLog) setSelectedCampaign({ ...selectedCampaign, current_amount: Number(selectedCampaign.current_amount) + Number(data.amount) });
  };

  const handleBulkLog = async () => {
    if (!bulkLog) return alert("Masukkan data donatur!");
    const lines = bulkLog.split('\n');
    let totalAdded = 0;
    const records = lines.map(line => {
      const parts = line.split('|').map(s => s.trim());
      if (!parts[0] || !parts[2]) return null;
      const amt = Number(parts[2]) || 0;
      totalAdded += amt;
      return { donor_name: parts[0], via: parts[1] || "BSI", amount: amt, donation_date: parts[3] || new Date().toISOString().split('T')[0], campaign_id: selectedCampaign.id };
    }).filter(r => r !== null) as any[];
    
    if (records.length > 0) {
      await supabase.from('donation_logs').insert(records);
      await supabase.from('donation_campaigns').update({ current_amount: Number(selectedCampaign.current_amount) + totalAdded }).eq('id', selectedCampaign.id);
      setBulkLog(""); fetchLogs(selectedCampaign.id); fetchDonations();
      setSelectedCampaign({ ...selectedCampaign, current_amount: Number(selectedCampaign.current_amount) + totalAdded });
      alert(`Berhasil mengunggah ${records.length} donatur!`);
    }
  };

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-500">
      {!selectedCampaign ? (
        <>
          <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-emerald-600 flex items-center gap-2">
              <Target size={20} /> {editingDonation ? "Edit Program Donasi" : "Buat Program Donasi Baru"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" value={editingDonation ? editingDonation.title : newDonation.title} onChange={(e) => editingDonation ? setEditingDonation({...editingDonation, title: e.target.value}) : setNewDonation({...newDonation, title: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl outline-none" placeholder="Judul Program" />
              <input type="text" value={editingDonation ? editingDonation.deadline : newDonation.deadline} onChange={(e) => editingDonation ? setEditingDonation({...editingDonation, deadline: e.target.value}) : setNewDonation({...newDonation, deadline: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl outline-none" placeholder="Deadline (Misal: 31 Des 2024)" />
            </div>
            <textarea value={editingDonation ? editingDonation.description : newDonation.description} onChange={(e) => editingDonation ? setEditingDonation({...editingDonation, description: e.target.value}) : setNewDonation({...newDonation, description: e.target.value})} className="w-full bg-slate-50 border p-4 h-24 rounded-xl outline-none" placeholder="Deskripsi program..." />
            <div className="grid grid-cols-2 gap-4">
              <input type="number" value={editingDonation ? editingDonation.target_amount : newDonation.target_amount} onChange={(e) => editingDonation ? setEditingDonation({...editingDonation, target_amount: e.target.value}) : setNewDonation({...newDonation, target_amount: e.target.value})} className="bg-slate-50 border p-4 rounded-xl outline-none" placeholder="Target Donasi (Rp)" />
              <input type="number" value={editingDonation ? editingDonation.current_amount : newDonation.current_amount} onChange={(e) => editingDonation ? setEditingDonation({...editingDonation, current_amount: e.target.value}) : setNewDonation({...newDonation, current_amount: e.target.value})} className="bg-slate-50 border p-4 rounded-xl outline-none" placeholder="Terkumpul Awal (Rp)" />
            </div>
            {((!editingDonation && canDo('donation', 'create')) || (editingDonation && canDo('donation', 'update'))) && (
              <button onClick={handleSaveDonation} className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold shadow-lg transition-transform active:scale-95">Simpan Program</button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {donationList.map(d => (
              <div key={d.id} className="bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-6 relative border-t-4 border-t-emerald-500">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-xl text-slate-800">{d.title}</h3>
                  <div className="flex gap-1">
                     {canDo('donation', 'update') && <button onClick={() => setEditingDonation(d)} className="p-2 text-slate-400 hover:text-indigo-500"><Edit2 size={16}/></button>}
                     {canDo('donation', 'delete') && <button onClick={async () => { if(confirm("Hapus?")){ await supabase.from('donation_campaigns').delete().eq('id', d.id); fetchDonations(); } }} className="p-2 text-slate-400 hover:text-rose-500"><Trash2 size={16}/></button>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-500 bg-slate-50 p-4 rounded-2xl">
                   <div>Target: <span className="text-slate-900 block font-black">Rp {d.target_amount.toLocaleString()}</span></div>
                   <div>Terkumpul: <span className="text-emerald-600 block font-black">Rp {d.current_amount.toLocaleString()}</span></div>
                </div>
                <button onClick={() => { setSelectedCampaign(d); fetchLogs(d.id); }} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 tracking-widest uppercase text-xs hover:bg-emerald-600 transition-all shadow-md">
                  <UserPlus size={18} /> KELOLA DONATUR
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center">
            <button onClick={() => { setSelectedCampaign(null); setEditingLog(null); }} className="flex items-center gap-2 text-slate-500 font-bold hover:text-emerald-600 transition-colors bg-white px-4 py-2 rounded-xl border">
              <ArrowLeft size={20} /> Kembali
            </button>
            <div className="bg-white px-6 py-2 rounded-full border text-xs font-bold text-slate-400">Program: {selectedCampaign.title}</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
              <h3 className="font-bold text-emerald-600 border-b pb-4 flex items-center gap-2">
                {editingLog ? "📝 Edit Donatur" : "📝 Input Donatur Baru"}
              </h3>
              <div className="space-y-4">
                 <input type="text" value={editingLog ? editingLog.donor_name : newLog.donor_name} onChange={(e) => editingLog ? setEditingLog({...editingLog, donor_name: e.target.value}) : setNewLog({...newLog, donor_name: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl outline-none" placeholder="Nama Donatur" />
                 <input type="number" value={editingLog ? editingLog.amount : newLog.amount} onChange={(e) => editingLog ? setEditingLog({...editingLog, amount: e.target.value}) : setNewLog({...newLog, amount: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl outline-none font-bold text-emerald-600" placeholder="Nominal (Rp)" />
                 <select value={editingLog ? editingLog.via : newLog.via} onChange={(e) => editingLog ? setEditingLog({...editingLog, via: e.target.value}) : setNewLog({...newLog, via: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl outline-none">
                   <option value="BSI">BSI</option><option value="QRIS">QRIS</option><option value="Tunai">Tunai</option>
                 </select>
                 <input type="date" value={editingLog ? editingLog.donation_date : newLog.donation_date} onChange={(e) => editingLog ? setEditingLog({...editingLog, donation_date: e.target.value}) : setNewLog({...newLog, donation_date: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl outline-none" />
              </div>
              <div className="flex gap-2">
                 {editingLog && <button onClick={() => setEditingLog(null)} className="flex-1 bg-slate-100 py-4 rounded-xl font-bold">Batal</button>}
                 {((!editingLog && canDo('donation', 'create')) || (editingLog && canDo('donation', 'update'))) && (
                   <button onClick={handleSaveLog} className="flex-[2] bg-emerald-500 text-white py-4 rounded-xl font-bold shadow-lg">Simpan</button>
                 )}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white border rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-[10px] uppercase font-black tracking-widest text-slate-400 border-b">
                  <tr><th className="p-4 text-left">Nama</th><th className="p-4 text-center">Via</th><th className="p-4 text-right">Nominal</th><th className="p-4 text-center">Aksi</th></tr>
                </thead>
                <tbody className="divide-y">
                  {donationLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-4 font-bold">{log.donor_name}</td>
                      <td className="p-4 text-center"><span className="px-2 py-1 bg-slate-100 rounded text-[10px]">{log.via}</span></td>
                      <td className="p-4 text-right font-black text-emerald-600">Rp {log.amount.toLocaleString()}</td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-1">
                           {canDo('donation', 'update') && <button onClick={() => setEditingLog(log)} className="text-indigo-500 p-2"><Edit2 size={16}/></button>}
                           {canDo('donation', 'delete') && <button onClick={async () => { if(confirm("Hapus?")){ await supabase.from('donation_logs').delete().eq('id', log.id); fetchLogs(selectedCampaign.id); } }} className="text-rose-500 p-2"><Trash2 size={16}/></button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {canDo('donation', 'create') && (
            <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
               <h3 className="font-bold mb-2 text-emerald-700">📦 Bulk Upload Donatur</h3>
               <textarea value={bulkLog} onChange={(e) => setBulkLog(e.target.value)} className="w-full bg-white border p-3 rounded-xl h-24 mb-3 outline-none" placeholder="Nama | Via | Nominal | Tanggal" />
               <button onClick={handleBulkLog} className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md">Upload Massal</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
