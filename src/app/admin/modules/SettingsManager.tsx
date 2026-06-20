import { useState, useEffect } from "react";
import { Settings, Save, MapPin, Phone, Target, Landmark, Clock, Loader } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SettingsProps {
  canDo: (menuId: string, action: string) => boolean;
}

export default function SettingsManager({ canDo }: SettingsProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [mosqueInfo, setMosqueInfo] = useState({ 
    name: "", address: "", phone: "", vision: "", mission: "", instagram: "", facebook: "",
    bank_name: "Bank Syariah Indonesia (BSI)", account_number: "", account_name: "", qris_url: "",
    correction_subuh: "0", correction_dzuhur: "0", correction_ashar: "0", correction_maghrib: "0", correction_isya: "0"
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from('mosque_settings').select('*').limit(1);
    if (data && data.length > 0) {
      const row = data[0];
      setMosqueInfo({
        name: row.mosque_name || "",
        address: row.address || "",
        phone: row.phone || "",
        vision: row.vision || "",
        mission: row.mission || "",
        instagram: row.instagram || "",
        facebook: row.facebook || "",
        bank_name: row.bank_name || "Bank Syariah Indonesia (BSI)",
        account_number: row.bank_account || "",
        account_name: row.account_name || "",
        qris_url: row.qris_url || "",
        correction_subuh: String(row.correction_subuh || 0),
        correction_dzuhur: String(row.correction_dzuhur || 0),
        correction_ashar: String(row.correction_ashar || 0),
        correction_maghrib: String(row.correction_maghrib || 0),
        correction_isya: String(row.correction_isya || 0)
      });
    }
  };

  const handleQRISUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "settings");
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) setMosqueInfo({ ...mosqueInfo, qris_url: data.url });
    setIsUploading(false);
  };

  const handleSave = async () => {
    const payload = {
      mosque_name: mosqueInfo.name,
      address: mosqueInfo.address,
      phone: mosqueInfo.phone,
      vision: mosqueInfo.vision,
      mission: mosqueInfo.mission,
      instagram: mosqueInfo.instagram,
      facebook: mosqueInfo.facebook,
      bank_name: mosqueInfo.bank_name,
      bank_account: mosqueInfo.account_number,
      account_name: mosqueInfo.account_name,
      qris_url: mosqueInfo.qris_url,
      correction_subuh: Number(mosqueInfo.correction_subuh),
      correction_dzuhur: Number(mosqueInfo.correction_dzuhur),
      correction_ashar: Number(mosqueInfo.correction_ashar),
      correction_maghrib: Number(mosqueInfo.correction_maghrib),
      correction_isya: Number(mosqueInfo.correction_isya)
    };
    const { error } = await supabase.from('mosque_settings').update(payload).eq('id', 1);
    if (error) alert("Gagal update: " + error.message);
    else alert("Profil Masjid Berhasil Diperbarui!");
  };

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* BASIC INFO */}
         <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-emerald-600 flex items-center gap-2 border-b pb-4">
               <MapPin size={20} /> Identitas Masjid
            </h2>
            <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Nama Masjid</label>
                  <input type="text" value={mosqueInfo.name} onChange={(e) => setMosqueInfo({...mosqueInfo, name: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl mt-1 font-bold" />
               </div>
               <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Alamat Lengkap</label>
                  <textarea value={mosqueInfo.address} onChange={(e) => setMosqueInfo({...mosqueInfo, address: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl mt-1 h-24" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">WhatsApp / Telp</label>
                     <input type="text" value={mosqueInfo.phone} onChange={(e) => setMosqueInfo({...mosqueInfo, phone: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl mt-1" />
                  </div>
                  <div>
                     <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Instagram</label>
                     <input type="text" value={mosqueInfo.instagram} onChange={(e) => setMosqueInfo({...mosqueInfo, instagram: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl mt-1" placeholder="@masjid..." />
                  </div>
               </div>
            </div>
         </div>

         {/* FINANCE INFO */}
         <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-emerald-600 flex items-center gap-2 border-b pb-4">
               <Landmark size={20} /> Rekening Donasi
            </h2>
            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Nama Bank</label>
                     <input type="text" value={mosqueInfo.bank_name} onChange={(e) => setMosqueInfo({...mosqueInfo, bank_name: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl mt-1" />
                  </div>
                  <div>
                     <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Nomor Rekening</label>
                     <input type="text" value={mosqueInfo.account_number} onChange={(e) => setMosqueInfo({...mosqueInfo, account_number: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl mt-1 font-mono font-bold" />
                  </div>
               </div>
               <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Atas Nama (Rekening)</label>
                  <input type="text" value={mosqueInfo.account_name} onChange={(e) => setMosqueInfo({...mosqueInfo, account_name: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl mt-1 uppercase" />
               </div>
               <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Upload QRIS (Gambar)</label>
                  <div className="flex items-center gap-4 mt-1">
                     <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden border flex items-center justify-center">
                        {mosqueInfo.qris_url ? <img src={mosqueInfo.qris_url} className="w-full h-full object-cover" /> : <Clock className="text-slate-300" />}
                     </div>
                     <input type="file" onChange={handleQRISUpload} className="text-xs" />
                  </div>
               </div>
            </div>
         </div>

         {/* PRAYER TIMES CORRECTION */}
         <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6 lg:col-span-2">
            <h2 className="text-xl font-bold text-emerald-600 flex items-center gap-2 border-b pb-4">
               <Clock size={20} /> Koreksi Waktu Shalat (Menit)
            </h2>
            <div className="grid grid-cols-5 gap-4">
               {['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'].map(time => (
                  <div key={time}>
                     <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">{time}</label>
                     <input type="number" value={(mosqueInfo as any)[`correction_${time}`]} onChange={(e) => setMosqueInfo({...mosqueInfo, [`correction_${time}`]: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl mt-1 text-center font-bold" />
                  </div>
               ))}
            </div>
         </div>
      </div>

      {canDo('settings', 'update') && (
        <button onClick={handleSave} className="w-full bg-emerald-500 text-white py-6 rounded-3xl font-black tracking-[0.2em] uppercase shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3">
           {isUploading ? <Loader className="animate-spin" /> : <Save size={24} />} SIMPAN SEMUA PENGATURAN
        </button>
      )}
    </div>
  );
}
