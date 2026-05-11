"use client";

import { useState, useEffect } from "react";
import { 
  Quote, Newspaper, ShoppingBag, Wallet, Settings,
  Plus, Save, Trash2, Calendar, Clock, Upload, LogOut,
  Image as ImageIcon, Video, Users, BookOpen, Edit2, Target, MessageCircle
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("hadith");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // --- 0. CLOUDFLARE UPLOAD UTILITY ---
  const handleFileUpload = async (file: File, folder: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    return data.url;
  };

  // --- 1. HERO SLIDES LOGIC ---
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [newSlide, setNewSlide] = useState({ title: "", subtitle: "", image_url: "", order_index: 0 });
  const [editingSlide, setEditingSlide] = useState<any>(null);
  
  const fetchHeroSlides = async () => {
    const { data } = await supabase.from('hero_slides').select('*').order('order_index', { ascending: true });
    if (data) setHeroSlides(data);
  };

  const onHeroUpload = async (e: any) => {
    setIsUploading(true);
    const url = await handleFileUpload(e.target.files[0], "hero");
    if (url) {
      if (editingSlide) {
        setEditingSlide({ ...editingSlide, image_url: url });
      } else {
        setNewSlide({ ...newSlide, image_url: url });
      }
    }
    setIsUploading(false);
  };

  const handleSaveSlide = async () => {
    const slideData = editingSlide || newSlide;
    if (!slideData.title || !slideData.image_url) return alert("Pilih Foto & Isi Judul!");
    
    if (editingSlide) {
      await supabase.from('hero_slides').update(editingSlide).eq('id', editingSlide.id);
      setEditingSlide(null);
    } else {
      await supabase.from('hero_slides').insert([newSlide]);
      setNewSlide({ title: "", subtitle: "", image_url: "", order_index: heroSlides.length + 1 });
    }
    fetchHeroSlides();
  };

  // --- 2. GALLERY LOGIC ---
  const [galleryList, setGalleryList] = useState<any[]>([]);
  const [newGallery, setNewGallery] = useState({ title: "", image_url: "" });

  const fetchGallery = async () => {
    const { data } = await supabase.from('gallery').select('*').order('id', { ascending: false });
    if (data) setGalleryList(data);
  };

  const onGalleryUpload = async (e: any) => {
    setIsUploading(true);
    const url = await handleFileUpload(e.target.files[0], "gallery");
    if (url) {
      await supabase.from('gallery').insert([{ title: e.target.files[0].name.split('.')[0], image_url: url }]);
      fetchGallery();
    }
    setIsUploading(false);
  };

  // --- 3. HADITH LOGIC ---
  const [hadithList, setHadithList] = useState<any[]>([]);
  const [newHadith, setNewHadith] = useState({ content: "", narrator: "", date: new Date().toISOString().split('T')[0] });
  
  const fetchHadiths = async () => {
    const { data } = await supabase.from('hadith').select('*').order('display_date', { ascending: false });
    if (data) setHadithList(data);
  };

  // --- 4. NEWS LOGIC ---
  const [newsList, setNewsList] = useState<any[]>([]);
  const [newNews, setNewNews] = useState({ title: "", category: "Kajian", content: "", image_url: "" });

  const fetchNews = async () => {
    const { data } = await supabase.from('news').select('*').order('id', { ascending: false });
    if (data) setNewsList(data);
  };

  const onNewsUpload = async (e: any) => {
    setIsUploading(true);
    const url = await handleFileUpload(e.target.files[0], "news");
    if (url) setNewNews({ ...newNews, image_url: url });
    setIsUploading(false);
  };

  // ... Finance, Schedules, etc. ...
  const [financeList, setFinanceList] = useState<any[]>([]);
  const fetchFinance = async () => {
    const { data } = await supabase.from('finance_reports').select('*').order('date', { ascending: false });
    if (data) setFinanceList(data);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchHadiths(); fetchHeroSlides(); fetchGallery(); fetchNews(); fetchFinance();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-slate-900">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 w-full max-w-md shadow-2xl text-center space-y-8">
           <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto">M</div>
           <h1 className="text-2xl font-bold font-outfit">Admin Notoprajan</h1>
           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border p-4 rounded-xl focus:outline-none" placeholder="Password" />
           <button onClick={() => password === "1" ? setIsLoggedIn(true) : alert("Salah!")} className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold">Login</button>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { id: "hero", label: "Slider Header", icon: ImageIcon },
    { id: "gallery", label: "Galeri Foto", icon: Plus },
    { id: "hadith", label: "Hadits Harian", icon: Quote },
    { id: "news", label: "Berita & Kajian", icon: Newspaper },
    { id: "finance", label: "Keuangan", icon: Wallet },
    { id: "donation", label: "Donasi Khusus", icon: Target },
    { id: "settings", label: "Profil Masjid", icon: Settings },
    { id: "qa", label: "Tanya Jawab", icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-inter">
      <aside className="w-64 border-r border-slate-200 bg-white p-6 flex flex-col gap-8">
        <div className="font-outfit font-bold text-xl text-emerald-600 px-2 text-left">Notoprajan Admin</div>
        <nav className="flex flex-col gap-2">
          {sidebarItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-slate-500 hover:bg-slate-100"}`}>
              <item.icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        {/* HEADER SLIDER */}
        {activeTab === "hero" && (
          <div className="space-y-8 text-left">
            <div className="bg-white p-8 rounded-3xl border space-y-6 shadow-sm">
              <h2 className="text-xl font-bold text-emerald-600">{editingSlide ? "Edit Slide Header" : "Tambah Slide Header"}</h2>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  value={editingSlide ? editingSlide.title : newSlide.title} 
                  onChange={(e) => editingSlide ? setEditingSlide({...editingSlide, title: e.target.value}) : setNewSlide({...newSlide, title: e.target.value})} 
                  className="bg-slate-50 border p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                  placeholder="Judul" 
                />
                <input 
                  type="text" 
                  value={editingSlide ? editingSlide.subtitle : newSlide.subtitle} 
                  onChange={(e) => editingSlide ? setEditingSlide({...editingSlide, subtitle: e.target.value}) : setNewSlide({...newSlide, subtitle: e.target.value})} 
                  className="bg-slate-50 border p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                  placeholder="Deskripsi" 
                />
              </div>
              <div className="border-2 border-dashed border-slate-200 p-8 rounded-2xl text-center">
                <input type="file" onChange={onHeroUpload} className="hidden" id="hero-up" />
                <label htmlFor="hero-up" className="cursor-pointer space-y-2">
                  <Upload className="mx-auto text-emerald-500" />
                  <p className="text-sm text-slate-500">{isUploading ? "Uploading to Cloudflare..." : "Ganti Foto Header"}</p>
                </label>
                {(editingSlide?.image_url || newSlide.image_url) && <img src={editingSlide ? editingSlide.image_url : newSlide.image_url} className="mt-4 h-24 mx-auto rounded-xl shadow-md" />}
              </div>
              <div className="flex gap-4">
                <button onClick={handleSaveSlide} className="flex-1 bg-emerald-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-500/20">
                  {editingSlide ? "Update Slide" : "Simpan Slide"}
                </button>
                {editingSlide && <button onClick={() => setEditingSlide(null)} className="px-8 bg-slate-100 text-slate-500 rounded-xl font-bold">Batal</button>}
              </div>
            </div>
            <div className="bg-white border rounded-3xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-4 text-left font-bold">Foto</th>
                    <th className="p-4 text-left font-bold">Judul & Subjudul</th>
                    <th className="p-4 text-center font-bold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {heroSlides.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4"><img src={s.image_url} className="h-12 w-20 object-cover rounded-lg shadow-sm" /></td>
                      <td className="p-4"><div className="font-bold text-slate-800">{s.title}</div><div className="text-xs text-slate-500">{s.subtitle}</div></td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => setEditingSlide(s)} className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all"><Edit2 size={16}/></button>
                          <button onClick={() => handleDeleteSlide(s.id)} className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all"><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* GALLERY */}
        {activeTab === "gallery" && (
          <div className="space-y-8 text-left">
            <div className="bg-white p-8 rounded-3xl border border-dashed border-emerald-200 text-center space-y-4">
              <input type="file" onChange={onGalleryUpload} className="hidden" id="gal-up" />
              <label htmlFor="gal-up" className="cursor-pointer block p-12 hover:bg-emerald-50 transition-colors rounded-2xl">
                <ImageIcon className="mx-auto text-emerald-500 mb-4" size={48} />
                <p className="font-bold text-emerald-700">{isUploading ? "Mengirim ke Cloudflare..." : "Klik untuk Upload Foto Galeri"}</p>
                <p className="text-slate-400 text-xs">Foto akan otomatis masuk ke folder notoprajan/gallery</p>
              </label>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {galleryList.map(g => (
                <div key={g.id} className="relative group aspect-square rounded-2xl overflow-hidden shadow-md">
                  <img src={g.image_url} className="w-full h-full object-cover" />
                  <button onClick={async () => { await supabase.from('gallery').delete().eq('id', g.id); fetchGallery(); }} className="absolute top-2 right-2 p-2 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NEWS */}
        {activeTab === "news" && (
          <div className="space-y-8 text-left">
            <div className="bg-white p-8 rounded-3xl border space-y-4 shadow-sm">
              <h2 className="text-xl font-bold text-emerald-600">Tambah Berita / Kajian</h2>
              <input type="text" value={newNews.title} onChange={(e) => setNewNews({...newNews, title: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl" placeholder="Judul Berita" />
              <div className="border-2 border-dashed border-slate-200 p-6 rounded-2xl text-center">
                <input type="file" onChange={onNewsUpload} className="hidden" id="news-up" />
                <label htmlFor="news-up" className="cursor-pointer">
                  <p className="text-sm text-slate-500">{isUploading ? "Uploading..." : "Klik Upload Gambar Berita"}</p>
                  {newNews.image_url && <img src={newNews.image_url} className="mt-2 h-20 mx-auto rounded-lg" />}
                </label>
              </div>
              <textarea value={newNews.content} onChange={(e) => setNewNews({...newNews, content: e.target.value})} className="w-full bg-slate-50 border p-3 h-32 rounded-xl" placeholder="Isi berita..." />
              <button onClick={async () => { await supabase.from('news').insert([newNews]); setNewNews({title:"", category:"Kajian", content:"", image_url:""}); fetchNews(); }} className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold">Terbitkan</button>
            </div>
            <div className="bg-white border rounded-3xl p-4">
               {newsList.map(n => (<div key={n.id} className="p-3 border-b flex justify-between items-center"><img src={n.image_url} className="h-12 w-12 object-cover rounded" /><span className="flex-1 px-4">{n.title}</span><button onClick={async () => { await supabase.from('news').delete().eq('id', n.id); fetchNews(); }} className="text-rose-500"><Trash2/></button></div>))}
            </div>
          </div>
        )}

        {/* FINANCE */}
        {activeTab === "finance" && (
          <div className="space-y-8 text-left">
            <div className="bg-white p-8 rounded-3xl border space-y-4 shadow-sm">
              <h2 className="text-xl font-bold text-emerald-600">Input Laporan Keuangan</h2>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" className="bg-slate-50 border p-3 rounded-xl" placeholder="Judul Laporan (Misal: Infaq Jumat 12 Mei)" />
                <input type="date" className="bg-slate-50 border p-3 rounded-xl" />
                <input type="number" className="bg-slate-50 border p-3 rounded-xl" placeholder="Total Pemasukan (Rp)" />
                <input type="number" className="bg-slate-50 border p-3 rounded-xl" placeholder="Total Pengeluaran (Rp)" />
                <input type="text" className="col-span-2 bg-slate-50 border p-3 rounded-xl" placeholder="Kategori (Kas Masjid / Zakat / Sosial)" />
              </div>
              <button className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold">Simpan Laporan</button>
            </div>
            <div className="bg-white border rounded-3xl p-4 text-center text-slate-500 italic py-10">
              Belum ada data keuangan yang diinput.
            </div>
          </div>
        )}

        {/* DONATION */}
        {activeTab === "donation" && (
          <div className="space-y-8 text-left">
            <div className="bg-white p-8 rounded-3xl border space-y-4 shadow-sm">
              <h2 className="text-xl font-bold text-emerald-600">Kelola Donasi Khusus</h2>
              <input type="text" className="w-full bg-slate-50 border p-3 rounded-xl" placeholder="Judul Program (Misal: Renovasi Atap)" />
              <textarea className="w-full bg-slate-50 border p-3 h-24 rounded-xl" placeholder="Deskripsi Singkat..." />
              <div className="grid grid-cols-3 gap-4">
                <input type="number" className="bg-slate-50 border p-3 rounded-xl" placeholder="Target Donasi (Rp)" />
                <input type="number" className="bg-slate-50 border p-3 rounded-xl" placeholder="Terkumpul (Rp)" />
                <input type="text" className="bg-slate-50 border p-3 rounded-xl" placeholder="Batas Waktu (Contoh: 20 Mei 2024)" />
              </div>
              <button className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold">Update Program Donasi</button>
            </div>
          </div>
        )}

        {/* QA */}
        {activeTab === "qa" && (
          <div className="space-y-8 text-left">
            <div className="bg-white p-8 rounded-3xl border shadow-sm text-center py-20">
              <MessageCircle size={64} className="mx-auto text-emerald-200 mb-6" />
              <h2 className="text-2xl font-bold text-slate-800">Fitur Tanya Jawab Segera Hadir</h2>
              <p className="text-slate-500 mt-2">Sedang dalam tahap pengembangan untuk integrasi WhatsApp.</p>
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <div className="space-y-8 text-left">
            <div className="bg-white p-8 rounded-3xl border space-y-4 shadow-sm">
              <h2 className="text-xl font-bold text-emerald-600">Pengaturan Profil Masjid</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Nama Masjid</label>
                  <input type="text" className="w-full mt-1 bg-slate-50 border p-3 rounded-xl" defaultValue="Masjid Notoprajan" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Nomor Rekening Donasi</label>
                  <input type="text" className="w-full mt-1 bg-slate-50 border p-3 rounded-xl" defaultValue="BSI 7264867848 a.n Masjid Notoprajan" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Link QRIS (URL/String)</label>
                  <input type="text" className="w-full mt-1 bg-slate-50 border p-3 rounded-xl" defaultValue="DonasiMasjidNotoprajan" />
                </div>
              </div>
              <button className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold mt-4">Simpan Perubahan</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
