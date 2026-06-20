import { useState, useEffect } from "react";
import { MessageCircle, Edit2, Trash2, Plus, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface QAProps {
  canDo: (menuId: string, action: string) => boolean;
}

export default function QAManager({ canDo }: QAProps) {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const [editingFaq, setEditingFaq] = useState<any>(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    let { data, error } = await supabase.from('faqs').select('*').order('id', { ascending: true });
    if (error || !data) {
      const { data: singularData } = await supabase.from('faq').select('*').order('id', { ascending: true });
      if (singularData) data = singularData;
    }
    if (data) setFaqs(data);
  };

  const handleSave = async () => {
    const data = editingFaq || newFaq;
    if (!data.question || !data.answer) return alert("Pertanyaan & Jawaban wajib diisi");
    if (editingFaq) { 
      await supabase.from('faqs').update(data).eq('id', editingFaq.id); 
      setEditingFaq(null);
    } else { 
      await supabase.from('faqs').insert([data]); 
      setNewFaq({ question: "", answer: "" });
    }
    fetchFaqs();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus Tanya Jawab ini?")) return;
    await supabase.from('faqs').delete().eq('id', id);
    fetchFaqs();
  };

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-emerald-600 flex items-center gap-2 border-b pb-4">
          <MessageCircle size={20} /> {editingFaq ? "Edit Tanya Jawab" : "Tambah Tanya Jawab (FAQ)"}
        </h2>
        <div className="space-y-4">
           <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Pertanyaan</label>
              <input type="text" value={editingFaq ? editingFaq.question : newFaq.question} onChange={(e) => editingFaq ? setEditingFaq({...editingFaq, question: e.target.value}) : setNewFaq({...newFaq, question: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl mt-1 font-bold" placeholder="Apa hukum berjamaah bagi laki-laki?" />
           </div>
           <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Jawaban / Penjelasan</label>
              <textarea value={editingFaq ? editingFaq.answer : newFaq.answer} onChange={(e) => editingFaq ? setEditingFaq({...editingFaq, answer: e.target.value}) : setNewFaq({...newFaq, answer: e.target.value})} className="w-full bg-slate-50 border p-4 rounded-xl mt-1 h-32" placeholder="Tuliskan jawaban yang ringkas dan padat..." />
           </div>
        </div>
        <div className="flex gap-2">
           {editingFaq && <button onClick={() => setEditingFaq(null)} className="flex-1 bg-slate-100 py-4 rounded-xl font-bold">Batal</button>}
           {((!editingFaq && canDo('qa', 'create')) || (editingFaq && canDo('qa', 'update'))) && (
             <button onClick={handleSave} className="flex-[2] bg-emerald-500 text-white py-4 rounded-xl font-bold shadow-lg">Simpan Tanya Jawab</button>
           )}
        </div>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={faq.id} className="bg-white p-6 rounded-2xl border shadow-sm flex justify-between items-start gap-4 hover:border-emerald-200 transition-colors">
            <div className="flex gap-4">
               <span className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-bold text-xs">{idx + 1}</span>
               <div>
                  <h4 className="font-bold text-slate-800 mb-1">{faq.question}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{faq.answer}</p>
               </div>
            </div>
            <div className="flex gap-1 shrink-0">
               {canDo('qa', 'update') && <button onClick={() => setEditingFaq(faq)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg"><Edit2 size={16}/></button>}
               {canDo('qa', 'delete') && <button onClick={() => handleDelete(faq.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={16}/></button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
