"use client";

import { useState, useEffect } from "react";
import { 
  Quote, Newspaper, ShoppingBag, Wallet, Settings,
  Plus, Save, Trash2, Calendar, Clock, Upload, LogOut,
  Image as ImageIcon, Video, Users, BookOpen, Edit2
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
  
  const fetchHeroSlides = async () => {
    const { data } = await supabase.from('hero_slides').select('*').order('order_index', { ascending: true });
    if (data) setHeroSlides(data);
  };

  const onHeroUpload = async (e: any) => {
    setIsUploading(true);
    const url = await handleFileUpload(e.target.files[0], "hero");
    if (url) setNewSlide({ ...newSlide, image_url: url });
    setIsUploading(false);
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
    { id: "settings", label: "Profil Masjid", icon: Settings },
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
              <h2 className="text-xl font-bold text-emerald-600">Tambah Slide Header (Cloudflare)</h2>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={newSlide.title} onChange={(e) => setNewSlide({...newSlide, title: e.target.value})} className="bg-slate-50 border p-3 rounded-xl" placeholder="Judul" />
                <input type="text" value={newSlide.subtitle} onChange={(e) => setNewSlide({...newSlide, subtitle: e.target.value})} className="bg-slate-50 border p-3 rounded-xl" placeholder="Deskripsi" />
              </div>
              <div className="border-2 border-dashed border-slate-200 p-8 rounded-2xl text-center">
                <input type="file" onChange={onHeroUpload} className="hidden" id="hero-up" />
                <label htmlFor="hero-up" className="cursor-pointer space-y-2">
                  <Upload className="mx-auto text-emerald-500" />
                  <p className="text-sm text-slate-500">{isUploading ? "Uploading to Cloudflare..." : "Klik untuk Upload Foto Header"}</p>
                </label>
                {newSlide.image_url && <img src={newSlide.image_url} className="mt-4 h-24 mx-auto rounded-xl" />}
              </div>
              <button onClick={async () => { await supabase.from('hero_slides').insert([newSlide]); setNewSlide({title:"", subtitle:"", image_url:"", order_index:0}); fetchHeroSlides(); }} className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold">Simpan Slide</button>
            </div>
            <div className="bg-white border rounded-3xl p-4">
              {heroSlides.map(s => (<div key={s.id} className="p-3 border-b flex justify-between items-center"><img src={s.image_url} className="h-12 w-20 object-cover rounded" /><span>{s.title}</span><button onClick={async () => { await supabase.from('hero_slides').delete().eq('id', s.id); fetchHeroSlides(); }} className="text-rose-500"><Trash2/></button></div>))}
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
      </main>
    </div>
  );
}
