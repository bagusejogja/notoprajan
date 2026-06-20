import { useState, useEffect } from "react";
import { BookOpen, Edit2, Trash2, Save, Calendar, User, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface FridayProps {
  canDo: (menuId: string, action: string) => boolean;
}

export default function FridayManager({ canDo }: FridayProps) {
  const [fridayList, setFridayList] = useState<any[]>([]);
  const [editingFriday, setEditingFriday] = useState<any>(null);
  const [showBulk, setShowBulk] = useState(false);
  const [bulkData, setBulkData] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const getNextFriday = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = (day <= 5) ? (5 - day) : (6 + (5 - day) + 1);
    d.setDate(d.getDate() + diff);
    return d.toISOString().split('T')[0];
  };

  const [newFriday, setNewFriday] = useState({ 
    khotib: "", imam: "", muadzin: "", date: getNextFriday() 
  });

  useEffect(() => {
    fetchFriday();
  }, []);

  const fetchFriday = async () => {
    const { data } = await supabase.from('friday_schedules').select('*').order('date', { ascending: false });
    if (data) setFridayList(data);
  };

  const handleSave = async () => {
    const data = editingFriday || newFriday;
    if (!data.khotib) return alert("Nama Khotib wajib diisi");
    
    const payload = {
        date: data.date,
        khotib: data.khotib,
        imam: data.imam,
        muadzin: data.muadzin
    };

    if (editingFriday) { 
      const { error } = await supabase.from('friday_schedules').update(payload).eq('id', editingFriday.id); 
      if (error) alert("Error update: " + error.message);
      setEditingFriday(null);
    } else { 
      const { error } = await supabase.from('friday_schedules').insert([payload]); 
      if (error) alert("Error insert: " + error.message);
      setNewFriday({ khotib: "", imam: "", muadzin: "", date: getNextFriday() });
    }
    fetchFriday();
  };

  const handleBulkImport = async () => {
    if (!bulkData.trim()) return alert("Masukkan data CSV terlebih dahulu");
    setIsImporting(true);
    try {
        const rows = bulkData.split('\n').filter(row => row.trim() !== "");
        const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
        const dataToInsert = rows.slice(1).map(row => {
            const values = row.split(',').map(v => v.trim());
            const obj: any = {};
            headers.forEach((header, index) => {
                obj[header] = values[index] || "";
            });
            return obj;
        });

        const { error } = await supabase.from('friday_schedules').insert(dataToInsert);
        if (error) throw error;
        
        alert(`Berhasil mengimpor ${dataToInsert.length} jadwal Jumat!`);
        setBulkData("");
        setShowBulk(false);
        fetchFriday();
    } catch (err: any) {
        alert("Gagal Impor: " + err.message);
    }
    setIsImporting(false);
  };

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800">Jadwal Jumat <span className="text-[10px] text-slate-300 font-normal">v2.0</span></h2>
        <button onClick={() => setShowBulk(!showBulk)} className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all">
            <Upload size={20} /> Bulk Import Jadwal
        </button>
      </div>

      {showBulk && (
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-emerald-100 shadow-xl space-y-6 animate-in slide-in-from-top duration-300">
           <div className="flex justify-between items-start">
              <div>
                 <h3 className="text-xl font-bold text-emerald-600">Bulk Import Jadwal Jumat</h3>
                 <p className="text-xs text-slate-400 mt-1">Baris pertama harus Header. Pisahkan dengan koma (,).</p>
              </div>
              <div className="text-[10px] font-mono bg-slate-50 p-3 rounded-xl border">
                 Format: date, khotib, imam, muadzin
              </div>
           </div>
           <textarea 
              value={bulkData} 
              onChange={(e) => setBulkData(e.target.value)}
              className="w-full h-48 bg-slate-50 border p-4 rounded-2xl font-mono text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="date,khotib,imam,muadzin&#10;2026-05-22,Ustadz Ahmad,Ustadz Ali,Bilal Syakur"
           />
           <div className="flex gap-2">
              <button onClick={() => setShowBulk(false)} className="flex-1 bg-slate-100 py-4 rounded-xl font-bold">Batal</button>
              <button onClick={handleBulkImport} disabled={isImporting} className="flex-[2] bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50">
                 {isImporting ? "Memproses..." : "Import Semua Jadwal"}
              </button>
           </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-emerald-600 flex items-center gap-2">
          <BookOpen size={20} /> {editingFriday ? "Edit Jadwal" : "Tambah Jadwal Satuan"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Tanggal Jumat</label>
              <input type="date" value={editingFriday ? editingFriday.date : newFriday.date} onChange={(e) => editingFriday ? setEditingFriday({...editingFriday, date: e.target.value}) : setNewFriday({...newFriday, date: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl mt-1 font-bold" />
           </div>
           <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Nama Khotib</label>
              <input type="text" value={editingFriday ? editingFriday.khotib : newFriday.khotib} onChange={(e) => editingFriday ? setEditingFriday({...editingFriday, khotib: e.target.value}) : setNewFriday({...newFriday, khotib: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl mt-1 font-bold" placeholder="Ustadz / Kiai..." />
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Imam Shalat</label>
                 <input type="text" value={editingFriday ? editingFriday.imam : newFriday.imam} onChange={(e) => editingFriday ? setEditingFriday({...editingFriday, imam: e.target.value}) : setNewFriday({...newFriday, imam: e.target.value})} className="bg-slate-50 border p-4 rounded-xl mt-1 w-full" placeholder="Imam" />
              </div>
              <div>
                 <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Muadzin</label>
                 <input type="text" value={editingFriday ? editingFriday.muadzin : newFriday.muadzin} onChange={(e) => editingFriday ? setEditingFriday({...editingFriday, muadzin: e.target.value}) : setNewFriday({...newFriday, muadzin: e.target.value})} className="bg-slate-50 border p-4 rounded-xl mt-1 w-full" placeholder="Muadzin" />
              </div>
           </div>
        </div>
        <div className="flex gap-2">
           {editingFriday && <button onClick={() => setEditingFriday(null)} className="flex-1 bg-slate-100 py-4 rounded-xl font-bold">Batal</button>}
           {((!editingFriday && canDo('friday', 'create')) || (editingFriday && canDo('friday', 'update'))) && (
             <button onClick={handleSave} className="flex-[2] bg-emerald-500 text-white py-4 rounded-xl font-bold shadow-lg">Simpan Jadwal</button>
           )}
        </div>
      </div>

      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
         <table className="w-full text-sm">
            <thead className="bg-slate-50 text-[10px] uppercase font-black tracking-widest text-slate-400 border-b">
               <tr>
                  <th className="p-4 text-left">Tanggal</th>
                  <th className="p-4 text-left">Khotib</th>
                  <th className="p-4 text-left">Imam & Muadzin</th>
                  <th className="p-4 text-center">Aksi</th>
               </tr>
            </thead>
            <tbody className="divide-y">
               {fridayList.map(f => (
                  <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                     <td className="p-4 font-medium flex items-center gap-2"><Calendar size={14} className="text-emerald-500"/> {new Date(f.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                     <td className="p-4 font-bold">{f.khotib}</td>
                     <td className="p-4 text-xs text-slate-500">Imam: {f.imam} | Muadzin: {f.muadzin}</td>
                     <td className="p-4 text-center">
                        <div className="flex justify-center gap-1">
                           {canDo('friday', 'update') && <button onClick={() => setEditingFriday(f)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg"><Edit2 size={16}/></button>}
                           {canDo('friday', 'delete') && <button onClick={async () => { if(confirm("Hapus?")){ await supabase.from('friday_schedules').delete().eq('id', f.id); fetchFriday(); } }} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={16}/></button>}
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}
