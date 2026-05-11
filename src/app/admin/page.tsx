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
  const [newGalleryTitle, setNewGalleryTitle] = useState("");

  const fetchGallery = async () => {
    const { data } = await supabase.from('gallery').select('*').order('id', { ascending: false });
    if (data) setGalleryList(data);
  };

  const onGalleryUpload = async (e: any) => {
    if (!newGalleryTitle) return alert("Isi judul kegiatan terlebih dahulu!");
    setIsUploading(true);
    const url = await handleFileUpload(e.target.files[0], "gallery");
    if (url) {
      await supabase.from('gallery').insert([{ title: newGalleryTitle, image_url: url }]);
      setNewGalleryTitle("");
      fetchGallery();
    }
    setIsUploading(false);
  };

  // --- 3. HADITH LOGIC ---
  const [hadithList, setHadithList] = useState<any[]>([]);
  const [newHadith, setNewHadith] = useState({ content: "", narrator: "", source: "", display_date: new Date().toISOString().split('T')[0] });
  
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

  // --- 5. FINANCE LOGIC ---
  const [financeList, setFinanceList] = useState<any[]>([]);
  const [newFinance, setNewFinance] = useState({ title: "", report_date: new Date().toISOString().split('T')[0], total_income: "", total_expenditure: "", category: "Kas Masjid" });
  
  const fetchFinance = async () => {
    const { data } = await supabase.from('financial_reports').select('*').order('report_date', { ascending: false });
    if (data) setFinanceList(data);
  };

  const saveFinance = async () => {
    if (!newFinance.title) return alert("Judul wajib diisi");
    const payload = { ...newFinance, total_income: Number(newFinance.total_income) || 0, total_expenditure: Number(newFinance.total_expenditure) || 0 };
    await supabase.from('financial_reports').insert([payload]);
    setNewFinance({ title: "", report_date: new Date().toISOString().split('T')[0], total_income: "", total_expenditure: "", category: "Kas Masjid" });
    fetchFinance();
  };

  // --- 6. DONATION LOGIC ---
  const [donationList, setDonationList] = useState<any[]>([]);
  const [newDonation, setNewDonation] = useState({ title: "", description: "", target_amount: "", current_amount: "", deadline: "" });

  const fetchDonations = async () => {
    const { data } = await supabase.from('donation_campaigns').select('*').order('created_at', { ascending: false });
    if (data) setDonationList(data);
  };

  const saveDonation = async () => {
    if (!newDonation.title) return alert("Judul wajib diisi");
    const payload = { ...newDonation, target_amount: Number(newDonation.target_amount) || 0, current_amount: Number(newDonation.current_amount) || 0 };
    await supabase.from('donation_campaigns').insert([payload]);
    setNewDonation({ title: "", description: "", target_amount: "", current_amount: "", deadline: "" });
    fetchDonations();
  };

  // --- 7. QA (FAQ) LOGIC ---
  const [faqs, setFaqs] = useState<any[]>([]);
  const [newFaq, setNewFaq] = useState({ q: "", a: "" });

  const fetchFaqs = async () => {
    const { data } = await supabase.from('mosque_settings').select('value').eq('key', 'faqs').single();
    if (data && data.value) setFaqs(data.value);
  };

  const saveFaq = async () => {
    if (!newFaq.q || !newFaq.a) return alert("Pertanyaan dan Jawaban wajib diisi");
    const updatedFaqs = [...faqs, newFaq];
    await supabase.from('mosque_settings').upsert({ key: 'faqs', value: updatedFaqs });
    setNewFaq({ q: "", a: "" });
    fetchFaqs();
  };

  const deleteFaq = async (index: number) => {
    const updatedFaqs = faqs.filter((_, i) => i !== index);
    await supabase.from('mosque_settings').upsert({ key: 'faqs', value: updatedFaqs });
    fetchFaqs();
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchHadiths(); fetchHeroSlides(); fetchGallery(); fetchNews(); fetchFinance(); fetchDonations(); fetchFaqs();
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
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-emerald-600">Tambah Foto Galeri</h2>
              <input 
                type="text" 
                value={newGalleryTitle} 
                onChange={(e) => setNewGalleryTitle(e.target.value)} 
                className="w-full bg-slate-50 border p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                placeholder="Tulis Judul Kegiatan (Contoh: Kerja Bakti, Pemeriksaan Kesehatan)..." 
              />
              <div className={`border-2 border-dashed border-emerald-200 text-center transition-colors rounded-2xl ${newGalleryTitle ? 'bg-emerald-50' : 'bg-slate-50 opacity-50 cursor-not-allowed'}`}>
                <input type="file" onChange={onGalleryUpload} className="hidden" id="gal-up" disabled={!newGalleryTitle} />
                <label htmlFor="gal-up" className={`block p-12 ${newGalleryTitle ? 'cursor-pointer hover:bg-emerald-100' : 'cursor-not-allowed'}`}>
                  <ImageIcon className="mx-auto text-emerald-500 mb-4" size={48} />
                  <p className="font-bold text-emerald-700">{isUploading ? "Mengirim ke Cloudflare..." : newGalleryTitle ? "Klik untuk Upload Foto" : "Isi judul kegiatan dulu sebelum upload"}</p>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {galleryList.map(g => (
                <div key={g.id} className="relative group rounded-2xl overflow-hidden shadow-md bg-white border border-slate-100 flex flex-col">
                  <div className="aspect-square w-full">
                    <img src={g.image_url} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 text-center text-sm font-bold text-slate-700 bg-white border-t border-slate-100 line-clamp-1">{g.title}</div>
                  <button onClick={async () => { await supabase.from('gallery').delete().eq('id', g.id); fetchGallery(); }} className="absolute top-2 right-2 p-2 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HADITH */}
        {activeTab === "hadith" && (
          <div className="space-y-8 text-left">
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-emerald-600">Update Hadits Harian</h2>
              <textarea 
                value={newHadith.content} 
                onChange={(e) => setNewHadith({...newHadith, content: e.target.value})} 
                className="w-full bg-slate-50 border p-4 rounded-xl h-32 focus:outline-none" 
                placeholder="Isi Hadits..." 
              />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={newHadith.narrator} onChange={(e) => setNewHadith({...newHadith, narrator: e.target.value})} className="bg-slate-50 border p-4 rounded-xl" placeholder="Perawi (Contoh: HR. Bukhari)" />
                <input type="text" value={newHadith.source} onChange={(e) => setNewHadith({...newHadith, source: e.target.value})} className="bg-slate-50 border p-4 rounded-xl" placeholder="Sumber/Kitab (Opsional)" />
              </div>
              <input type="date" value={newHadith.display_date} onChange={(e) => setNewHadith({...newHadith, display_date: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl" />
              <button onClick={async () => { await supabase.from('hadith').insert([newHadith]); setNewHadith({content:"", narrator:"", source:"", display_date: new Date().toISOString().split('T')[0]}); fetchHadiths(); }} className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold">Simpan Hadits</button>
            </div>
            
            <div className="bg-white border rounded-3xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50"><tr><th className="p-4 text-left font-bold">Tanggal</th><th className="p-4 text-left font-bold">Hadits</th><th className="p-4 text-center font-bold">Aksi</th></tr></thead>
                <tbody className="divide-y">
                  {hadithList.map(h => (
                    <tr key={h.id} className="hover:bg-slate-50">
                      <td className="p-4 whitespace-nowrap">{h.display_date}</td>
                      <td className="p-4"><div className="font-bold">{h.narrator}</div><div className="text-slate-500 line-clamp-2">{h.content}</div></td>
                      <td className="p-4 text-center">
                        <button onClick={async () => { await supabase.from('hadith').delete().eq('id', h.id); fetchHadiths(); }} className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                <input type="text" value={newFinance.title} onChange={(e) => setNewFinance({...newFinance, title: e.target.value})} className="bg-slate-50 border p-4 rounded-xl" placeholder="Judul (Misal: Infaq Jumat 12 Mei)" />
                <input type="date" value={newFinance.report_date} onChange={(e) => setNewFinance({...newFinance, report_date: e.target.value})} className="bg-slate-50 border p-4 rounded-xl" />
                <input type="number" value={newFinance.total_income} onChange={(e) => setNewFinance({...newFinance, total_income: e.target.value})} className="bg-slate-50 border p-4 rounded-xl" placeholder="Total Pemasukan (Rp)" />
                <input type="number" value={newFinance.total_expenditure} onChange={(e) => setNewFinance({...newFinance, total_expenditure: e.target.value})} className="bg-slate-50 border p-4 rounded-xl" placeholder="Total Pengeluaran (Rp)" />
                <select value={newFinance.category} onChange={(e) => setNewFinance({...newFinance, category: e.target.value})} className="col-span-2 bg-slate-50 border p-4 rounded-xl">
                  <option value="Kas Masjid">Kas Masjid / Operasional</option>
                  <option value="Zakat">Zakat & Fidyah</option>
                  <option value="Sosial">Dana Sosial / Anak Yatim</option>
                </select>
              </div>
              <button onClick={saveFinance} className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold">Simpan Laporan</button>
            </div>
            
            <div className="bg-white border rounded-3xl overflow-hidden">
              {financeList.length > 0 ? (
                <table className="w-full text-sm">
                  <thead className="bg-slate-50"><tr><th className="p-4 text-left">Tanggal</th><th className="p-4 text-left">Keterangan</th><th className="p-4 text-right">Pemasukan</th><th className="p-4 text-right">Pengeluaran</th><th className="p-4 text-center">Aksi</th></tr></thead>
                  <tbody className="divide-y">
                    {financeList.map(f => (
                      <tr key={f.id} className="hover:bg-slate-50">
                        <td className="p-4">{f.report_date}</td>
                        <td className="p-4"><div className="font-bold">{f.title}</div><div className="text-xs text-emerald-600">{f.category}</div></td>
                        <td className="p-4 text-right text-emerald-600 font-bold">Rp {Number(f.total_income).toLocaleString('id-ID')}</td>
                        <td className="p-4 text-right text-rose-500 font-bold">Rp {Number(f.total_expenditure).toLocaleString('id-ID')}</td>
                        <td className="p-4 text-center"><button onClick={async () => { await supabase.from('financial_reports').delete().eq('id', f.id); fetchFinance(); }} className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Trash2 size={16}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center text-slate-500 italic py-10">Belum ada data keuangan yang diinput.</div>
              )}
            </div>
          </div>
        )}

        {/* DONATION */}
        {activeTab === "donation" && (
          <div className="space-y-8 text-left">
            <div className="bg-white p-8 rounded-3xl border space-y-4 shadow-sm">
              <h2 className="text-xl font-bold text-emerald-600">Kelola Donasi Khusus</h2>
              <input type="text" value={newDonation.title} onChange={(e) => setNewDonation({...newDonation, title: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl" placeholder="Judul Program (Misal: Renovasi Atap)" />
              <textarea value={newDonation.description} onChange={(e) => setNewDonation({...newDonation, description: e.target.value})} className="w-full bg-slate-50 border p-4 h-24 rounded-xl" placeholder="Deskripsi Singkat..." />
              <div className="grid grid-cols-3 gap-4">
                <input type="number" value={newDonation.target_amount} onChange={(e) => setNewDonation({...newDonation, target_amount: e.target.value})} className="bg-slate-50 border p-4 rounded-xl" placeholder="Target Donasi (Rp)" />
                <input type="number" value={newDonation.current_amount} onChange={(e) => setNewDonation({...newDonation, current_amount: e.target.value})} className="bg-slate-50 border p-4 rounded-xl" placeholder="Terkumpul (Rp)" />
                <input type="text" value={newDonation.deadline} onChange={(e) => setNewDonation({...newDonation, deadline: e.target.value})} className="bg-slate-50 border p-4 rounded-xl" placeholder="Batas Waktu (Contoh: 20 Mei 2024)" />
              </div>
              <button onClick={saveDonation} className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold">Buka Program Donasi</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {donationList.map(d => (
                 <div key={d.id} className="bg-white p-6 rounded-3xl border shadow-sm space-y-4 relative">
                   <button onClick={async () => { await supabase.from('donation_campaigns').delete().eq('id', d.id); fetchDonations(); }} className="absolute top-4 right-4 p-2 bg-rose-50 text-rose-500 rounded-lg"><Trash2 size={16}/></button>
                   <h3 className="font-bold text-lg pr-10">{d.title}</h3>
                   <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full" style={{width: `${Math.min(100, (d.current_amount/d.target_amount)*100)}%`}}></div></div>
                   <div className="flex justify-between text-sm">
                     <span className="text-emerald-600 font-bold">Terkumpul: Rp {Number(d.current_amount).toLocaleString('id-ID')}</span>
                     <span className="text-slate-500">Target: Rp {Number(d.target_amount).toLocaleString('id-ID')}</span>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* QA */}
        {activeTab === "qa" && (
          <div className="space-y-8 text-left">
            <div className="bg-white p-8 rounded-3xl border space-y-4 shadow-sm">
              <h2 className="text-xl font-bold text-emerald-600">Daftar Tanya Jawab (FAQ)</h2>
              <input type="text" value={newFaq.q} onChange={(e) => setNewFaq({...newFaq, q: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl" placeholder="Pertanyaan..." />
              <textarea value={newFaq.a} onChange={(e) => setNewFaq({...newFaq, a: e.target.value})} className="w-full bg-slate-50 border p-4 h-24 rounded-xl" placeholder="Jawaban..." />
              <button onClick={saveFaq} className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold">Simpan FAQ</button>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border shadow-sm flex justify-between items-start gap-4">
                  <div className="space-y-2">
                    <div className="font-bold text-slate-800">Q: {faq.q}</div>
                    <div className="text-slate-600 text-sm">A: {faq.a}</div>
                  </div>
                  <button onClick={() => deleteFaq(i)} className="p-2 bg-rose-50 text-rose-500 rounded-lg"><Trash2 size={16}/></button>
                </div>
              ))}
              {faqs.length === 0 && <div className="text-center text-slate-500 py-10">Belum ada data tanya jawab.</div>}
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
