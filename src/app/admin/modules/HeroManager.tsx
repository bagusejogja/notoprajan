import { useState, useEffect } from "react";
import { ImageIcon, Edit2, Trash2, Loader, Plus, LayoutDashboard, RefreshCcw, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface HeroProps {
  canDo: (menuId: string, action: string) => boolean;
}

export default function HeroManager({ canDo }: HeroProps) {
  const [slides, setSlides] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [editingSlide, setEditingSlide] = useState<any>(null);
  const [newSlide, setNewSlide] = useState({ title: "", subtitle: "", image_url: "", order_priority: 1 });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    // Menggunakan fallback jika order_priority belum ada
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('id', { ascending: false }); // Fallback ke ID jika kolom order_priority belum ada
    
    if (error) {
        console.error("DEBUG SUPABASE ERROR:", error);
        setErrorMsg(error.message);
    }
    if (data) setSlides(data);
    setIsLoading(false);
  };

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "hero");
    try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) {
          if (editingSlide) setEditingSlide({ ...editingSlide, image_url: data.url });
          else setNewSlide({ ...newSlide, image_url: data.url });
        }
    } catch (err) {
        alert("Upload gagal!");
    }
    setIsUploading(false);
  };

  const handleSave = async () => {
    const data = editingSlide || newSlide;
    if (!data.image_url) return alert("Gambar wajib diunggah");
    
    // Kita buat payload tanpa order_priority dulu jika user belum tambah kolomnya
    // Tapi kita coba masukkan saja, jika error user tinggal jalankan SQL
    const payload: any = {
        title: data.title,
        subtitle: data.subtitle,
        image_url: data.image_url
    };
    
    // Hanya masukkan order_priority jika nilainya valid
    if (data.order_priority) payload.order_priority = data.order_priority;

    if (editingSlide) {
      const { error } = await supabase.from('hero_slides').update(payload).eq('id', editingSlide.id);
      if (error) return alert("Gagal update: " + error.message + " (Coba jalankan SQL yang saya berikan)");
      setEditingSlide(null);
    } else {
      const { error } = await supabase.from('hero_slides').insert([payload]);
      if (error) return alert("Gagal tambah: " + error.message + " (Coba jalankan SQL yang saya berikan)");
      setNewSlide({ title: "", subtitle: "", image_url: "", order_priority: 1 });
    }
    fetchSlides();
    alert("Slider berhasil disimpan!");
  };

  return (
    <div className="space-y-12 text-left animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-6">
        <h2 className="text-2xl font-black text-emerald-600 flex items-center gap-2 border-b pb-4">
          <ImageIcon size={28} /> {editingSlide ? "Edit Slider" : "Tambah Slider Baru"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-4">
              <div>
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Judul Utama</label>
                 <input type="text" value={editingSlide ? editingSlide.title : newSlide.title} onChange={(e) => editingSlide ? setEditingSlide({...editingSlide, title: e.target.value}) : setNewSlide({...newSlide, title: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold" placeholder="Teks Besar" />
              </div>
              <div>
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Sub-judul</label>
                 <input type="text" value={editingSlide ? editingSlide.subtitle : newSlide.subtitle} onChange={(e) => editingSlide ? setEditingSlide({...editingSlide, subtitle: e.target.value}) : setNewSlide({...newSlide, subtitle: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-2xl outline-none" placeholder="Teks Kecil" />
              </div>
              <div>
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Urutan Tampil (Opsional)</label>
                 <input type="number" value={editingSlide ? editingSlide.order_priority : newSlide.order_priority} onChange={(e) => editingSlide ? setEditingSlide({...editingSlide, order_priority: Number(e.target.value)}) : setNewSlide({...newSlide, order_priority: Number(e.target.value)})} className="w-full bg-slate-50 border p-4 rounded-2xl outline-none" />
              </div>
           </div>
           <div className="space-y-4">
              <div className="aspect-[21/9] bg-slate-50 rounded-[2rem] border-2 border-dashed flex items-center justify-center relative overflow-hidden">
                 {(editingSlide?.image_url || newSlide.image_url) ? (
                   <img src={editingSlide?.image_url || newSlide.image_url} className="w-full h-full object-cover" />
                 ) : (
                   <ImageIcon size={48} className="text-slate-200" />
                 )}
                 {isUploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader className="animate-spin text-emerald-500" /></div>}
              </div>
              <input type="file" onChange={handleUpload} className="w-full text-xs" />
           </div>
        </div>
        <div className="flex gap-2">
           {editingSlide && <button onClick={() => setEditingSlide(null)} className="flex-1 bg-slate-100 py-4 rounded-2xl font-bold">Batal</button>}
           {((!editingSlide && canDo('hero', 'create')) || (editingSlide && canDo('hero', 'update'))) && (
             <button onClick={handleSave} className="flex-[2] bg-emerald-500 text-white py-4 rounded-2xl font-bold shadow-lg">Simpan Slider</button>
           )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center px-4">
            <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">Daftar Slide Aktif</h3>
            <button onClick={fetchSlides} className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"><RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} /></button>
        </div>

        {errorMsg && (
            <div className="mx-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm">
                <AlertTriangle size={18} />
                <span>Error: <b>{errorMsg}</b>. Mohon jalankan SQL yang saya berikan di atas.</span>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {slides.length === 0 && !isLoading && !errorMsg && (
                <div className="col-span-2 text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 text-slate-300 italic">Belum ada slide aktif.</div>
            )}
            {slides.map(s => (
                <div key={s.id} className="group relative bg-white rounded-[2.5rem] border overflow-hidden shadow-sm aspect-[21/9] hover:border-emerald-500 transition-all">
                    <img src={s.image_url} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end text-white text-left">
                        <h3 className="font-black text-2xl mb-1">{s.title}</h3>
                        <p className="text-sm opacity-80 font-light">{s.subtitle}</p>
                        <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            {canDo('hero', 'update') && <button onClick={() => { setEditingSlide(s); window.scrollTo({top:0, behavior:'smooth'}); }} className="p-3 bg-white text-indigo-600 rounded-2xl shadow-xl hover:bg-indigo-600 hover:text-white transition-all"><Edit2 size={18}/></button>}
                            {canDo('hero', 'delete') && <button onClick={async () => { if(confirm("Hapus?")){ await supabase.from('hero_slides').delete().eq('id', s.id); fetchSlides(); } }} className="p-3 bg-white text-rose-500 rounded-2xl shadow-xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={18}/></button>}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
