import { useState, useEffect } from "react";
import { ImageIcon, Trash2, Loader, Upload, Edit2, Save, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface GalleryProps {
  canDo: (menuId: string, action: string) => boolean;
}

export default function GalleryManager({ canDo }: GalleryProps) {
  const [galleryList, setGalleryList] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    const { data } = await supabase.from('gallery').select('*').order('id', { ascending: false });
    if (data) setGalleryList(data);
  };

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "gallery");
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) {
      await supabase.from('gallery').insert([{ title: newTitle || "Kegiatan Masjid", image_url: data.url }]);
      setNewTitle("");
      fetchGallery();
    }
    setIsUploading(false);
  };

  const handleUpdateTitle = async () => {
    if (!editingItem) return;
    await supabase.from('gallery').update({ title: editingItem.title }).eq('id', editingItem.id);
    setEditingItem(null);
    fetchGallery();
    alert("Judul berhasil diperbarui");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus foto ini?")) return;
    await supabase.from('gallery').delete().eq('id', id);
    fetchGallery();
  };

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-500">
      {/* MODAL EDIT JUDUL */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl space-y-6">
              <div className="flex justify-between items-center">
                 <h3 className="font-black text-xl text-slate-800">Edit Judul Foto</h3>
                 <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
              </div>
              <div className="space-y-4">
                 <img src={editingItem.image_url} className="w-full aspect-video object-cover rounded-2xl border" />
                 <input type="text" value={editingItem.title} onChange={(e) => setEditingItem({...editingItem, title: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20" />
              </div>
              <button onClick={handleUpdateTitle} className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                 <Save size={20}/> Simpan Perubahan
              </button>
           </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-emerald-600 flex items-center gap-2">
          <ImageIcon size={20} /> Tambah Foto Kegiatan
        </h2>
        <div className="space-y-4">
          <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full bg-slate-50 border p-4 rounded-xl outline-none" placeholder="Judul / Keterangan Foto" />
          <div className="flex items-center gap-4">
            <label className="flex-1 cursor-pointer bg-slate-50 border-2 border-dashed border-slate-200 p-8 rounded-2xl flex flex-col items-center hover:bg-slate-100 transition-colors">
              <ImageIcon className="text-slate-400 mb-2" />
              <span className="text-sm text-slate-500">{isUploading ? "Mengunggah..." : "Klik untuk Pilih Foto"}</span>
              <input type="file" onChange={handleUpload} className="hidden" disabled={isUploading || !canDo('gallery', 'create')} />
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {galleryList.map(item => (
          <div key={item.id} className="group relative bg-white rounded-3xl border overflow-hidden shadow-sm aspect-square">
            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <p className="text-white text-xs font-bold mb-2 line-clamp-2">{item.title}</p>
              <div className="flex gap-1">
                 {canDo('gallery', 'update') && (
                    <button onClick={() => setEditingItem(item)} className="flex-1 py-2 bg-white/20 backdrop-blur-md text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-white/40">
                       <Edit2 size={12} /> Edit
                    </button>
                 )}
                 {canDo('gallery', 'delete') && (
                    <button onClick={() => handleDelete(item.id)} className="flex-1 py-2 bg-rose-500/80 backdrop-blur-md text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-rose-600">
                       <Trash2 size={12} /> Hapus
                    </button>
                 )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
