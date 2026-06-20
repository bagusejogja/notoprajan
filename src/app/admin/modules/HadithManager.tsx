import { useState, useEffect } from "react";
import { Quote, Edit2, Trash2, Save, BookOpen, Calendar, Upload, Download } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface HadithProps {
  canDo: (menuId: string, action: string) => boolean;
}

export default function HadithManager({ canDo }: HadithProps) {
  const [hadithList, setHadithList] = useState<any[]>([]);
  const [editingHadith, setEditingHadith] = useState<any>(null);
  const [showBulk, setShowBulk] = useState(false);
  const [bulkData, setBulkData] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [newHadith, setNewHadith] = useState({ 
    title: "", content: "", quran_verse: "", source: "", 
    display_date: new Date().toISOString().split('T')[0], is_active: true 
  });

  useEffect(() => {
    fetchHadith();
  }, []);

  const fetchHadith = async () => {
    const { data } = await supabase.from('hadith').select('*').order('display_date', { ascending: false });
    if (data) setHadithList(data);
  };

  const handleSave = async () => {
    const data = editingHadith || newHadith;
    if (!data.content) return alert("Konten Hadits wajib diisi");
    
    if (editingHadith) {
      await supabase.from('hadith').update(data).eq('id', editingHadith.id);
      setEditingHadith(null);
    } else {
      await supabase.from('hadith').insert([data]);
      setNewHadith({ 
        title: "", content: "", quran_verse: "", source: "", 
        display_date: new Date().toISOString().split('T')[0], is_active: true 
      });
    }
    fetchHadith();
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
            // Pastikan field wajib ada
            if (!obj.display_date) obj.display_date = new Date().toISOString().split('T')[0];
            return obj;
        });

        const { error } = await supabase.from('hadith').insert(dataToInsert);
        if (error) throw error;
        
        alert(`Berhasil mengimpor ${dataToInsert.length} data!`);
        setBulkData("");
        setShowBulk(false);
        fetchHadith();
    } catch (err: any) {
        alert("Gagal Impor: " + err.message);
    }
    setIsImporting(false);
  };

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800">Manajemen Hadits & Ayat <span className="text-[10px] text-slate-300 font-normal">v2.0</span></h2>
        <button onClick={() => setShowBulk(!showBulk)} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
            <Upload size={20} /> Bulk Import CSV
        </button>
      </div>

      {showBulk && (
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-indigo-100 shadow-xl space-y-6 animate-in slide-in-from-top duration-300">
           <div className="flex justify-between items-start">
              <div>
                 <h3 className="text-xl font-bold text-indigo-600">Bulk Import via CSV</h3>
                 <p className="text-xs text-slate-400 mt-1">Gunakan koma (,) sebagai pemisah. Baris pertama harus Header.</p>
              </div>
              <div className="text-[10px] font-mono bg-slate-50 p-3 rounded-xl border">
                 Format: display_date, title, content, quran_verse, source
              </div>
           </div>
           <textarea 
              value={bulkData} 
              onChange={(e) => setBulkData(e.target.value)}
              className="w-full h-48 bg-slate-50 border p-4 rounded-2xl font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
              placeholder="display_date,title,content,quran_verse,source&#10;2026-05-20,Sabar,Sabar adalah...,Innallaha maasobirin,HR. Bukhari"
           />
           <div className="flex gap-2">
              <button onClick={() => setShowBulk(false)} className="flex-1 bg-slate-100 py-4 rounded-xl font-bold">Batal</button>
              <button onClick={handleBulkImport} disabled={isImporting} className="flex-[2] bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50">
                 {isImporting ? "Memproses..." : "Mulai Impor Sekarang"}
              </button>
           </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-emerald-600 flex items-center gap-2">
          <Quote size={20} /> {editingHadith ? "Edit Konten" : "Tambah Satuan"}
        </h3>
        <div className="space-y-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                 <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Tanggal Tampil</label>
                 <input type="date" value={editingHadith ? editingHadith.display_date : newHadith.display_date} onChange={(e) => editingHadith ? setEditingHadith({...editingHadith, display_date: e.target.value}) : setNewHadith({...newHadith, display_date: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl mt-1 font-bold text-emerald-600" />
              </div>
              <div>
                 <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Judul / Tema</label>
                 <input type="text" value={editingHadith ? editingHadith.title : newHadith.title} onChange={(e) => editingHadith ? setEditingHadith({...editingHadith, title: e.target.value}) : setNewHadith({...newHadith, title: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl mt-1" placeholder="Tema hari ini..." />
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                 <label className="text-[10px] font-bold uppercase text-emerald-600 ml-2 font-black flex items-center gap-1"><BookOpen size={10}/> Ayat Al-Quran (Opsional)</label>
                 <textarea value={editingHadith ? editingHadith.quran_verse : newHadith.quran_verse} onChange={(e) => editingHadith ? setEditingHadith({...editingHadith, quran_verse: e.target.value}) : setNewHadith({...newHadith, quran_verse: e.target.value})} className="w-full bg-emerald-50/30 border-emerald-100 border p-4 rounded-xl mt-1 h-32" placeholder="Tuliskan ayat Al-Quran..." />
              </div>
              <div>
                 <label className="text-[10px] font-bold uppercase text-indigo-600 ml-2 font-black flex items-center gap-1"><Quote size={10}/> Hadits Harian</label>
                 <textarea value={editingHadith ? editingHadith.content : newHadith.content} onChange={(e) => editingHadith ? setEditingHadith({...editingHadith, content: e.target.value}) : setNewHadith({...newHadith, content: e.target.value})} className="w-full bg-indigo-50/30 border-indigo-100 border p-4 rounded-xl mt-1 h-32" placeholder="Tuliskan hadits hari ini..." />
              </div>
           </div>
           <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Riwayat / Sumber</label>
              <input type="text" value={editingHadith ? editingHadith.source : newHadith.source} onChange={(e) => editingHadith ? setEditingHadith({...editingHadith, source: e.target.value}) : setNewHadith({...newHadith, source: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl mt-1" placeholder="HR. Bukhari & Muslim" />
           </div>
        </div>
        <div className="flex gap-2">
           {editingHadith && <button onClick={() => setEditingHadith(null)} className="flex-1 bg-slate-100 py-4 rounded-xl font-bold">Batal</button>}
           {((!editingHadith && canDo('hadith', 'create')) || (editingHadith && canDo('hadith', 'update'))) && (
             <button onClick={handleSave} className="flex-[2] bg-emerald-500 text-white py-4 rounded-xl font-bold shadow-lg">Simpan Konten</button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {hadithList.map(h => (
          <div key={h.id} className="bg-white p-6 rounded-2xl border shadow-sm flex justify-between items-start gap-4 hover:border-emerald-200 transition-all">
            <div className="flex-1">
               <div className="flex items-center gap-2 mb-2">
                  <Calendar size={12} className="text-emerald-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(h.display_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-4"># {h.title || "Tanpa Judul"}</span>
               </div>
               {h.quran_verse && <div className="p-3 bg-emerald-50 rounded-xl mb-3 text-sm italic border border-emerald-100">"{h.quran_verse}"</div>}
               <div className="text-sm text-slate-600 leading-relaxed mb-2">"{h.content}"</div>
               <div className="text-[10px] font-bold text-slate-400">— {h.source || "Anonim"}</div>
            </div>
            <div className="flex gap-1">
               {canDo('hadith', 'update') && <button onClick={() => setEditingHadith(h)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg"><Edit2 size={16}/></button>}
               {canDo('hadith', 'delete') && <button onClick={async () => { if(confirm("Hapus?")){ await supabase.from('hadith').delete().eq('id', h.id); fetchHadith(); } }} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={16}/></button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
