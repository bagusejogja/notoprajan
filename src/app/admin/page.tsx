"use client";

import { useState, useEffect } from "react";
import { 
  Quote, Newspaper, ShoppingBag, Wallet, Settings,
  Plus, Save, Trash2, Calendar, Clock, Upload, LogOut,
  Image as ImageIcon, Video, Users, BookOpen, Edit2, Target, MessageCircle, List, UserPlus, ArrowLeft, Loader
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("hadith");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // --- UTILITY ---
  const handleFileUpload = async (file: File, folder: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    return data.url;
  };

  // --- HERO ---
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
    if (url) { editingSlide ? setEditingSlide({ ...editingSlide, image_url: url }) : setNewSlide({ ...newSlide, image_url: url }); }
    setIsUploading(false);
  };
  const handleSaveSlide = async () => {
    const slideData = editingSlide || newSlide;
    if (!slideData.title || !slideData.image_url) return alert("Pilih Foto & Isi Judul!");
    if (editingSlide) { await supabase.from('hero_slides').update(editingSlide).eq('id', editingSlide.id); setEditingSlide(null); }
    else { await supabase.from('hero_slides').insert([newSlide]); setNewSlide({ title: "", subtitle: "", image_url: "", order_index: heroSlides.length + 1 }); }
    fetchHeroSlides();
  };

  // --- GALLERY ---
  const [galleryList, setGalleryList] = useState<any[]>([]);
  const [newGalleryTitle, setNewGalleryTitle] = useState("");
  const [editingGallery, setEditingGallery] = useState<any>(null);
  const fetchGallery = async () => {
    const { data } = await supabase.from('gallery').select('*').order('id', { ascending: false });
    if (data) setGalleryList(data);
  };
  const onGalleryUpload = async (e: any) => {
    if (!newGalleryTitle && !editingGallery) return alert("Isi judul kegiatan terlebih dahulu!");
    setIsUploading(true);
    const url = await handleFileUpload(e.target.files[0], "gallery");
    if (url) {
      if (editingGallery) { setEditingGallery({ ...editingGallery, image_url: url }); }
      else { await supabase.from('gallery').insert([{ title: newGalleryTitle, image_url: url }]); setNewGalleryTitle(""); fetchGallery(); }
    }
    setIsUploading(false);
  };

  // --- HADITH ---
  const [hadithList, setHadithList] = useState<any[]>([]);
  const [newHadith, setNewHadith] = useState({ content: "", narrator: "", source: "", display_date: new Date().toISOString().split('T')[0] });
  const [editingHadith, setEditingHadith] = useState<any>(null);
  const [bulkHadith, setBulkHadith] = useState("");
  const fetchHadiths = async () => {
    const { data } = await supabase.from('hadith').select('*').order('display_date', { ascending: false });
    if (data) setHadithList(data);
  };
  const handleSaveHadith = async () => {
    const data = editingHadith || newHadith;
    if (!data.content) return alert("Isi hadits wajib diisi!");
    if (editingHadith) { await supabase.from('hadith').update(editingHadith).eq('id', editingHadith.id); setEditingHadith(null); }
    else { await supabase.from('hadith').insert([newHadith]); setNewHadith({ content: "", narrator: "", source: "", display_date: new Date().toISOString().split('T')[0] }); }
    fetchHadiths();
  };
  const handleBulkHadith = async () => {
    if (!bulkHadith) return alert("Masukkan data hadits!");
    const lines = bulkHadith.split('\n');
    const records = lines.map(line => {
      const parts = line.split('|').map(s => s.trim());
      if (!parts[0]) return null;
      return { content: parts[0], narrator: parts[1] || "HR. Muslim", source: parts[2] || "", display_date: new Date().toISOString().split('T')[0] };
    }).filter(r => r !== null);
    if (records.length > 0) {
      await supabase.from('hadith').insert(records);
      setBulkHadith(""); fetchHadiths(); alert(`Berhasil mengunggah ${records.length} hadits!`);
    }
  };

  // --- NEWS ---
  const [newsList, setNewsList] = useState<any[]>([]);
  const [newNews, setNewNews] = useState({ title: "", category: "Kajian", content: "", image_url: "" });
  const [editingNews, setEditingNews] = useState<any>(null);
  const fetchNews = async () => {
    const { data } = await supabase.from('news').select('*').order('id', { ascending: false });
    if (data) setNewsList(data);
  };
  const onNewsUpload = async (e: any) => {
    setIsUploading(true);
    const url = await handleFileUpload(e.target.files[0], "news");
    if (url) { 
      if (editingNews) setEditingNews({ ...editingNews, image_url: url });
      else setNewNews({ ...newNews, image_url: url });
    }
    setIsUploading(false);
  };
  const handleSaveNews = async () => {
    const data = editingNews || newNews;
    if (!data.title || !data.content) return alert("Judul dan isi berita wajib diisi!");
    if (editingNews) { const { id, created_at, ...updateData } = editingNews; await supabase.from('news').update(updateData).eq('id', id); setEditingNews(null); }
    else { await supabase.from('news').insert([newNews]); setNewNews({ title: "", category: "Kajian", content: "", image_url: "" }); }
    fetchNews();
  };

  // --- FINANCE ---
  const [financeList, setFinanceList] = useState<any[]>([]);
  const [newFinance, setNewFinance] = useState({ title: "", report_date: new Date().toISOString().split('T')[0], total_income: "", total_expenditure: "", category: "Kas Masjid" });
  const [editingFinance, setEditingFinance] = useState<any>(null);
  const fetchFinance = async () => {
    const { data } = await supabase.from('financial_reports').select('*').order('report_date', { ascending: false });
    if (data) setFinanceList(data);
  };
  const handleSaveFinance = async () => {
    const data = editingFinance || newFinance;
    if (!data.title) return alert("Judul wajib diisi");
    const payload = { title: data.title, report_date: data.report_date, total_income: Number(data.total_income) || 0, total_expenditure: Number(data.total_expenditure) || 0, category: data.category };
    if (editingFinance) { await supabase.from('financial_reports').update(payload).eq('id', editingFinance.id); setEditingFinance(null); }
    else { await supabase.from('financial_reports').insert([payload]); setNewFinance({ title: "", report_date: new Date().toISOString().split('T')[0], total_income: "", total_expenditure: "", category: "Kas Masjid" }); }
    fetchFinance();
  };

  const [bulkFinance, setBulkFinance] = useState("");
  const handleBulkFinance = async () => {
    if (!bulkFinance) return alert("Masukkan data keuangan!");
    const lines = bulkFinance.split('\n');
    const records = lines.map(line => {
      const parts = line.split('|').map(s => s.trim());
      if (!parts[0] || !parts[1]) return null;
      return { 
        title: parts[1], 
        report_date: parts[0], 
        total_income: Number(parts[2]) || 0, 
        total_expenditure: Number(parts[3]) || 0, 
        category: parts[4] || "Kas Masjid" 
      };
    }).filter(r => r !== null) as any[];
    if (records.length > 0) {
      await supabase.from('financial_reports').insert(records);
      setBulkFinance(""); fetchFinance(); alert(`Berhasil mengunggah ${records.length} laporan keuangan!`);
    }
  };

  // --- DONATION ---
  const [donationList, setDonationList] = useState<any[]>([]);
  const [newDonation, setNewDonation] = useState({ title: "", description: "", target_amount: "", current_amount: "", deadline: "" });
  const [editingDonation, setEditingDonation] = useState<any>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [donationLogs, setDonationLogs] = useState<any[]>([]);
  const [newLog, setNewLog] = useState({ donor_name: "", via: "BSI", amount: "", donation_date: new Date().toISOString().split('T')[0] });
  const [editingLog, setEditingLog] = useState<any>(null);
  const [bulkLog, setBulkLog] = useState("");

  // --- USER MANAGEMENT ---
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "humas", nama_lengkap: "", email: "", wa: "" });
  const fetchAdminUsers = async () => {
    const { data } = await supabase.from('admin_users').select('*').order('id', { ascending: true });
    if (data) setAdminUsers(data);
  };
  const handleSaveUser = async () => {
    if (!newUser.username || !newUser.password) return alert("Username dan Password wajib!");
    await supabase.from('admin_users').insert([newUser]);
    setNewUser({ username: "", password: "", role: "humas", nama_lengkap: "", email: "", wa: "" });
    fetchAdminUsers();
  };
  const deleteUser = async (id: number) => {
    if(!confirm("Hapus user?")) return;
    await supabase.from('admin_users').delete().eq('id', id);
    fetchAdminUsers();
  };

  async function fetchDonations() {
    // Safe Fetch: Get all and filter in JS
    const { data, error } = await supabase.from('donation_campaigns').select('*');
    if (data) {
      const active = data.filter((c: any) => c.is_active !== false);
      setDonationList(active);
    }
  }

  const fetchLogs = async (campaignId: number) => {
    const { data } = await supabase.from('donation_logs').select('*').eq('campaign_id', campaignId).order('donation_date', { ascending: false });
    if (data) setDonationLogs(data);
  };
  const handleSaveDonation = async () => {
    const data = editingDonation || newDonation;
    if (!data.title) return alert("Judul wajib diisi");
    const payload = { 
      title: data.title, 
      description: data.description, 
      target_amount: Number(data.target_amount) || 0, 
      current_amount: Number(data.current_amount) || 0, 
      deadline: data.deadline,
      is_active: data.is_active ?? true // Default to true if not set
    };
    if (editingDonation) { await supabase.from('donation_campaigns').update(payload).eq('id', editingDonation.id); setEditingDonation(null); }
    else { await supabase.from('donation_campaigns').insert([payload]); setNewDonation({ title: "", description: "", target_amount: "", current_amount: "", deadline: "" }); }
    fetchDonations();
  };
  const handleSaveLog = async () => {
    const logData = editingLog || newLog;
    if (!logData.donor_name || !logData.amount) return alert("Nama dan Nominal wajib diisi");
    
    const payload = { 
      donor_name: logData.donor_name,
      amount: Number(logData.amount),
      via: logData.via,
      donation_date: logData.donation_date,
      campaign_id: selectedCampaign.id 
    };

    if (editingLog) {
      const { error } = await supabase.from('donation_logs').update(payload).eq('id', editingLog.id);
      if (error) return alert(error.message);
      
      // Recalculate campaign total after edit
      const { data: allLogs } = await supabase.from('donation_logs').select('amount').eq('campaign_id', selectedCampaign.id);
      const newTotal = allLogs?.reduce((sum, l) => sum + l.amount, 0) || 0;
      await supabase.from('donation_campaigns').update({ current_amount: newTotal }).eq('id', selectedCampaign.id);
      setSelectedCampaign({ ...selectedCampaign, current_amount: newTotal });
      setEditingLog(null);
    } else {
      const { error } = await supabase.from('donation_logs').insert([payload]);
      if (error) return alert(error.message);
      const newTotal = Number(selectedCampaign.current_amount) + Number(logData.amount);
      await supabase.from('donation_campaigns').update({ current_amount: newTotal }).eq('id', selectedCampaign.id);
      setNewLog({ donor_name: "", via: "BSI", amount: "", donation_date: new Date().toISOString().split('T')[0] });
      setSelectedCampaign({ ...selectedCampaign, current_amount: newTotal });
    }
    
    fetchLogs(selectedCampaign.id); 
    fetchDonations();
    alert("Data Donatur Berhasil Disimpan!");
  };

  const handleBulkLog = async () => {
    if (!bulkLog || !selectedCampaign) return alert("Masukkan data donatur!");
    const lines = bulkLog.split('\n');
    const records = lines.map(line => {
      const parts = line.split('|').map(s => s.trim());
      if (!parts[0] || !parts[1]) return null;
      return { 
         donor_name: parts[0], 
         via: parts[1] || "BSI", 
         amount: Number(parts[2]) || 0, 
         donation_date: parts[3] || new Date().toISOString().split('T')[0],
         campaign_id: selectedCampaign.id
      };
    }).filter(r => r !== null && r.amount > 0) as any[];
    
    if (records.length > 0) {
      await supabase.from('donation_logs').insert(records);
      const { data: allLogs } = await supabase.from('donation_logs').select('amount').eq('campaign_id', selectedCampaign.id);
      const newTotal = allLogs?.reduce((sum, l) => sum + l.amount, 0) || 0;
      await supabase.from('donation_campaigns').update({ current_amount: newTotal }).eq('id', selectedCampaign.id);
      setSelectedCampaign({ ...selectedCampaign, current_amount: newTotal });
      setBulkLog(""); fetchLogs(selectedCampaign.id); fetchDonations(); alert(`Berhasil mengunggah ${records.length} donatur!`);
    }
  };

  // --- SETTINGS (PROFIL MASJID) ---
  const [mosqueInfo, setMosqueInfo] = useState({ 
    name: "Masjid Notoprajan", address: "", phone: "", vision: "", mission: "", instagram: "", facebook: "",
    bank_name: "Bank Syariah Indonesia (BSI)", account_number: "", account_name: "", qris_url: "",
    correction_subuh: "0", correction_dzuhur: "0", correction_ashar: "0", correction_maghrib: "0", correction_isya: "0"
  });
  const fetchSettings = async () => {
    const { data } = await supabase.from('mosque_settings').select('*').limit(1);
    if (data && data.length > 0) {
      const row = data[0];
      setMosqueInfo((prev) => ({
        ...prev,
        name: row.mosque_name || prev.name,
        address: row.address || prev.address,
        qris_url: row.qris_url || prev.qris_url,
        account_number: row.bank_account || prev.account_number,
        correction_subuh: row.correction_subuh || "0",
        correction_dzuhur: row.correction_dzuhur || "0",
        correction_ashar: row.correction_ashar || "0",
        correction_maghrib: row.correction_maghrib || "0",
        correction_isya: row.correction_isya || "0"
      }));
    }
  };

  const onQRISUpload = async (e: any) => {
    setIsUploading(true);
    const url = await handleFileUpload(e.target.files[0], "settings");
    if (url) setMosqueInfo({ ...mosqueInfo, qris_url: url });
    setIsUploading(false);
  };

  const handleSaveSettings = async () => {
    const payload = {
      mosque_name: mosqueInfo.name,
      address: mosqueInfo.address,
      qris_url: mosqueInfo.qris_url,
      bank_account: mosqueInfo.account_number,
      // Jika kolom koreksi ini belum ada di DB, Supabase mungkin akan menolak. 
      // Kita masukkan agar siap jika User sudah menambahkan kolomnya (sesuai instruksi "ditambahkan").
      correction_subuh: Number(mosqueInfo.correction_subuh),
      correction_dzuhur: Number(mosqueInfo.correction_dzuhur),
      correction_ashar: Number(mosqueInfo.correction_ashar),
      correction_maghrib: Number(mosqueInfo.correction_maghrib),
      correction_isya: Number(mosqueInfo.correction_isya)
    };
    
    // Asumsikan row pengaturan utama ada di ID 1
    const { error } = await supabase.from('mosque_settings').update(payload).eq('id', 1);
    
    if (error) {
       console.error("Update settings error:", error);
       alert("Gagal update. Pastikan kolom-kolom (terutama correction_*) sudah ditambahkan di tabel mosque_settings! Detail: " + error.message);
    } else {
       alert("Profil Masjid & Informasi Donasi Diperbarui!");
    }
  };

  // --- FRIDAY SERVICE (JUMATAN) ---
  const [fridayList, setFridayList] = useState<any[]>([]);
  const [fridayPage, setFridayPage] = useState(0);
  const [newFriday, setNewFriday] = useState({ kotib: "", tema: "", imam: "", muadzin: "", date: new Date().toISOString().split('T')[0] });
  const [editingFriday, setEditingFriday] = useState<any>(null);
  const [bulkFriday, setBulkFriday] = useState("");
  
  const fetchFriday = async () => {
    const { data } = await supabase.from('friday_schedules').select('*').order('date', { ascending: false }).range(fridayPage * 5, (fridayPage * 5) + 4);
    if (data) setFridayList(data);
  };
  const handleSaveFriday = async () => {
    const data = editingFriday || newFriday;
    const payload = { kotib: data.kotib, tema: data.tema, imam: data.imam, muadzin: data.muadzin, date: data.date };
    if (editingFriday) { await supabase.from('friday_schedules').update(payload).eq('id', editingFriday.id); setEditingFriday(null); }
    else { await supabase.from('friday_schedules').insert([payload]); setNewFriday({ kotib: "", tema: "", imam: "", muadzin: "", date: new Date().toISOString().split('T')[0] }); }
    fetchFriday();
  };
  const handleBulkFriday = async () => {
    if (!bulkFriday) return alert("Masukkan data!");
    const lines = bulkFriday.split('\n');
    const records = lines.map(line => {
      const p = line.split('|').map(s => s.trim());
      if (!p[0] || !p[4]) return null;
      return { kotib: p[0], tema: p[1] || "", imam: p[2] || "", muadzin: p[3] || "", date: p[4] };
    }).filter(r => r !== null);
    if (records.length > 0) { await supabase.from('friday_schedules').insert(records); setBulkFriday(""); fetchFriday(); alert("Berhasil!"); }
  };

  // --- QA (FAQ) ---
  const [faqs, setFaqs] = useState<any[]>([]);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const fetchFaqs = async () => {
    let { data, error } = await supabase.from('faqs').select('*').order('id', { ascending: true });
    if (error || !data) {
      const { data: singularData } = await supabase.from('faq').select('*').order('id', { ascending: true });
      if (singularData) data = singularData;
    }
    if (data) setFaqs(data);
  };
  const handleSaveFaq = async () => {
    const data = editingFaq || newFaq;
    if (editingFaq) { await supabase.from('faqs').update({ question: data.question, answer: data.answer }).eq('id', editingFaq.id); setEditingFaq(null); }
    else { await supabase.from('faqs').insert([{ question: data.question, answer: data.answer }]); setNewFaq({ question: "", answer: "" }); }
    fetchFaqs();
  };
  const deleteFaq = async (id: number) => {
    if (!confirm("Hapus?")) return;
    await supabase.from('faqs').delete().eq('id', id);
    fetchFaqs();
  };

  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpData, setSignUpData] = useState({ username: "", password: "", nama_lengkap: "", email: "", wa: "" });
  const [rolePermissions, setRolePermissions] = useState<any[]>([]);

  const fetchRolePermissions = async () => {
    const { data } = await supabase.from('role_permissions').select('*').order('id', { ascending: true });
    if (data) setRolePermissions(data);
  };
  const updateRoleMenu = async (rp: any, menuId: string, isChecked: boolean) => {
    let newMenus = [...rp.menus];
    if (isChecked && !newMenus.includes(menuId)) newMenus.push(menuId);
    if (!isChecked) newMenus = newMenus.filter((m: string) => m !== menuId);
    await supabase.from('role_permissions').update({ menus: newMenus }).eq('id', rp.id);
    fetchRolePermissions();
  };

  useEffect(() => {
    if (currentUser) {
      fetchHadiths(); fetchHeroSlides(); fetchGallery(); fetchNews(); fetchFinance(); fetchDonations(); fetchFaqs(); fetchSettings(); fetchFriday(); fetchRolePermissions();
      if (currentUser.role === 'superadmin') fetchAdminUsers();
    }
  }, [currentUser, fridayPage]);

  const handleLogin = async () => {
    // Fallback darurat jika tabel admin_users belum dibuat
    if (username === "admin" && password === "1") {
      setCurrentUser({ username: "admin", role: "superadmin", nama_lengkap: "Admin Utama" });
      return;
    }
    const { data, error } = await supabase.from('admin_users').select('*').eq('username', username).eq('password', password).single();
    if (data) setCurrentUser(data);
    else alert("Username atau Password salah (atau tabel belum dibuat)!");
  };

  const handleSignUp = async () => {
    if (!signUpData.username || !signUpData.password || !signUpData.nama_lengkap) return alert("Username, Password, dan Nama Lengkap wajib diisi!");
    // Default sign up is guest/humas until approved. Let's set it to 'humas' for basic access.
    const { error } = await supabase.from('admin_users').insert([{ ...signUpData, role: 'humas' }]);
    if (error) {
       alert("Gagal mendaftar: " + error.message);
    } else {
       alert("Pendaftaran berhasil! Silakan login.");
       setIsSignUp(false);
       setUsername(signUpData.username);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[2.5rem] border w-full max-w-md shadow-2xl text-center space-y-8 relative overflow-hidden">
           <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-lg shadow-emerald-500/30">M</div>
           <div className="space-y-1">
             <h1 className="text-2xl font-bold font-outfit text-slate-800">{isSignUp ? "Daftar Akun Baru" : "Login Portal Admin"}</h1>
             <p className="text-sm text-slate-500">{isSignUp ? "Lengkapi data diri Anda" : "Masuk sesuai hak akses Anda"}</p>
           </div>
           
           {!isSignUp ? (
             <>
               <div className="space-y-4">
                 <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-slate-50 border p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="Username" />
                 <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} className="w-full bg-slate-50 border p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="Password" />
               </div>
               <button onClick={handleLogin} className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold tracking-widest hover:bg-emerald-600 transition-colors shadow-lg">LOGIN SEKARANG</button>
               <div className="text-sm text-slate-500">Belum punya akun? <button onClick={() => setIsSignUp(true)} className="text-emerald-600 font-bold hover:underline">Daftar di sini</button></div>
             </>
           ) : (
             <>
               <div className="space-y-3 text-left">
                 <input type="text" value={signUpData.nama_lengkap} onChange={(e) => setSignUpData({...signUpData, nama_lengkap: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl text-sm" placeholder="Nama Lengkap *" />
                 <input type="text" value={signUpData.username} onChange={(e) => setSignUpData({...signUpData, username: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl text-sm" placeholder="Username *" />
                 <input type="password" value={signUpData.password} onChange={(e) => setSignUpData({...signUpData, password: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl text-sm" placeholder="Password *" />
                 <input type="email" value={signUpData.email} onChange={(e) => setSignUpData({...signUpData, email: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl text-sm" placeholder="Email" />
                 <input type="text" value={signUpData.wa} onChange={(e) => setSignUpData({...signUpData, wa: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl text-sm" placeholder="Nomor WhatsApp" />
               </div>
               <div className="flex gap-2">
                 <button onClick={() => setIsSignUp(false)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-xl font-bold">Batal</button>
                 <button onClick={handleSignUp} className="flex-[2] bg-emerald-500 text-white py-4 rounded-xl font-bold shadow-lg">DAFTAR</button>
               </div>
             </>
           )}
        </div>
      </div>
    );
  }

  let allSidebarItems = [
    { id: "hero", label: "Slider Header", icon: ImageIcon, roles: ["superadmin", "humas"] },
    { id: "friday", label: "Jadwal Jumatan", icon: BookOpen, roles: ["superadmin", "humas", "takmir"] },
    { id: "gallery", label: "Galeri Foto", icon: Plus, roles: ["superadmin", "humas"] },
    { id: "hadith", label: "Hadits Harian", icon: Quote, roles: ["superadmin", "humas", "takmir"] },
    { id: "news", label: "Berita & Kajian", icon: Newspaper, roles: ["superadmin", "humas"] },
    { id: "finance", label: "Keuangan", icon: Wallet, roles: ["superadmin", "bendahara"] },
    { id: "donation", label: "Donasi Khusus", icon: Target, roles: ["superadmin", "bendahara"] },
    { id: "settings", label: "Profil & Rekening", icon: Settings, roles: ["superadmin"] },
    { id: "qa", label: "Tanya Jawab", icon: MessageCircle, roles: ["superadmin", "humas"] },
    { id: "users", label: "Manajemen User", icon: Users, roles: ["superadmin"] },
  ];

  if (rolePermissions.length > 0) {
     allSidebarItems = allSidebarItems.map(item => {
        let dynamicRoles = rolePermissions.filter(rp => rp.menus.includes(item.id)).map(rp => rp.role);
        if (!dynamicRoles.includes("superadmin")) dynamicRoles.push("superadmin");
        return { ...item, roles: dynamicRoles.length > 0 ? dynamicRoles : item.roles };
     });
  }

  const sidebarItems = allSidebarItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-inter">
      <aside className="w-64 border-r border-slate-200 bg-white p-6 flex flex-col justify-between shadow-sm z-10">
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="font-outfit font-black text-2xl text-emerald-600 px-2 tracking-tight">Portal Admin</div>
            <div className="px-2">
              <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">{currentUser.role}</span>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            {sidebarItems.map(item => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setSelectedCampaign(null); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? "bg-emerald-500 text-white shadow-lg" : "text-slate-500 hover:bg-slate-100"}`}>
                <item.icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <button onClick={() => { setCurrentUser(null); setPassword(""); setUsername(""); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all font-bold">
          <LogOut size={20} />
          <span className="text-sm">Logout</span>
        </button>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        {activeTab === "hero" && (
           <div className="space-y-8 text-left">
              <h2 className="text-2xl font-bold">Slider Header</h2>
              <div className="bg-white p-8 rounded-3xl border space-y-4">
                 <h3 className="font-bold text-emerald-600">{editingSlide ? "Edit Slide" : "Tambah Slide Baru"}</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" value={editingSlide ? editingSlide.title : newSlide.title} onChange={(e) => editingSlide ? setEditingSlide({...editingSlide, title: e.target.value}) : setNewSlide({...newSlide, title: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl" placeholder="Judul (Title)" />
                    <input type="text" value={editingSlide ? editingSlide.subtitle : newSlide.subtitle} onChange={(e) => editingSlide ? setEditingSlide({...editingSlide, subtitle: e.target.value}) : setNewSlide({...newSlide, subtitle: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl" placeholder="Sub-Judul (Subtitle)" />
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-2">
                       <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Upload Gambar Header</label>
                       <input type="file" onChange={onHeroUpload} className="w-full bg-slate-50 p-2 rounded-xl border border-dashed" />
                    </div>
                    {isUploading && <div className="animate-spin text-emerald-500"><Loader size={20}/></div>}
                 </div>
                 <div className="flex gap-2">
                    {editingSlide && <button onClick={() => setEditingSlide(null)} className="flex-1 bg-slate-100 py-4 rounded-xl font-bold">Batal</button>}
                    <button onClick={handleSaveSlide} className="flex-[2] bg-emerald-500 text-white py-4 rounded-xl font-bold shadow-lg">Simpan Slide</button>
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {heroSlides.map(s => (
                    <div key={s.id} className="bg-white p-4 border rounded-[2rem] relative group shadow-sm">
                       <img src={s.image_url} className="w-full h-40 object-cover rounded-2xl" />
                       <div className="mt-3 px-2">
                          <div className="font-bold text-sm truncate">{s.title}</div>
                          <div className="text-[10px] text-slate-400 truncate">{s.subtitle}</div>
                       </div>
                       <div className="absolute top-6 right-6 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => setEditingSlide(s)} className="p-2 bg-white text-emerald-600 rounded-lg shadow-xl"><Edit2 size={16}/></button>
                          <button onClick={async () => { if(confirm("Hapus?")){ await supabase.from('hero_slides').delete().eq('id', s.id); fetchHeroSlides(); } }} className="p-2 bg-white text-rose-500 rounded-lg shadow-xl"><Trash2 size={16}/></button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {activeTab === "hadith" && (
          <div className="space-y-8 text-left">
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-emerald-600">{editingHadith ? "Edit Hadits" : "Update Hadits Harian"}</h2>
              <textarea value={editingHadith ? editingHadith.content : newHadith.content} onChange={(e) => editingHadith ? setEditingHadith({...editingHadith, content: e.target.value}) : setNewHadith({...newHadith, content: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl h-32 outline-none" placeholder="Isi Hadits..." />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={editingHadith ? editingHadith.narrator : newHadith.narrator} onChange={(e) => editingHadith ? setEditingHadith({...editingHadith, narrator: e.target.value}) : setNewHadith({...newHadith, narrator: e.target.value})} className="bg-slate-50 border p-4 rounded-xl" placeholder="Perawi" />
                <input type="date" value={editingHadith ? editingHadith.display_date : newHadith.display_date} onChange={(e) => editingHadith ? setEditingHadith({...editingHadith, display_date: e.target.value}) : setNewHadith({...newHadith, display_date: e.target.value})} className="bg-slate-50 border p-4 rounded-xl" />
              </div>
              <div className="flex gap-2">
                 {editingHadith && <button onClick={() => setEditingHadith(null)} className="flex-1 bg-slate-100 py-4 rounded-xl font-bold">Batal</button>}
                 <button onClick={handleSaveHadith} className="flex-[2] bg-emerald-500 text-white py-4 rounded-xl font-bold shadow-lg">Simpan Hadits</button>
              </div>
            </div>

            <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
               <div className="p-4 bg-slate-50 border-b font-bold text-slate-700 flex justify-between">
                  <span>Daftar Hadits Terakhir</span>
                  <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600">Total: {hadithList.length}</span>
               </div>
               <div className="max-h-[400px] overflow-auto">
                  <table className="w-full text-sm">
                     <tbody className="divide-y">
                        {hadithList.map(h => (
                           <tr key={h.id} className="hover:bg-slate-50">
                              <td className="p-4 text-xs text-slate-400 w-24">{h.display_date}</td>
                              <td className="p-4"><div className="font-medium line-clamp-1">{h.content}</div><div className="text-[10px] text-emerald-600 font-bold uppercase">{h.narrator}</div></td>
                              <td className="p-4 text-right">
                                 <button onClick={() => setEditingHadith(h)} className="p-2 text-indigo-500"><Edit2 size={16}/></button>
                                 <button onClick={async () => { if(confirm("Hapus?")){ await supabase.from('hadith').delete().eq('id', h.id); fetchHadiths(); } }} className="p-2 text-rose-500"><Trash2 size={16}/></button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
               <h3 className="font-bold mb-2">Bulk Upload Hadits</h3>
               <textarea value={bulkHadith} onChange={(e) => setBulkHadith(e.target.value)} className="w-full bg-white border p-3 rounded-xl h-24 mb-3" placeholder="Hadits | Perawi | Sumber" />
               <button onClick={handleBulkHadith} className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-bold">Upload Massal</button>
            </div>
          </div>
        )}

        {activeTab === "finance" && (
          <div className="space-y-8 text-left">
            {/* FINANCE SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
                  <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Total Pemasukan</div>
                  <div className="text-3xl font-black text-slate-800 font-outfit">Rp {financeList.reduce((acc, curr) => acc + (Number(curr.total_income) || 0), 0).toLocaleString()}</div>
               </div>
               <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
                  <div className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-1">Total Pengeluaran</div>
                  <div className="text-3xl font-black text-slate-800 font-outfit">Rp {financeList.reduce((acc, curr) => acc + (Number(curr.total_expenditure) || 0), 0).toLocaleString()}</div>
               </div>
               <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-xl">
                  <div className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-1">Saldo Kas Aktif</div>
                  <div className="text-3xl font-black font-outfit">Rp {(financeList.reduce((acc, curr) => acc + (Number(curr.total_income) || 0), 0) - financeList.reduce((acc, curr) => acc + (Number(curr.total_expenditure) || 0), 0)).toLocaleString()}</div>
               </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border space-y-4 shadow-sm">
              <h2 className="text-xl font-bold text-emerald-600">Input Laporan Keuangan</h2>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={editingFinance ? editingFinance.title : newFinance.title} onChange={(e) => editingFinance ? setEditingFinance({...editingFinance, title: e.target.value}) : setNewFinance({...newFinance, title: e.target.value})} className="bg-slate-50 border p-4 rounded-xl" placeholder="Keterangan (Infaq Jumat, dll)" />
                <input type="date" value={editingFinance ? editingFinance.report_date : newFinance.report_date} onChange={(e) => editingFinance ? setEditingFinance({...editingFinance, report_date: e.target.value}) : setNewFinance({...newFinance, report_date: e.target.value})} className="bg-slate-50 border p-4 rounded-xl" />
                <input type="number" value={editingFinance ? editingFinance.total_income : newFinance.total_income} onChange={(e) => editingFinance ? setEditingFinance({...editingFinance, total_income: e.target.value}) : setNewFinance({...newFinance, total_income: e.target.value})} className="bg-slate-50 border p-4 rounded-xl" placeholder="Pemasukan (Rp)" />
                <input type="number" value={editingFinance ? editingFinance.total_expenditure : newFinance.total_expenditure} onChange={(e) => editingFinance ? setEditingFinance({...editingFinance, total_expenditure: e.target.value}) : setNewFinance({...newFinance, total_expenditure: e.target.value})} className="bg-slate-50 border p-4 rounded-xl" placeholder="Pengeluaran (Rp)" />
              </div>
              <button onClick={handleSaveFinance} className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold shadow-lg">Simpan Laporan</button>
            </div>
            <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
               <table className="w-full text-sm">
                 <thead className="bg-slate-50 font-bold"><tr><th className="p-4 text-left">Tanggal</th><th className="p-4 text-left">Keterangan</th><th className="p-4 text-right text-emerald-600">Masuk</th><th className="p-4 text-right text-rose-500">Keluar</th><th className="p-4 text-center">Aksi</th></tr></thead>
                 <tbody className="divide-y">
                    {financeList.map(f => (
                      <tr key={f.id}>
                        <td className="p-4">{f.report_date}</td>
                        <td className="p-4 font-bold">{f.title}</td>
                        <td className="p-4 text-right">Rp {f.total_income.toLocaleString()}</td>
                        <td className="p-4 text-right">Rp {f.total_expenditure.toLocaleString()}</td>
                        <td className="p-4 text-center">
                           <button onClick={() => setEditingFinance(f)} className="p-2 text-indigo-500"><Edit2 size={16}/></button>
                           <button onClick={async () => { if(confirm("Hapus?")){ await supabase.from('financial_reports').delete().eq('id', f.id); fetchFinance(); } }} className="p-2 text-rose-500"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
            </div>
            
            <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 mt-4">
               <h3 className="font-bold mb-2">Bulk Upload Keuangan</h3>
               <p className="text-[10px] text-emerald-700 mb-2 uppercase font-bold">Format: Tanggal (YYYY-MM-DD) | Keterangan | Nominal Masuk | Nominal Keluar | Kategori</p>
               <textarea value={bulkFinance} onChange={(e) => setBulkFinance(e.target.value)} className="w-full bg-white border p-3 rounded-xl h-24 mb-3" placeholder="2024-12-25 | Infaq Jumat | 1500000 | 0 | Kas Masjid" />
               <button onClick={handleBulkFinance} className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-bold">Upload Massal</button>
            </div>
          </div>
        )}

        {activeTab === "donation" && (
          <div className="space-y-8 text-left">
            {!selectedCampaign ? (
              <>
                <div className="bg-white p-8 rounded-3xl border space-y-6 shadow-sm">
                  <h2 className="text-xl font-bold text-emerald-600">{editingDonation ? "Edit Program Donasi" : "Buat Program Donasi Baru"}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" value={editingDonation ? editingDonation.title : newDonation.title} onChange={(e) => editingDonation ? setEditingDonation({...editingDonation, title: e.target.value}) : setNewDonation({...newDonation, title: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl" placeholder="Judul Program (Misal: Renovasi Atap)" />
                    <input type="text" value={editingDonation ? editingDonation.deadline : newDonation.deadline} onChange={(e) => editingDonation ? setEditingDonation({...editingDonation, deadline: e.target.value}) : setNewDonation({...newDonation, deadline: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl" placeholder="Deadline (Misal: 31 Des 2024)" />
                  </div>
                  <textarea value={editingDonation ? editingDonation.description : newDonation.description} onChange={(e) => editingDonation ? setEditingDonation({...editingDonation, description: e.target.value}) : setNewDonation({...newDonation, description: e.target.value})} className="w-full bg-slate-50 border p-4 h-24 rounded-xl" placeholder="Kalimat Ajakan Donasi..." />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" value={editingDonation ? editingDonation.target_amount : newDonation.target_amount} onChange={(e) => editingDonation ? setEditingDonation({...editingDonation, target_amount: e.target.value}) : setNewDonation({...newDonation, target_amount: e.target.value})} className="bg-slate-50 border p-4 rounded-xl" placeholder="Target Donasi (Rp)" />
                    <input type="number" value={editingDonation ? editingDonation.current_amount : newDonation.current_amount} onChange={(e) => editingDonation ? setEditingDonation({...editingDonation, current_amount: e.target.value}) : setNewDonation({...newDonation, current_amount: e.target.value})} className="bg-slate-50 border p-4 rounded-xl" placeholder="Terkumpul Awal (Rp)" />
                  </div>
                  <div className="flex items-center gap-3 px-4">
                    <input 
                      type="checkbox" 
                      id="is_active"
                      checked={editingDonation ? (editingDonation.is_active ?? true) : true} 
                      onChange={(e) => editingDonation ? setEditingDonation({...editingDonation, is_active: e.target.checked}) : null} 
                      className="w-5 h-5 accent-emerald-500"
                    />
                    <label htmlFor="is_active" className="text-sm font-bold text-slate-600">Tampilkan di Halaman Web</label>
                  </div>
                  <button onClick={handleSaveDonation} className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold shadow-lg transition-all hover:bg-emerald-600">
                    {editingDonation ? "Simpan Perubahan Program" : "Publikasikan Program Baru"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {donationList.map(d => (
                    <div key={d.id} className={`bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-6 relative border-t-4 ${d.is_active === false ? 'border-t-slate-300 opacity-70' : 'border-t-emerald-500'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-xl text-slate-800">{d.title}</h3>
                          <div className="text-[10px] font-bold uppercase tracking-widest mt-1">
                            {d.is_active === false ? <span className="text-rose-500">Non-Aktif (Hidden)</span> : <span className="text-emerald-500">Aktif di Web</span>}
                          </div>
                        </div>
                        <div className="flex gap-1">
                           <button onClick={() => setEditingDonation(d)} className="p-2 text-slate-400 hover:text-indigo-500"><Edit2 size={16}/></button>
                           <button onClick={async () => { if(confirm("Hapus Program ini beserta semua datanya?")){ await supabase.from('donation_campaigns').delete().eq('id', d.id); fetchDonations(); } }} className="p-2 text-slate-400 hover:text-rose-500"><Trash2 size={16}/></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-500 bg-slate-50 p-4 rounded-2xl">
                         <div>Target: <span className="text-slate-900 block">Rp {d.target_amount.toLocaleString()}</span></div>
                         <div>Terkumpul: <span className="text-emerald-600 block">Rp {d.current_amount.toLocaleString()}</span></div>
                      </div>
                      <button onClick={() => { setSelectedCampaign(d); fetchLogs(d.id); }} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 tracking-widest uppercase text-xs hover:bg-emerald-600 transition-all">
                        <UserPlus size={18} /> KELOLA DONATUR ({d.current_amount > 0 ? "LIHAT REKAP" : "INPUT BARU"})
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
                <div className="flex justify-between items-center">
                  <button onClick={() => { setSelectedCampaign(null); setEditingLog(null); }} className="flex items-center gap-2 text-slate-500 font-bold hover:text-emerald-600 transition-colors bg-white px-4 py-2 rounded-xl border">
                    <ArrowLeft size={20} /> Kembali ke Daftar Program
                  </button>
                  <div className="bg-white px-6 py-2 rounded-full border text-xs font-bold text-slate-500">
                    ID Program: #{selectedCampaign.id}
                  </div>
                </div>

                {/* REKAP CARD */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="bg-emerald-950 p-8 rounded-[2.5rem] text-white shadow-xl md:col-span-2">
                      <div className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-1">Program:</div>
                      <h2 className="text-3xl font-black uppercase tracking-tight mb-4">{selectedCampaign.title}</h2>
                      <div className="flex gap-8 border-t border-white/10 pt-4">
                         <div>
                            <div className="text-[10px] uppercase font-bold text-emerald-500/50 mb-1">Target Dana</div>
                            <div className="text-xl font-bold">Rp {selectedCampaign.target_amount.toLocaleString()}</div>
                         </div>
                         <div>
                            <div className="text-[10px] uppercase font-bold text-emerald-500/50 mb-1">Total Terkumpul</div>
                            <div className="text-xl font-bold text-amber-400">Rp {selectedCampaign.current_amount.toLocaleString()}</div>
                         </div>
                         <div>
                            <div className="text-[10px] uppercase font-bold text-emerald-500/50 mb-1">Kekurangan</div>
                            <div className="text-xl font-bold text-rose-400">Rp {Math.max(0, selectedCampaign.target_amount - selectedCampaign.current_amount).toLocaleString()}</div>
                         </div>
                      </div>
                   </div>
                   <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm flex flex-col justify-center items-center text-center">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Progres</div>
                      <div className="text-5xl font-black text-emerald-600 mb-2">{Math.min(100, Math.floor((selectedCampaign.current_amount / selectedCampaign.target_amount) * 100))}%</div>
                      <div className="text-xs font-bold text-slate-500">Dari {donationLogs.length} Donatur</div>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b pb-4">
                      {editingLog ? "📝 Edit Data Donatur" : "📝 Input Donatur Baru"}
                    </h3>
                    <div className="space-y-4">
                       <div>
                          <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Nama Donatur</label>
                          <input type="text" value={editingLog ? editingLog.donor_name : newLog.donor_name} onChange={(e) => editingLog ? setEditingLog({...editingLog, donor_name: e.target.value}) : setNewLog({...newLog, donor_name: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl mt-1" placeholder="Misal: Hamba Allah" />
                       </div>
                       <div>
                          <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Nominal (Rp)</label>
                          <input type="number" value={editingLog ? editingLog.amount : newLog.amount} onChange={(e) => editingLog ? setEditingLog({...editingLog, amount: e.target.value}) : setNewLog({...newLog, amount: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl mt-1 font-bold text-emerald-600" placeholder="100000" />
                       </div>
                       <div className="grid grid-cols-1 gap-4">
                          <div>
                             <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Metode Pembayaran</label>
                             <select value={editingLog ? editingLog.via : newLog.via} onChange={(e) => editingLog ? setEditingLog({...editingLog, via: e.target.value}) : setNewLog({...newLog, via: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl mt-1">
                               <option value="BSI">Bank Syariah Indonesia (BSI)</option>
                               <option value="QRIS">QRIS / Digital Payment</option>
                               <option value="Tunai">Tunai / Kotak Infaq</option>
                             </select>
                          </div>
                          <div>
                             <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Tanggal Donasi</label>
                             <input type="date" value={editingLog ? editingLog.donation_date : newLog.donation_date} onChange={(e) => editingLog ? setEditingLog({...editingLog, donation_date: e.target.value}) : setNewLog({...newLog, donation_date: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl mt-1" />
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       {editingLog && <button onClick={() => setEditingLog(null)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold">Batal</button>}
                       <button onClick={handleSaveLog} className="flex-[2] bg-emerald-500 text-white py-5 rounded-2xl font-black tracking-widest shadow-xl hover:bg-emerald-600 transition-all">
                          {editingLog ? "SIMPAN PERUBAHAN" : "SIMPAN DATA DONATUR"}
                       </button>
                    </div>
                  </div>

                  <div className="lg:col-span-2 bg-white border rounded-3xl overflow-hidden shadow-sm flex flex-col">
                    <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
                       <h3 className="font-bold text-slate-700">Daftar Donatur Terdaftar</h3>
                       <span className="text-[10px] font-bold text-slate-400 bg-white px-3 py-1 rounded-full border uppercase">{donationLogs.length} Entri</span>
                    </div>
                    <div className="flex-1 overflow-auto max-h-[600px]">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 sticky top-0 z-10 text-[10px] uppercase font-black tracking-widest">
                          <tr><th className="p-4 text-left">Tanggal</th><th className="p-4 text-left">Nama</th><th className="p-4 text-center">Via</th><th className="p-4 text-right">Nominal</th><th className="p-4 text-center">Aksi</th></tr>
                        </thead>
                        <tbody className="divide-y">
                          {donationLogs.map(log => (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-4 text-slate-500">{log.donation_date}</td>
                              <td className="p-4 font-bold">{log.donor_name}</td>
                              <td className="p-4 text-center"><span className="px-2 py-1 rounded-md bg-slate-100 text-[10px] font-bold">{log.via}</span></td>
                              <td className="p-4 text-right font-black text-emerald-600">Rp {log.amount.toLocaleString()}</td>
                              <td className="p-4 text-center">
                                 <div className="flex gap-2 justify-center">
                                    <button onClick={() => setEditingLog(log)} className="text-indigo-500 hover:scale-110 transition-transform"><Edit2 size={16}/></button>
                                    <button onClick={async () => { if(confirm("Hapus data donatur ini?")){ await supabase.from('donation_logs').delete().eq('id', log.id); fetchLogs(selectedCampaign.id); } }} className="text-rose-500 hover:scale-110 transition-transform"><Trash2 size={16}/></button>
                                 </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                   <h3 className="font-bold mb-2">Bulk Upload Donatur</h3>
                   <p className="text-[10px] text-emerald-700 mb-2 uppercase font-bold">Format: Nama | Metode (BSI/Tunai/QRIS) | Nominal | Tanggal (YYYY-MM-DD)</p>
                   <textarea value={bulkLog} onChange={(e) => setBulkLog(e.target.value)} className="w-full bg-white border p-3 rounded-xl h-24 mb-3" placeholder="Hamba Allah | BSI | 500000 | 2024-12-25" />
                   <button onClick={handleBulkLog} className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-bold">Upload Massal</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* GALLERY */}
        {activeTab === "gallery" && (
           <div className="space-y-8 text-left">
              <h2 className="text-2xl font-bold">Galeri Foto</h2>
              <div className="bg-white p-8 rounded-3xl border space-y-4">
                 <h3 className="font-bold text-emerald-600">{editingGallery ? "Edit Kegiatan" : "Tambah Foto Kegiatan"}</h3>
                 <input type="text" value={editingGallery ? editingGallery.title : newGalleryTitle} onChange={(e) => editingGallery ? setEditingGallery({...editingGallery, title: e.target.value}) : setNewGalleryTitle(e.target.value)} className="w-full bg-slate-50 border p-4 rounded-xl" placeholder="Judul Kegiatan" />
                 <div className="flex items-center gap-4">
                    <input type="file" onChange={onGalleryUpload} className="flex-1" />
                    {editingGallery && <button onClick={async () => { await supabase.from('gallery').update({title: editingGallery.title, image_url: editingGallery.image_url}).eq('id', editingGallery.id); setEditingGallery(null); fetchGallery(); alert("Berhasil diupdate"); }} className="bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold">Simpan Perubahan</button>}
                    {editingGallery && <button onClick={() => setEditingGallery(null)} className="bg-slate-100 px-8 py-4 rounded-xl font-bold">Batal</button>}
                 </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                 {galleryList.map(g => (
                   <div key={g.id} className="bg-white p-3 border rounded-2xl group relative transition-all hover:shadow-lg">
                      <img src={g.image_url} className="w-full h-32 object-cover rounded-xl" />
                      <div className="mt-2 text-xs font-bold text-center truncate px-2">{g.title}</div>
                      <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => setEditingGallery(g)} className="p-2 bg-white text-emerald-600 rounded-lg shadow-md hover:bg-emerald-50"><Edit2 size={14}/></button>
                         <button onClick={async () => { if(confirm("Hapus?")){ await supabase.from('gallery').delete().eq('id', g.id); fetchGallery(); } }} className="p-2 bg-white text-rose-500 rounded-lg shadow-md hover:bg-rose-50"><Trash2 size={14}/></button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        )}

        {/* NEWS */}
        {activeTab === "news" && (
           <div className="space-y-8 text-left">
              <h2 className="text-2xl font-bold">Berita & Kajian</h2>
              <div className="bg-white p-8 rounded-3xl border space-y-4 shadow-sm">
                 <h3 className="font-bold text-emerald-600">{editingNews ? "Edit Berita" : "Tambah Berita/Kajian Baru"}</h3>
                 <input type="text" value={editingNews ? editingNews.title : newNews.title} onChange={(e) => editingNews ? setEditingNews({...editingNews, title: e.target.value}) : setNewNews({...newNews, title: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl" placeholder="Judul Berita" />
                 <textarea value={editingNews ? editingNews.content : newNews.content} onChange={(e) => editingNews ? setEditingNews({...editingNews, content: e.target.value}) : setNewNews({...newNews, content: e.target.value})} className="w-full bg-slate-50 border p-4 h-32 rounded-xl" placeholder="Isi Berita" />
                 
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Gambar Cover</label>
                    <div className="flex items-center gap-4">
                       <input type="file" onChange={onNewsUpload} className="flex-1 bg-slate-50 p-3 rounded-xl border border-dashed" />
                       {(editingNews?.image_url || newNews.image_url) && <img src={editingNews?.image_url || newNews.image_url} className="w-16 h-16 object-cover rounded-xl border" />}
                    </div>
                 </div>

                 <div className="flex gap-2">
                    {editingNews && <button onClick={() => setEditingNews(null)} className="flex-1 bg-slate-100 py-4 rounded-xl font-bold">Batal</button>}
                    <button onClick={handleSaveNews} className="flex-[2] bg-emerald-500 text-white py-4 rounded-xl font-bold shadow-lg">Publikasikan</button>
                 </div>
              </div>
              <div className="space-y-4">
                 {newsList.map(n => (
                   <div key={n.id} className="bg-white p-6 border rounded-2xl flex justify-between items-center">
                      <div><div className="font-bold text-lg">{n.title}</div><div className="text-xs text-emerald-600 uppercase font-bold">{n.category}</div></div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingNews(n)} className="p-2 text-indigo-500"><Edit2 size={18}/></button>
                        <button onClick={async () => { if(confirm("Hapus?")){ await supabase.from('news').delete().eq('id', n.id); fetchNews(); } }} className="p-2 text-rose-500"><Trash2 size={18}/></button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        )}

        {activeTab === "friday" && (
           <div className="space-y-8 text-left">
              <h2 className="text-2xl font-bold">Informasi Shalat Jumat</h2>
              <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
                 <h3 className="font-bold text-emerald-600">{editingFriday ? "Edit Jadwal" : "Tambah Jadwal Baru"}</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase ml-1">Khotib / Penceramah</label>
                       <input type="text" value={editingFriday ? editingFriday.kotib : newFriday.kotib} onChange={(e) => editingFriday ? setEditingFriday({...editingFriday, kotib: e.target.value}) : setNewFriday({...newFriday, kotib: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl" placeholder="Ustadz / KH..." />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase ml-1">Tanggal Jumatan</label>
                       <input type="date" value={editingFriday ? editingFriday.date : newFriday.date} onChange={(e) => editingFriday ? setEditingFriday({...editingFriday, date: e.target.value}) : setNewFriday({...newFriday, date: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Tema Khutbah</label>
                    <input type="text" value={editingFriday ? editingFriday.tema : newFriday.tema} onChange={(e) => editingFriday ? setEditingFriday({...editingFriday, tema: e.target.value}) : setNewFriday({...newFriday, tema: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl" placeholder="Judul Materi..." />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase ml-1">Imam Shalat</label>
                       <input type="text" value={editingFriday ? editingFriday.imam : newFriday.imam} onChange={(e) => editingFriday ? setEditingFriday({...editingFriday, imam: e.target.value}) : setNewFriday({...newFriday, imam: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase ml-1">Muadzin</label>
                       <input type="text" value={editingFriday ? editingFriday.muadzin : newFriday.muadzin} onChange={(e) => editingFriday ? setEditingFriday({...editingFriday, muadzin: e.target.value}) : setNewFriday({...newFriday, muadzin: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl" />
                    </div>
                 </div>
                 <div className="flex gap-2">
                    {editingFriday && <button onClick={() => setEditingFriday(null)} className="flex-1 bg-slate-100 py-4 rounded-xl font-bold">Batal</button>}
                    <button onClick={handleSaveFriday} className="flex-[2] bg-emerald-500 text-white py-5 rounded-2xl font-black tracking-widest shadow-xl">SIMPAN JADWAL</button>
                 </div>
              </div>

              <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
                 <div className="p-4 bg-slate-50 border-b font-bold flex justify-between">
                    <span>Riwayat Jadwal Jumatan</span>
                    <div className="flex gap-2">
                       <button onClick={() => setFridayPage(Math.max(0, fridayPage - 1))} className="px-3 py-1 bg-white border rounded-lg text-xs">Prev</button>
                       <span className="text-xs flex items-center">Hal {fridayPage + 1}</span>
                       <button onClick={() => setFridayPage(fridayPage + 1)} className="px-3 py-1 bg-white border rounded-lg text-xs">Next</button>
                    </div>
                 </div>
                 <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 font-bold"><tr><th className="p-4">Tanggal</th><th className="p-4">Khotib</th><th className="p-4">Tema</th><th className="p-4 text-center">Aksi</th></tr></thead>
                    <tbody className="divide-y">
                       {fridayList.map(f => (
                          <tr key={f.id} className="hover:bg-slate-50">
                             <td className="p-4 font-medium">{f.date}</td>
                             <td className="p-4 font-bold">{f.kotib || f.khotib || f.preacher || "-"}</td>
                             <td className="p-4 text-xs text-slate-500">{f.tema || f.theme || "-"}</td>
                             <td className="p-4 text-center">
                                <button onClick={() => setEditingFriday(f)} className="p-2 text-indigo-500"><Edit2 size={16}/></button>
                                <button onClick={async () => { if(confirm("Hapus?")){ await supabase.from('friday_schedules').delete().eq('id', f.id); fetchFriday(); } }} className="p-2 text-rose-500"><Trash2 size={16}/></button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>

              <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                 <h3 className="font-bold mb-2">Bulk Upload Jadwal Jumat</h3>
                 <p className="text-[10px] text-emerald-700 mb-2 uppercase font-bold">Format: Khotib | Tema | Imam | Muadzin | Tanggal (YYYY-MM-DD)</p>
                 <textarea value={bulkFriday} onChange={(e) => setBulkFriday(e.target.value)} className="w-full bg-white border p-3 rounded-xl h-24 mb-3" placeholder="Ustadz A | Iman | Ustadz B | Ustadz C | 2024-12-25" />
                 <button onClick={handleBulkFriday} className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-bold">Upload Massal</button>
              </div>
           </div>
        )}

        {activeTab === "settings" && (
           <div className="space-y-8 text-left">
              <h2 className="text-2xl font-bold">Profil & Pengaturan Masjid</h2>
              <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-8">
                 {/* BASIC INFO */}
                 <div className="space-y-6">
                    <h3 className="font-bold border-b pb-2 text-slate-400 text-sm uppercase tracking-widest">Identitas & Koreksi Waktu</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nama Masjid</label>
                          <input type="text" value={mosqueInfo.name} onChange={(e) => setMosqueInfo({...mosqueInfo, name: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-400 uppercase ml-1">Kontak Masjid (WA)</label>
                           <input type="text" value={mosqueInfo.phone} onChange={(e) => setMosqueInfo({...mosqueInfo, phone: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl" />
                        </div>
                    </div>
                    
                    {/* INDIVIDUAL CORRECTIONS */}
                    <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200 space-y-4">
                       <h4 className="text-[10px] font-black uppercase text-amber-700 tracking-widest flex items-center gap-2">
                          <Clock size={14}/> Koreksi Waktu Shalat (Menit)
                       </h4>
                       <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'].map(p => (
                             <div key={p} className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">{p}</label>
                                <input type="number" value={mosqueInfo[`correction_${p}` as keyof typeof mosqueInfo] || "0"} onChange={(e) => setMosqueInfo({...mosqueInfo, [`correction_${p}`]: e.target.value})} className="w-full bg-white border p-3 rounded-xl font-bold text-center" />
                             </div>
                          ))}
                       </div>
                       <p className="text-[10px] text-amber-600 mt-2">Gunakan angka positif untuk menambah menit, atau negatif untuk mengurangi.</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Alamat Lengkap</label>
                        <textarea value={mosqueInfo.address} onChange={(e) => setMosqueInfo({...mosqueInfo, address: e.target.value})} className="w-full bg-slate-50 border p-4 h-24 rounded-xl" />
                    </div>
                 </div>

                 {/* FINANCIAL INFO */}
                 <div className="space-y-6">
                    <h3 className="font-bold border-b pb-2 text-slate-400 text-sm uppercase tracking-widest text-emerald-600">Informasi Rekening & QRIS</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nama Bank</label>
                          <input type="text" value={mosqueInfo.bank_name} onChange={(e) => setMosqueInfo({...mosqueInfo, bank_name: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase ml-1">No. Rekening</label>
                          <input type="text" value={mosqueInfo.account_number} onChange={(e) => setMosqueInfo({...mosqueInfo, account_number: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase ml-1">Atas Nama (A.N)</label>
                          <input type="text" value={mosqueInfo.account_name} onChange={(e) => setMosqueInfo({...mosqueInfo, account_name: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl" />
                        </div>
                    </div>
                    <div className="space-y-4">
                       <label className="text-xs font-bold text-slate-400 uppercase ml-1 block">Upload Gambar QRIS</label>
                       <div className="flex items-center gap-6">
                          {mosqueInfo.qris_url && <img src={mosqueInfo.qris_url} className="w-24 h-24 object-contain border rounded-xl bg-white p-1" />}
                          <input type="file" onChange={onQRISUpload} className="flex-1" />
                       </div>
                    </div>
                 </div>

                 <button onClick={handleSaveSettings} className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black tracking-widest shadow-xl">SIMPAN SEMUA PENGATURAN</button>
              </div>
           </div>
        )}

        {activeTab === "qa" && (
           <div className="space-y-8 text-left">
              <h2 className="text-2xl font-bold">Tanya Jawab (FAQ)</h2>
              <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-4">
                 <h3 className="font-bold text-emerald-600">{editingFaq ? "Edit Pertanyaan" : "Tambah Pertanyaan Baru"}</h3>
                 <input type="text" value={editingFaq ? editingFaq.question : newFaq.question} onChange={(e) => editingFaq ? setEditingFaq({...editingFaq, question: e.target.value}) : setNewFaq({...newFaq, question: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl" placeholder="Pertanyaan..." />
                 <textarea value={editingFaq ? editingFaq.answer : newFaq.answer} onChange={(e) => editingFaq ? setEditingFaq({...editingFaq, answer: e.target.value}) : setNewFaq({...newFaq, answer: e.target.value})} className="w-full bg-slate-50 border p-4 h-32 rounded-xl" placeholder="Jawaban..." />
                 <div className="flex gap-2">
                    {editingFaq && <button onClick={() => setEditingFaq(null)} className="flex-1 bg-slate-100 py-4 rounded-xl font-bold">Batal</button>}
                    <button onClick={handleSaveFaq} className="flex-[2] bg-emerald-500 text-white py-4 rounded-xl font-bold shadow-lg">Simpan FAQ</button>
                 </div>
              </div>
              <div className="space-y-4">
                  {faqs.length === 0 ? (
                     <div className="bg-white p-10 border rounded-3xl text-center text-slate-400 font-medium">Belum ada pertanyaan yang dibuat.</div>
                  ) : (
                     faqs.map((f) => (
                        <div key={f.id} className="bg-white p-6 border rounded-2xl flex justify-between items-start gap-4 shadow-sm">
                           <div className="space-y-2">
                              <div className="font-bold text-slate-800">Q: {f.question}</div>
                              <div className="text-sm text-slate-500">A: {f.answer}</div>
                           </div>
                           <div className="flex gap-2">
                              <button onClick={() => setEditingFaq(f)} className="p-2 text-indigo-500"><Edit2 size={18}/></button>
                              <button onClick={() => deleteFaq(f.id)} className="p-2 text-rose-500"><Trash2 size={18}/></button>
                           </div>
                        </div>
                     ))
                  )}
               </div>
           </div>
        )}
        {activeTab === "users" && currentUser?.role === "superadmin" && (
           <div className="space-y-8 text-left">
              <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold">Manajemen User (RBAC)</h2>
                 <span className="bg-rose-100 text-rose-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Akses Khusus Superadmin</span>
              </div>
              
              <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-4">
                 <h3 className="font-bold text-emerald-600">Tambah Akun Baru</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" value={newUser.nama_lengkap} onChange={(e) => setNewUser({...newUser, nama_lengkap: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl" placeholder="Nama Lengkap Pemilik Akun" />
                    <input type="text" value={newUser.username} onChange={(e) => setNewUser({...newUser, username: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl" placeholder="Username (Untuk Login)" />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl" placeholder="Alamat Email" />
                    <input type="text" value={newUser.wa} onChange={(e) => setNewUser({...newUser, wa: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl" placeholder="No. WA (08...)" />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl" placeholder="Password" />
                    <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl font-bold text-emerald-700">
                       <option value="superadmin">Superadmin (Akses Penuh)</option>
                       <option value="bendahara">Bendahara (Keuangan & Donasi)</option>
                       <option value="humas">Humas / Admin Konten (Berita, Hadits, Galeri)</option>
                    </select>
                 </div>
                 <button onClick={handleSaveUser} className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold shadow-lg">Buat Akun Sekarang</button>
              </div>

              <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
                 <div className="p-4 bg-slate-50 border-b font-bold flex justify-between">
                    <span>Daftar Akun Terdaftar</span>
                    <span className="text-[10px] uppercase font-black text-emerald-600 tracking-widest">{adminUsers.length} Akun</span>
                 </div>
                 <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 font-bold border-b"><tr><th className="p-4">Username</th><th className="p-4">Nama Lengkap</th><th className="p-4">Kontak</th><th className="p-4">Role Akses</th><th className="p-4 text-center">Aksi</th></tr></thead>
                    <tbody className="divide-y">
                       {adminUsers.map(u => (
                          <tr key={u.id} className="hover:bg-slate-50">
                             <td className="p-4 font-bold">{u.username}</td>
                             <td className="p-4 text-slate-500">{u.nama_lengkap || "-"}</td>
                             <td className="p-4 text-xs text-slate-500 space-y-1">
                                {u.email && <div>✉️ {u.email}</div>}
                                {u.wa && <div>📱 {u.wa}</div>}
                                {!u.email && !u.wa && "-"}
                             </td>
                             <td className="p-4">
                                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${u.role === 'superadmin' ? 'bg-rose-100 text-rose-600' : u.role === 'bendahara' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                   {u.role}
                                </span>
                             </td>
                             <td className="p-4 text-center">
                                <button onClick={() => deleteUser(u.id)} className="p-2 text-rose-500 hover:scale-110 transition-transform"><Trash2 size={16}/></button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>

               <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-4">
                  <h3 className="font-bold text-emerald-600">Manajemen Hak Akses Menu (Role Permissions)</h3>
                  {rolePermissions.length === 0 && <p className="text-sm text-rose-500 font-bold bg-rose-50 p-4 rounded-xl border">Tabel 'role_permissions' belum dibuat/diisi di Supabase! Menggunakan akses bawaan.</p>}
                  {rolePermissions.map(rp => (
                     <div key={rp.id} className="border p-6 rounded-2xl bg-slate-50">
                        <div className="font-black mb-3 uppercase text-sm tracking-widest text-slate-800">{rp.role}</div>
                        <div className="flex flex-wrap gap-3">
                           {allSidebarItems.map(item => (
                              <label key={item.id} className={`flex items-center gap-2 text-xs border p-3 rounded-xl cursor-pointer transition-all ${rp.menus.includes(item.id) ? 'bg-emerald-500 text-white border-emerald-600 font-bold shadow-md' : 'bg-white text-slate-500 hover:bg-slate-100'}`}>
                                 <input type="checkbox" className="hidden" checked={rp.menus.includes(item.id)} onChange={(e) => updateRoleMenu(rp, item.id, e.target.checked)} />
                                 {rp.menus.includes(item.id) ? "✓" : "+"} {item.label}
                              </label>
                           ))}
                        </div>
                     </div>
                  ))}
               </div>
           </div>
        )}
      </main>
    </div>
  );
}
