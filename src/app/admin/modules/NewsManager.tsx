import { useState, useEffect, useRef } from "react";
import { Newspaper, Edit2, Trash2, Save, Upload, Bold, Italic, List, Heading2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface NewsProps {
  canDo: (menuId: string, action: string) => boolean;
}

export default function NewsManager({ canDo }: NewsProps) {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [editingNews, setEditingNews] = useState<any>(null);
  const [newNews, setNewNews] = useState({ title: "", content: "", category: "Kajian", image_url: "", author: "Admin" });
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    if (data) setNewsList(data);
  };

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "news");
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) {
      if (editingNews) setEditingNews({ ...editingNews, image_url: data.url });
      else setNewNews({ ...newNews, image_url: data.url });
    }
    setIsUploading(false);
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    syncContent();
  };

  const syncContent = () => {
    if (editorRef.current) {
        const html = editorRef.current.innerHTML;
        if (editingNews) setEditingNews(prev => ({...prev, content: html}));
        else setNewNews(prev => ({...prev, content: html}));
    }
  };

  const handleSave = async () => {
    const content = editorRef.current?.innerHTML || "";
    const data = editingNews ? { ...editingNews, content } : { ...newNews, content };
    
    if (!data.title) return alert("Judul wajib diisi");
    
    if (editingNews) { 
      await supabase.from('news').update(data).eq('id', editingNews.id); 
      setEditingNews(null);
    } else { 
      await supabase.from('news').insert([data]); 
      setNewNews({ title: "", content: "", category: "Kajian", image_url: "", author: "Admin" });
      if (editorRef.current) editorRef.current.innerHTML = "";
    }
    fetchNews();
    alert("Berita berhasil disimpan!");
  };

  const startEdit = (n: any) => {
    setEditingNews(n);
    setTimeout(() => {
        if (editorRef.current) editorRef.current.innerHTML = n.content;
    }, 100);
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-500">
      <style>{`
        .news-editor-content ul { list-style-type: disc !important; padding-left: 2rem !important; margin: 1rem 0; }
        .news-editor-content h2 { font-size: 1.5rem !important; font-weight: 800 !important; margin: 1.5rem 0 0.5rem 0; color: #1e293b; }
        .news-editor-content p { margin-bottom: 0.75rem; }
      `}</style>

      <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-6">
        <h2 className="text-xl font-black text-emerald-600 flex items-center gap-2">
          <Newspaper size={20} /> {editingNews ? "Edit Berita" : "Tulis Berita Baru"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
             <input type="text" value={editingNews ? editingNews.title : newNews.title} onChange={(e) => editingNews ? setEditingNews({...editingNews, title: e.target.value}) : setNewNews({...newNews, title: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl outline-none font-bold text-lg" placeholder="Judul Berita" />
             
             {/* TOOLBAR */}
             <div className="flex gap-1 p-2 bg-slate-100 rounded-t-xl border border-b-0 sticky top-0 z-10">
                <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('bold'); }} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-colors" title="Tebal"><Bold size={16}/></button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('italic'); }} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-colors" title="Miring"><Italic size={16}/></button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('insertUnorderedList'); }} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-colors" title="Daftar Bullet"><List size={16}/></button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('formatBlock', '<h2>'); }} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-colors" title="Judul Besar"><Heading2 size={16}/></button>
             </div>
             
             {/* EDITOR */}
             <div 
                ref={editorRef}
                contentEditable
                onInput={syncContent}
                className="news-editor-content w-full bg-white border p-4 rounded-b-xl min-h-[300px] outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all overflow-y-auto"
             />
          </div>
          <div className="space-y-4">
             <select value={editingNews ? editingNews.category : newNews.category} onChange={(e) => editingNews ? setEditingNews({...editingNews, category: e.target.value}) : setNewNews({...newNews, category: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl outline-none font-medium">
                <option value="Kajian">Kajian</option>
                <option value="Berita">Berita Masjid</option>
                <option value="Pengumuman">Pengumuman</option>
             </select>
             <div className="aspect-video bg-slate-50 rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 flex items-center justify-center relative shadow-inner">
                {(editingNews?.image_url || newNews.image_url) ? (
                  <img src={editingNews?.image_url || newNews.image_url} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center opacity-30">
                    <Upload className="mx-auto mb-2" size={32} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Gambar Utama</span>
                  </div>
                )}
             </div>
             <input type="file" onChange={handleUpload} className="w-full text-xs bg-slate-50 p-2 rounded-lg border mt-2" />
          </div>
        </div>
        <div className="flex gap-2">
           {editingNews && <button onClick={() => { setEditingNews(null); if(editorRef.current) editorRef.current.innerHTML = ""; }} className="flex-1 bg-slate-100 py-4 rounded-xl font-bold">Batal</button>}
           {((!editingNews && canDo('news', 'create')) || (editingNews && canDo('news', 'update'))) && (
             <button onClick={handleSave} className="flex-[2] bg-emerald-500 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-emerald-600 transition-all uppercase tracking-widest">Simpan Berita</button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsList.map(n => (
          <div key={n.id} className="bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col group hover:border-emerald-500 transition-all">
            <div className="h-40 bg-slate-100 relative">
              <img src={n.image_url || "https://images.unsplash.com/photo-1542831371-29b0f74f9713"} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">{n.category}</span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-800 line-clamp-2 mb-2 leading-tight">{n.title}</h3>
                <div className="text-[10px] text-slate-400 line-clamp-3 italic news-editor-content" dangerouslySetInnerHTML={{ __html: n.content }} />
              </div>
              <div className="flex justify-between items-center pt-4 border-t mt-4">
                <span className="text-[10px] font-bold text-slate-400">{new Date(n.created_at).toLocaleDateString('id-ID')}</span>
                <div className="flex gap-1">
                   {canDo('news', 'update') && <button onClick={() => startEdit(n)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 size={16}/></button>}
                   {canDo('news', 'delete') && <button onClick={async () => { if(confirm("Hapus?")){ await supabase.from('news').delete().eq('id', n.id); fetchNews(); } }} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={16}/></button>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
