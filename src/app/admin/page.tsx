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
  const [loading, setLoading] = useState(false);

  // --- 0. HERO SLIDES LOGIC ---
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [newSlide, setNewSlide] = useState({ title: "", subtitle: "", image_url: "", order_index: 0 });
  const [isUploading, setIsUploading] = useState(false);
  
  const fetchHeroSlides = async () => {
    const { data } = await supabase.from('hero_slides').select('*').order('order_index', { ascending: true });
    if (data) setHeroSlides(data);
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    const fileName = `${Date.now()}-${file.name}`;
    
    // Upload to 'images' bucket
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, file);

    if (error) {
      console.error(error);
      alert("Gagal upload! Pastikan bucket 'images' sudah dibuat di Supabase Storage.");
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);
      setNewSlide({ ...newSlide, image_url: publicUrl });
    }
    setIsUploading(false);
  };

  const handleAddSlide = async () => {
    if (!newSlide.title || !newSlide.image_url) return alert("Pilih Foto & Isi Judul!");
    await supabase.from('hero_slides').insert([newSlide]);
    setNewSlide({ title: "", subtitle: "", image_url: "", order_index: heroSlides.length + 1 });
    fetchHeroSlides();
  };

  const handleDeleteSlide = async (id: number) => {
    if (confirm("Hapus slide ini?")) {
      await supabase.from('hero_slides').delete().eq('id', id);
      fetchHeroSlides();
    }
  };

  // --- 1. HADITH LOGIC ---
  const [hadithList, setHadithList] = useState<any[]>([]);
  const [newHadith, setNewHadith] = useState({ content: "", narrator: "", date: new Date().toISOString().split('T')[0] });
  const [bulkHadith, setBulkHadith] = useState("");

  const fetchHadiths = async () => {
    const { data } = await supabase.from('hadith').select('*').order('display_date', { ascending: false });
    if (data) setHadithList(data);
  };

  const handleAddHadith = async () => {
    if (!newHadith.content) return alert("Isi hadits!");
    await supabase.from('hadith').insert([{ content: newHadith.content, narrator: newHadith.narrator || "HR. Muslim", display_date: newHadith.date }]);
    setNewHadith({ content: "", narrator: "", date: new Date().toISOString().split('T')[0] });
    fetchHadiths();
  };

  const handleBulkHadith = async () => {
    const lines = bulkHadith.split('\n').filter(l => l.includes('|'));
    const inserts = lines.map(line => {
      const parts = line.split('|');
      return {
        display_date: parts[0]?.trim(),
        content: parts[1]?.trim(),
        narrator: parts[2]?.trim() || "HR. Muslim"
      };
    });
    if (inserts.length > 0) {
      await supabase.from('hadith').insert(inserts);
      setBulkHadith("");
      fetchHadiths();
      alert(`Berhasil upload ${inserts.length} hadits!`);
    }
  };

  // --- 2. KAJIAN & JUMATAN LOGIC ---
  const [studyList, setStudyList] = useState<any[]>([]);
  const [newStudy, setNewStudy] = useState({ title: "", speaker: "", date: "", time: "", location: "Masjid Notoprajan" });
  const [bulkStudy, setBulkStudy] = useState("");
  
  const [fridayList, setFridayList] = useState<any[]>([]);
  const [newFriday, setNewFriday] = useState({ date: "", khotib: "", imam: "", muadzin: "" });
  const [bulkFriday, setBulkFriday] = useState("");

  const fetchSchedules = async () => {
    const { data: s } = await supabase.from('study_schedules').select('*').order('date', { ascending: false });
    const { data: f } = await supabase.from('friday_schedules').select('*').order('date', { ascending: false });
    if (s) setStudyList(s);
    if (f) setFridayList(f);
  };

  const handleBulkStudy = async () => {
    const lines = bulkStudy.split('\n').filter(l => l.includes('|'));
    const inserts = lines.map(l => {
      const p = l.split('|');
      return { date: p[0]?.trim(), title: p[1]?.trim(), speaker: p[2]?.trim(), time: p[3]?.trim() || "18:30", location: "Masjid Notoprajan" };
    });
    await supabase.from('study_schedules').insert(inserts);
    setBulkStudy(""); fetchSchedules(); alert("Bulk Kajian Berhasil!");
  };

  const handleBulkFriday = async () => {
    const lines = bulkFriday.split('\n').filter(l => l.includes('|'));
    const inserts = lines.map(l => {
      const p = l.split('|');
      return { date: p[0]?.trim(), khotib: p[1]?.trim(), imam: p[2]?.trim() || p[1]?.trim(), muadzin: p[3]?.trim() || "Muadzin Masjid" };
    });
    await supabase.from('friday_schedules').insert(inserts);
    setBulkFriday(""); fetchSchedules(); alert("Bulk Jumat Berhasil!");
  };

  // --- 3. FINANCE LOGIC ---
  const [financeList, setFinanceList] = useState<any[]>([]);
  const [newFinance, setNewFinance] = useState({ date: new Date().toISOString().split('T')[0], type: "income", amount: "", description: "", category: "Infaq" });
  const [editingFinance, setEditingFinance] = useState<any>(null);

  const fetchFinance = async () => {
    const { data } = await supabase.from('finance_reports').select('*').order('date', { ascending: false });
    if (data) setFinanceList(data);
  };

  const handleAddFinance = async () => {
    if (!newFinance.amount) return;
    const payload = { 
      date: newFinance.date, 
      type: newFinance.type, 
      amount: parseFloat(newFinance.amount), 
      description: newFinance.description,
      category: newFinance.category
    };
    if (editingFinance) { await supabase.from('finance_reports').update(payload).eq('id', editingFinance.id); setEditingFinance(null); }
    else { await supabase.from('finance_reports').insert([payload]); }
    setNewFinance({ date: new Date().toISOString().split('T')[0], type: "income", amount: "", description: "", category: "Infaq" });
    fetchFinance();
  };

  // --- 4. NEWS & SETTINGS ---
  const [newsList, setNewsList] = useState<any[]>([]);
  const [newNews, setNewNews] = useState({ title: "", category: "Kajian", content: "", image_url: "" });
  const [settings, setSettings] = useState<any>({ mosque_name: "", address: "" });

  const fetchNews = async () => {
    const { data } = await supabase.from('news').select('*').order('id', { ascending: false });
    if (data) setNewsList(data);
  };

  const handleAddNews = async () => {
    await supabase.from('news').insert([newNews]);
    setNewNews({ title: "", category: "Kajian", content: "", image_url: "" });
    fetchNews();
  };

  // Unified Fetch
  useEffect(() => {
    if (isLoggedIn) {
      fetchHadiths(); fetchSchedules(); fetchFinance(); fetchNews(); fetchHeroSlides();
      supabase.from('mosque_settings').select('*').single().then(({data}) => data && setSettings(data));
    }
  }, [isLoggedIn]);

  const balance = financeList.reduce((acc, curr) => acc + (curr.type === 'income' ? parseFloat(curr.amount) : -parseFloat(curr.amount)), 0);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 w-full max-w-md shadow-2xl text-center space-y-8 text-slate-900">
           <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto">M</div>
           <h1 className="text-2xl font-bold font-outfit">Admin Notoprajan</h1>
           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border p-4 rounded-xl focus:outline-none" placeholder="Password" />
           <button onClick={() => password === "1" ? setIsLoggedIn(true) : alert("Salah!")} className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold">Login</button>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { id: "hadith", label: "Hadits Harian", icon: Quote },
    { id: "hero", label: "Slider Header", icon: ImageIcon },
    { id: "kajian", label: "Jadwal Kajian", icon: BookOpen },
    { id: "jumat", label: "Jadwal Jumat", icon: Users },
    { id: "finance", label: "Keuangan", icon: Wallet },
    { id: "news", label: "Berita & Kajian", icon: Newspaper },
    { id: "settings", label: "Profil Masjid", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-inter">
      <aside className="w-64 border-r border-slate-200 bg-white p-6 flex flex-col gap-8">
        <div className="font-outfit font-bold text-xl text-emerald-600 px-2">Notoprajan Admin</div>
        <nav className="flex flex-col gap-2">
          {sidebarItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-slate-500 hover:bg-slate-100"}`}>
              <item.icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <button onClick={() => setIsLoggedIn(false)} className="mt-auto flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><LogOut size={20} /><span className="text-sm font-medium">Log Out</span></button>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-end mb-12 text-left">
          <div><h1 className="text-3xl font-bold font-outfit capitalize">{activeTab}</h1><p className="text-slate-500 text-sm">Masjid Notoprajan Yogyakarta.</p></div>
          <div className="bg-emerald-50 border border-emerald-100 px-6 py-3 rounded-2xl">
            <span className="text-xs font-bold text-emerald-600 block">Saldo Kas</span>
            <span className="text-xl font-bold text-emerald-700">Rp {balance.toLocaleString('id-ID')}</span>
          </div>
        </header>

        {/* HERO SLIDER TAB */}
        {activeTab === "hero" && (
          <div className="space-y-8 text-left">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6">
              <h2 className="text-xl font-bold text-emerald-600">Tambah Slide Header</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Judul Besar</label>
                  <input type="text" value={newSlide.title} onChange={(e) => setNewSlide({...newSlide, title: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Masjid Notoprajan" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Subjudul / Deskripsi</label>
                  <input type="text" value={newSlide.subtitle} onChange={(e) => setNewSlide({...newSlide, subtitle: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Pusat Syiar & Ukhuwah..." />
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400 uppercase block">Upload Foto Header</label>
                <div className="flex items-center gap-6">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 hover:border-emerald-500 transition-all text-center space-y-2">
                      <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                        <Upload size={20} />
                      </div>
                      <div className="text-sm font-medium text-slate-600">
                        {isUploading ? "Sedang Mengunggah..." : "Pilih File Foto (JPG/PNG)"}
                      </div>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={isUploading} />
                    </div>
                  </label>
                  
                  {newSlide.image_url && (
                    <div className="w-40 h-24 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-lg relative group">
                      <img src={newSlide.image_url} className="w-full h-full object-cover" alt="Preview" />
                      <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Save className="text-white" size={24} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={handleAddSlide} 
                disabled={isUploading || !newSlide.image_url}
                className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all disabled:opacity-50"
              >
                Simpan ke Website
              </button>
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
                      <td className="p-4"><img src={s.image_url} className="w-24 h-12 object-cover rounded-lg" /></td>
                      <td className="p-4"><div className="font-bold">{s.title}</div><div className="text-xs text-slate-500">{s.subtitle}</div></td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleDeleteSlide(s.id)} className="text-rose-500 p-2"><Trash2 size={18}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* HADITH TAB */}
        {activeTab === "hadith" && (
          <div className="space-y-8 text-left">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-4">
                <h2 className="text-xl font-bold text-emerald-600">Single Input</h2>
                <textarea value={newHadith.content} onChange={(e) => setNewHadith({...newHadith, content: e.target.value})} className="w-full bg-slate-50 border rounded-xl p-3" placeholder="Isi hadits..." />
                <input type="date" value={newHadith.date} onChange={(e) => setNewHadith({...newHadith, date: e.target.value})} className="w-full bg-slate-50 border rounded-xl p-3" />
                <button onClick={handleAddHadith} className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold">Simpan</button>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-4">
                <h2 className="text-xl font-bold text-indigo-600">Bulk Upload (Date | Content | Narrator)</h2>
                <textarea value={bulkHadith} onChange={(e) => setBulkHadith(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-3 h-32 text-sm" placeholder="2024-05-15 | Kebersihan sebagian dari iman | HR. Muslim" />
                <button onClick={handleBulkHadith} className="w-full bg-indigo-500 text-white py-3 rounded-xl font-bold">Import Data</button>
              </div>
            </div>
            <div className="bg-white border rounded-3xl p-4 max-h-96 overflow-y-auto">
              {hadithList.map(h => (<div key={h.id} className="p-3 border-b last:border-0 flex justify-between"><span>{h.display_date} - {h.content}</span><button onClick={async () => { await supabase.from('hadith').delete().eq('id', h.id); fetchHadiths(); }} className="text-rose-500"><Trash2 size={16}/></button></div>))}
            </div>
          </div>
        )}

        {/* KAJIAN TAB */}
        {activeTab === "kajian" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
            <div className="bg-white p-8 rounded-3xl border space-y-4">
              <h2 className="text-xl font-bold text-emerald-600">Tambah Kajian</h2>
              <input type="text" value={newStudy.title} onChange={(e) => setNewStudy({...newStudy, title: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl" placeholder="Judul" />
              <input type="date" value={newStudy.date} onChange={(e) => setNewStudy({...newStudy, date: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl" />
              <button onClick={async () => { await supabase.from('study_schedules').insert([newStudy]); setNewStudy({title:"", speaker:"", date:"", time:"", location:"Masjid Notoprajan"}); fetchSchedules(); }} className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold">Simpan</button>
            </div>
            <div className="bg-white p-8 rounded-3xl border space-y-4">
              <h2 className="text-xl font-bold text-indigo-600">Bulk (Date | Title | Speaker | Time)</h2>
              <textarea value={bulkStudy} onChange={(e) => setBulkStudy(e.target.value)} className="w-full bg-slate-50 border p-3 h-32" placeholder="2024-05-15 | Tafsir Al-Quran | Ust. Ahmad | 18:30" />
              <button onClick={handleBulkStudy} className="w-full bg-indigo-500 text-white py-3 rounded-xl font-bold">Import Bulk</button>
            </div>
          </div>
        )}

        {/* JUMAT TAB */}
        {activeTab === "jumat" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
            <div className="bg-white p-8 rounded-3xl border space-y-4">
              <h2 className="text-xl font-bold text-emerald-600">Tambah Jadwal Jumat</h2>
              <input type="date" value={newFriday.date} onChange={(e) => setNewFriday({...newFriday, date: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl" />
              <input type="text" value={newFriday.khotib} onChange={(e) => setNewFriday({...newFriday, khotib: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl" placeholder="Khotib" />
              <button onClick={async () => { await supabase.from('friday_schedules').insert([newFriday]); setNewFriday({date:"", khotib:"", imam:"", muadzin:""}); fetchSchedules(); }} className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold">Simpan</button>
            </div>
            <div className="bg-white p-8 rounded-3xl border space-y-4">
              <h2 className="text-xl font-bold text-indigo-600">Bulk (Date | Khotib | Imam | Muadzin)</h2>
              <textarea value={bulkFriday} onChange={(e) => setBulkFriday(e.target.value)} className="w-full bg-slate-50 border p-3 h-32" placeholder="2024-05-17 | Ust. Budi | Ust. Budi | Pak Muadzin" />
              <button onClick={handleBulkFriday} className="w-full bg-indigo-500 text-white py-3 rounded-xl font-bold">Import Bulk</button>
            </div>
          </div>
        )}

        {/* FINANCE TAB */}
        {activeTab === "finance" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-4 h-fit shadow-sm">
              <h2 className="text-xl font-bold text-emerald-600">{editingFinance ? "Edit Transaksi" : "Tambah Transaksi"}</h2>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Tanggal</label>
                <input type="date" value={newFinance.date} onChange={(e) => setNewFinance({...newFinance, date: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Kategori</label>
                <select value={newFinance.category} onChange={(e) => setNewFinance({...newFinance, category: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl outline-none">
                  <option value="Infaq">Infaq / Sedekah</option>
                  <option value="Zakat">Zakat</option>
                  <option value="Operasional">Operasional</option>
                  <option value="Pembangunan">Pembangunan</option>
                  <option value="Kegiatan">Kegiatan Masjid</option>
                  <option value="Lain-lain">Lain-lain</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Keterangan</label>
                <input type="text" value={newFinance.description} onChange={(e) => setNewFinance({...newFinance, description: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl outline-none" placeholder="Contoh: Infaq Jumat Pekan 1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Tipe</label>
                  <select value={newFinance.type} onChange={(e) => setNewFinance({...newFinance, type: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl outline-none">
                    <option value="income">Masuk (+)</option>
                    <option value="expense">Keluar (-)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Nominal</label>
                  <input type="number" value={newFinance.amount} onChange={(e) => setNewFinance({...newFinance, amount: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl outline-none" placeholder="0" />
                </div>
              </div>

              <button onClick={handleAddFinance} className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all">
                {editingFinance ? "Update Data" : "Simpan Transaksi"}
              </button>
              {editingFinance && <button onClick={() => setEditingFinance(null)} className="w-full text-slate-400 text-sm font-medium py-2">Batal Edit</button>}
            </div>

            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b text-left">
                  <tr>
                    <th className="p-4 font-bold text-slate-500">Tanggal</th>
                    <th className="p-4 font-bold text-slate-500">Kategori & Keterangan</th>
                    <th className="p-4 text-right font-bold text-slate-500">Nominal</th>
                    <th className="p-4 text-center font-bold text-slate-500">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {financeList.map(f => (
                    <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-slate-500">{f.date}</td>
                      <td className="p-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase mb-1 block w-fit">{f.category || "Umum"}</span>
                        <div className="font-bold text-slate-900">{f.description}</div>
                      </td>
                      <td className={`p-4 text-right font-bold text-lg ${f.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {f.type === 'income' ? '+' : '-'} Rp {parseFloat(f.amount).toLocaleString('id-ID')}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                           <button onClick={() => {setEditingFinance(f); setNewFinance({date:f.date, type:f.type, amount:f.amount.toString(), description:f.description, category: f.category || "Infaq"})}} className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all"><Edit2 size={16}/></button>
                           <button onClick={async () => { if(confirm("Hapus data ini?")){ await supabase.from('finance_reports').delete().eq('id', f.id); fetchFinance(); }}} className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all"><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {financeList.length === 0 && <div className="py-20 text-center text-slate-400 italic">Belum ada data keuangan.</div>}
            </div>
          </div>
        )}

        {/* NEWS TAB */}
        {activeTab === "news" && (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
             <div className="bg-white p-8 rounded-3xl border space-y-4">
               <h2 className="text-xl font-bold text-emerald-600">Buat Berita</h2>
               <input type="text" value={newNews.title} onChange={(e) => setNewNews({...newNews, title: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl" placeholder="Judul" />
               <select value={newNews.category} onChange={(e) => setNewNews({...newNews, category: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl"><option value="Kajian">Kajian</option><option value="Berita">Berita</option></select>
               <textarea value={newNews.content} onChange={(e) => setNewNews({...newNews, content: e.target.value})} className="w-full bg-slate-50 border p-3 h-32" placeholder="Isi berita..." />
               <input type="text" value={newNews.image_url} onChange={(e) => setNewNews({...newNews, image_url: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl" placeholder="URL Foto" />
               <button onClick={handleAddNews} className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold">Publish Berita</button>
             </div>
             <div className="space-y-4">{newsList.map(n => (<div key={n.id} className="bg-white p-4 border rounded-2xl flex gap-4"><div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden"><img src={n.image_url} className="w-full h-full object-cover" alt="" /></div><div className="flex-1"><h4 className="font-bold">{n.title}</h4><span className="text-xs text-emerald-500">{n.category}</span></div><button onClick={async () => { await supabase.from('news').delete().eq('id', n.id); fetchNews(); }} className="text-rose-500"><Trash2 size={16}/></button></div>))}</div>
           </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
           <div className="max-w-xl bg-white p-8 rounded-3xl border space-y-4 text-left">
             <h2 className="text-xl font-bold text-emerald-600">Profil Masjid</h2>
             <input type="text" value={settings.mosque_name} onChange={(e) => setSettings({...settings, mosque_name: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl" placeholder="Nama Masjid" />
             <input type="text" value={settings.qris_url} onChange={(e) => setSettings({...settings, qris_url: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl" placeholder="Link QRIS" />
             <textarea value={settings.address} onChange={(e) => setSettings({...settings, address: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl" placeholder="Alamat" />
             <button onClick={async () => { await supabase.from('mosque_settings').update(settings).eq('id', settings.id); alert("Updated!"); }} className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold">Simpan Profil</button>
           </div>
        )}

      </main>
    </div>
  );
}
