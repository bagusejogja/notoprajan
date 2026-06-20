import { useState, useEffect } from "react";
import { FileText, Edit2, Trash2, Save, Printer, Plus, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface LelayuProps {
  canDo: (menuId: string, action: string) => boolean;
}

export default function LelayuManager({ canDo }: LelayuProps) {
  const [lelayuList, setLelayuList] = useState<any[]>([]);
  const [editingLelayu, setEditingLelayu] = useState<any>(null);

  const getToday = () => new Date().toISOString().split('T')[0];
  const getCurrentTime = () => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };
  const getDayName = (dateStr: string) => {
    const d = new Date(dateStr);
    const days = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
    return isNaN(d.getTime()) ? "" : days[d.getDay()];
  };

  const emptyForm = {
    letter_location: "Notoprajan",
    letter_date: getToday(),
    deceased_name: "",
    age: "",
    address: "",
    death_day: getDayName(getToday()),
    death_date: getToday(),
    death_time: getCurrentTime(),
    death_location: "Notoprajan",
    burial_day: getDayName(getToday()),
    burial_date: getToday(),
    burial_time: getCurrentTime(),
    burial_location: "Makam Notoprajan"
  };

  const [newLelayu, setNewLelayu] = useState(emptyForm);
  const [mournersList, setMournersList] = useState([{ name: "", relation: "Istri" }]);

  useEffect(() => {
    fetchLelayu();
  }, []);

  const fetchLelayu = async () => {
    const { data } = await supabase.from('lelayu').select('*').order('created_at', { ascending: false });
    if (data) setLelayuList(data);
  };

  const handleAddMourner = () => setMournersList([...mournersList, { name: "", relation: "Anak" }]);
  const handleRemoveMourner = (index: number) => setMournersList(mournersList.filter((_, i) => i !== index));
  const handleMournerChange = (index: number, field: string, value: string) => {
    const newList = [...mournersList];
    (newList[index] as any)[field] = value;
    setMournersList(newList);
  };

  const formData = editingLelayu || newLelayu;
  const setFormData = editingLelayu ? setEditingLelayu : setNewLelayu;

  const handleChange = (field: string, value: string) => {
    let updates: any = { [field]: value };
    // Auto-update hari berdasarkan tanggal yang dipilih
    if (field === 'death_date') updates.death_day = getDayName(value);
    if (field === 'burial_date') updates.burial_day = getDayName(value);
    
    setFormData({ ...formData, ...updates });
  };

  const handleSave = async () => {
    const data = { ...formData };
    if (!data.deceased_name) return alert("Nama Almarhum wajib diisi");
    
    data.mourners = JSON.stringify(mournersList);
    data.letter_date = `${data.letter_location}, ${formatDateID(data.letter_date)}`;

    delete data.letter_location;

    try {
      if (editingLelayu) {
        const { error } = await supabase.from('lelayu').update(data).eq('id', editingLelayu.id);
        if (error) throw error;
        setEditingLelayu(null);
      } else {
        const { error } = await supabase.from('lelayu').insert([data]);
        if (error) throw error;
        setNewLelayu(emptyForm);
        setMournersList([{ name: "", relation: "Istri" }]);
      }
      fetchLelayu();
      alert("Berita lelayu berhasil disimpan!");
    } catch (error: any) {
      alert("Gagal simpan (Pastikan koneksi internet aktif dan database Supabase berjalan): " + error.message);
    }
  };

  const startEdit = (l: any) => {
    let loc = "Notoprajan";
    if (l.letter_date && l.letter_date.includes(", ")) {
       const parts = l.letter_date.split(", ");
       loc = parts[0];
    }

    setEditingLelayu({ ...l, letter_location: loc });
    
    try {
       const parsed = JSON.parse(l.mourners);
       if (Array.isArray(parsed)) setMournersList(parsed);
       else setMournersList([{ name: l.mourners, relation: "Keluarga" }]);
    } catch(e) {
       setMournersList([{ name: l.mourners || "", relation: "Keluarga" }]);
    }
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const formatDateID = (dateStr: string) => {
    if(!dateStr || !dateStr.includes("-")) return dateStr;
    const d = new Date(dateStr);
    const months = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const handlePrint = (l: any) => {
    let mournersText = "";
    try {
        const parsed = JSON.parse(l.mourners);
        mournersText = parsed.map((m: any, i: number) => `<div class="mourner-item">${i+1}. <b>${m.name}</b> <i>(${m.relation})</i></div>`).join("");
    } catch(e) {
        mournersText = `<div>${l.mourners}</div>`;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const html = `
      <html>
        <head>
          <title>Berita Lelayu - ${l.deceased_name}</title>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,700;0,900;1,400&display=swap');
            
            body { 
              font-family: 'Merriweather', serif; 
              line-height: 1.25; 
              color: #5c3a21; 
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact !important; 
              print-color-adjust: exact !important;
              background-color: #f1f5f9;
            }
            .page-container {
              position: relative;
              width: 100%;
              max-width: 800px;
              margin: 0 auto;
              min-height: 1130px;
              padding: 120px calc(60px + 0.8cm);
              box-sizing: border-box;
              overflow: hidden;
              background-color: white;
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            }
            .bg-image {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: -1;
              object-fit: cover;
            }

            .content-wrapper {
              position: relative;
              z-index: 1;
              background: transparent; 
              padding: 0;
            }

            h1 { text-align: center; font-size: 36px; font-weight: 900; margin: 0 0 10px 0; letter-spacing: 4px; text-transform: uppercase; border-bottom: 2px solid #5c3a21; padding-bottom: 10px; color: #5c3a21; }
            .date-right { text-align: right; margin-bottom: 15px; font-style: italic; font-size: 14px; }
            
            .salam { margin-bottom: 15px; font-weight: bold; }
            .inna { text-align: center; font-size: 22px; font-weight: 900; margin: 20px 0; text-transform: uppercase; letter-spacing: 1px; color: #000; }
            
            .deceased { text-align: center; margin-bottom: 20px; }
            .deceased-name { font-size: 28px; font-weight: 900; text-decoration: underline; text-transform: uppercase; margin: 5px 0; color: #000; }
            
            .details { margin-bottom: 15px; }
            .detail-row { display: flex; margin-bottom: 4px; }
            .detail-label { width: 100px; }
            .detail-value { flex: 1; font-weight: bold; color: #000; }
            
            .closing { margin-bottom: 15px; text-align: justify; text-indent: 30px; }
            .wassalam { margin-bottom: 15px; font-weight: bold; }
            
            .mourners { margin-top: 15px; }
            .mourners-title { font-weight: bold; text-decoration: underline; margin-bottom: 8px; }
            .mourners-list { display: flex; flex-direction: column; gap: 4px; font-size: 14px; }
            .mourner-item { margin-bottom: 2px; }
            
            .controls { position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; gap: 10px; }
            .btn { padding: 12px 20px; font-weight: bold; font-family: sans-serif; border: none; border-radius: 8px; cursor: pointer; color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: 0.2s; }
            .btn:hover { transform: scale(1.05); }
            .btn-print { background: #047857; }
            .btn-dl { background: #25D366; }
            
            @media print {
              @page { margin: 0; size: A4; }
              body { margin: 0; padding: 0; background-color: white; }
              .page-container { padding: 90px calc(60px + 0.8cm); width: 100vw; height: 100vh; box-shadow: none; max-width: none; }
              .content-wrapper { background: transparent !important; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="controls no-print">
            <button class="btn btn-print" onclick="window.print()">Cetak PDF</button>
            <button class="btn btn-dl" onclick="downloadImage()">Simpan ke Gambar (WA)</button>
          </div>

          <div class="page-container" id="capture-area">
            <img src="/bg-lelayu.png" class="bg-image" onerror="this.style.display='none'" />
            
            <div class="content-wrapper">
                <h1>BERITA LELAYU</h1>
                <div class="date-right">${l.letter_date || ''}</div>
                
                <div class="salam">Assalamu'alaikum Wr. Wb.</div>

                <div class="inna">INNA LILLAHI WA INNA ILAIHI ROJI'UN</div>

                <div class="deceased">
                  Telah meninggal dunia dengan tenang<br/>
                  <div class="deceased-name">${l.deceased_name}</div>
                  Usia : <b>${l.age}</b><br/>
                  Alamat : ${l.address}
                </div>

                <div class="details">
                  Meninggal dunia pada :<br/><br/>
                  <div class="detail-row"><div class="detail-label">Hari</div><div class="detail-value">: ${l.death_day}</div></div>
                  <div class="detail-row"><div class="detail-label">Tanggal</div><div class="detail-value">: ${formatDateID(l.death_date)}</div></div>
                  <div class="detail-row"><div class="detail-label">Pukul</div><div class="detail-value">: ${l.death_time} WIB</div></div>
                  <div class="detail-row"><div class="detail-label">Di</div><div class="detail-value">: ${l.death_location}</div></div>
                </div>

                <div class="details">
                  Jenazah akan dimakamkan pada :<br/><br/>
                  <div class="detail-row"><div class="detail-label">Hari</div><div class="detail-value">: ${l.burial_day}</div></div>
                  <div class="detail-row"><div class="detail-label">Tanggal</div><div class="detail-value">: ${formatDateID(l.burial_date)}</div></div>
                  <div class="detail-row"><div class="detail-label">Pukul</div><div class="detail-value">: ${l.burial_time} WIB</div></div>
                  <div class="detail-row"><div class="detail-label">Tempat</div><div class="detail-value">: ${l.burial_location}</div></div>
                </div>

                <div class="closing">
                  Demikian Berita lelayu ini kami sampaikan dimohon untuk menyebarluaskan kepada sanak saudara dan handaitaulan dimanapun berada. Atas perhatiannya disampaikan ucapan terima kasih.
                </div>
                
                <div class="wassalam">Wassalamu'alaikum Wr. Wb.</div>

                <div class="mourners">
                  <div class="mourners-title">Yang Berduka Cita :</div>
                  <div class="mourners-list">${mournersText}</div>
                </div>
            </div>
          </div>
          
          <script>
            function downloadImage() {
               const btn = document.querySelector('.btn-dl');
               btn.innerText = "Memproses...";
               
               document.fonts.ready.then(function() {
                   const element = document.getElementById('capture-area');
                   html2canvas(element, { 
                       scale: 2, 
                       useCORS: true,
                       allowTaint: true,
                       backgroundColor: '#ffffff'
                   }).then(canvas => {
                       const link = document.createElement('a');
                       link.download = 'Lelayu_${l.deceased_name.replace(/\s+/g, '_')}.jpg';
                       link.href = canvas.toDataURL('image/jpeg', 0.9);
                       link.click();
                       btn.innerText = "Simpan ke Gambar (WA)";
                   });
               });
            }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-6">
        <h2 className="text-2xl font-black text-emerald-600 flex items-center gap-2 border-b pb-4">
          <FileText size={28} /> {editingLelayu ? "Edit Berita Lelayu" : "Buat Berita Lelayu Baru"}
        </h2>
        
        <div className="space-y-6">
           <div className="bg-slate-50 p-6 rounded-2xl border space-y-4">
              <h3 className="font-bold text-slate-800">1. Kop & Identitas Almarhum</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid grid-cols-2 gap-2">
                   <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Tempat Surat</label>
                      <input type="text" value={formData.letter_location} onChange={(e) => handleChange('letter_location', e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1" />
                   </div>
                   <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Tgl Surat</label>
                      <input type="date" value={formData.letter_date} onChange={(e) => handleChange('letter_date', e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1" />
                   </div>
                </div>
                <div>
                   <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Nama Almarhum/ah</label>
                   <input type="text" value={formData.deceased_name} onChange={(e) => handleChange('deceased_name', e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1 font-bold text-emerald-700" placeholder="BAPAK PONIDIN / SAMIREJO" />
                </div>
                <div>
                   <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Usia</label>
                   <input type="text" value={formData.age} onChange={(e) => handleChange('age', e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1" placeholder="91 Tahun" />
                </div>
                <div className="md:col-span-2">
                   <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Alamat Duka</label>
                   <input type="text" value={formData.address} onChange={(e) => handleChange('address', e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1" placeholder="PanggungSari Rt.08/Rw.23 Sariharjo..." />
                </div>
              </div>
           </div>

           <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 space-y-4">
              <h3 className="font-bold text-rose-800">2. Waktu & Tempat Wafat</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                   <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Hari</label>
                   <input type="text" value={formData.death_day} onChange={(e) => handleChange('death_day', e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1" />
                </div>
                <div>
                   <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Tanggal</label>
                   <input type="date" value={formData.death_date} onChange={(e) => handleChange('death_date', e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1 font-bold" />
                </div>
                <div>
                   <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Pukul</label>
                   <input type="time" value={formData.death_time} onChange={(e) => handleChange('death_time', e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1 font-bold" />
                </div>
                <div className="col-span-2 md:col-span-4">
                   <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Di (Tempat Wafat)</label>
                   <input type="text" value={formData.death_location} onChange={(e) => handleChange('death_location', e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1" />
                </div>
              </div>
           </div>

           <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 space-y-4">
              <h3 className="font-bold text-emerald-800">3. Waktu & Tempat Pemakaman</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                   <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Hari</label>
                   <input type="text" value={formData.burial_day} onChange={(e) => handleChange('burial_day', e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1" />
                </div>
                <div>
                   <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Tanggal</label>
                   <input type="date" value={formData.burial_date} onChange={(e) => handleChange('burial_date', e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1 font-bold" />
                </div>
                <div>
                   <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Pukul</label>
                   <input type="time" value={formData.burial_time} onChange={(e) => handleChange('burial_time', e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1 font-bold" />
                </div>
                <div className="col-span-2 md:grid-cols-4">
                   <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Tempat Makam</label>
                   <input type="text" value={formData.burial_location} onChange={(e) => handleChange('burial_location', e.target.value)} className="w-full bg-white border p-3 rounded-xl mt-1" />
                </div>
              </div>
           </div>

           <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 space-y-4">
              <div className="flex justify-between items-center">
                 <h3 className="font-bold text-indigo-800">4. Keluarga yang Berduka</h3>
                 <button onClick={handleAddMourner} className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700">
                    <Plus size={14}/> Tambah Anggota
                 </button>
              </div>
              
              <div className="space-y-2">
                 {mournersList.map((mourner, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-white p-2 rounded-xl border">
                       <span className="font-bold text-slate-400 w-6 text-center">{idx + 1}.</span>
                       <input 
                          type="text" 
                          value={mourner.name} 
                          onChange={(e) => handleMournerChange(idx, 'name', e.target.value)} 
                          className="flex-1 bg-slate-50 border p-2 rounded-lg text-sm font-bold" 
                          placeholder="Nama Anggota Keluarga" 
                       />
                       
                       {/* Input hybrid untuk text bebas + Pilihan cepat */}
                       <div className="flex bg-slate-50 border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 w-48">
                          <input 
                             type="text"
                             value={mourner.relation} 
                             onChange={(e) => handleMournerChange(idx, 'relation', e.target.value)} 
                             className="w-full p-2 text-sm bg-transparent outline-none"
                             placeholder="Ketik status..."
                          />
                          <select 
                             onChange={(e) => e.target.value && handleMournerChange(idx, 'relation', e.target.value)} 
                             className="w-8 bg-slate-100 border-l text-sm outline-none cursor-pointer text-transparent hover:bg-slate-200"
                             title="Pilih cepat"
                          >
                             <option value="">▼</option>
                             <option value="Istri">Istri</option>
                             <option value="Suami">Suami</option>
                             <option value="Anak">Anak</option>
                             <option value="Menantu">Menantu</option>
                             <option value="Cucu">Cucu</option>
                             <option value="Buyut">Buyut</option>
                             <option value="Adik">Adik</option>
                             <option value="Kakak">Kakak</option>
                             <option value="Keluarga">Keluarga</option>
                          </select>
                       </div>

                       <button onClick={() => handleRemoveMourner(idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><X size={16}/></button>
                    </div>
                 ))}
                 {mournersList.length === 0 && <p className="text-xs text-slate-400 italic">Belum ada anggota keluarga ditambahkan.</p>}
              </div>
           </div>

        </div>

        <div className="flex gap-2 pt-4">
           {editingLelayu && <button onClick={() => setEditingLelayu(null)} className="flex-1 bg-slate-100 py-4 rounded-2xl font-bold">Batal</button>}
           {((!editingLelayu && canDo('lelayu', 'create')) || (editingLelayu && canDo('lelayu', 'update'))) && (
             <button onClick={handleSave} className="flex-[2] bg-emerald-500 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
                <Save size={20} /> Simpan Data Lelayu
             </button>
           )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-400 uppercase tracking-widest ml-4">Arsip Berita Lelayu</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lelayuList.length === 0 && <div className="col-span-2 text-slate-400 text-sm p-4 text-center border-2 border-dashed rounded-3xl">Belum ada arsip.</div>}
            {lelayuList.map(l => (
                <div key={l.id} className="bg-white p-6 rounded-3xl border shadow-sm flex flex-col justify-between hover:border-emerald-500 transition-all">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-black text-lg text-slate-800 uppercase">{l.deceased_name}</h4>
                            <span className="text-[10px] font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500">{l.age}</span>
                        </div>
                        <p className="text-sm text-slate-500 mb-4">{l.address}</p>
                        <div className="text-xs text-slate-600 space-y-1">
                            <div><span className="font-bold text-rose-500">Wafat:</span> {formatDateID(l.death_date)} ({l.death_time})</div>
                            <div><span className="font-bold text-emerald-500">Makam:</span> {formatDateID(l.burial_date)} ({l.burial_time})</div>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-6 pt-4 border-t">
                        <button onClick={() => handlePrint(l)} className="flex-[3] py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg">
                           <Printer size={16}/> Lihat / Cetak PDF
                        </button>
                        
                        {canDo('lelayu', 'update') && <button onClick={() => startEdit(l)} className="flex-1 flex justify-center items-center bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"><Edit2 size={18}/></button>}
                        {canDo('lelayu', 'delete') && <button onClick={async () => { if(confirm("Hapus arsip ini?")){ await supabase.from('lelayu').delete().eq('id', l.id); fetchLelayu(); } }} className="flex-1 flex justify-center items-center bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors"><Trash2 size={18}/></button>}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
