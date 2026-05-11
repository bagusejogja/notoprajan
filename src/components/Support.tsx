"use client";

import { MessageSquare, HelpCircle, ChevronDown, Mail } from "lucide-react";
import { useState, useEffect } from "react";

import { supabase } from "@/lib/supabase";

const FALLBACK_FAQS = [
  {
    q: "Bagaimana cara mendaftarkan anak ke TPA Masjid?",
    a: "Pendaftaran santri baru TPA dibuka setiap hari Senin - Kamis pukul 16.00 di sekretariat masjid. Persyaratan cukup membawa fotokopi KK."
  },
  {
    q: "Apakah Masjid menerima penyaluran Zakat Mal?",
    a: "Ya, kami memiliki Unit Pengumpul Zakat (UPZ) yang menyalurkan zakat Anda secara amanah kepada 8 asnaf di wilayah Notoprajan."
  },
  {
    q: "Kapan jadwal kajian kitab rutin dilaksanakan?",
    a: "Kajian rutin dilaksanakan setiap malam Jumat (Tafsir Al-Quran) dan Ahad pagi (Fiqih Ibadah) setelah shalat Subuh."
  }
];

export default function Support() {
  const [open, setOpen] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<any[]>(FALLBACK_FAQS);

  useEffect(() => {
    async function fetchFaqs() {
      // Try 'faqs' then 'faq' then 'mosque_settings'
      let { data, error } = await supabase.from('faqs').select('*').order('id', { ascending: true });
      
      if (error || !data) {
        const { data: singularData, error: singularError } = await supabase.from('faq').select('*').order('id', { ascending: true });
        if (!singularError && singularData) data = singularData;
      }

      // Fallback if dedicated tables don't exist
      if (!data || data.length === 0) {
        const { data: settings } = await supabase.from('mosque_settings').select('*');
        const faqSetting = settings?.find(s => (s.key || s.setting_key || s.name) === 'faqs');
        if (faqSetting && faqSetting.value) {
          data = typeof faqSetting.value === 'string' ? JSON.parse(faqSetting.value) : faqSetting.value;
        }
      }

      if (data && data.length > 0) {
        const formatted = data.map((item: any) => ({ 
          q: item.question || item.q || item.pertanyaan, 
          a: item.answer || item.a || item.jawaban 
        }));
        setFaqs(formatted);
      }
    }
    fetchFaqs();
  }, []);

  if (faqs.length === 0) return null;

  return (
    <section className="py-24 px-4 bg-white relative" id="faq">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold">
            <HelpCircle size={14} />
            <span>Konsultasi & Informasi</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-outfit text-indigo-950">Tanya Jawab Agama</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Temukan jawaban atas pertanyaan seputar ibadah dan kegiatan masjid Notoprajan Yogyakarta.
          </p>
        </div>

        <div className="space-y-4 text-left">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-slate-100 rounded-3xl overflow-hidden transition-all">
              <button 
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full p-6 flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <span className="font-bold text-slate-800 text-lg">{faq.q}</span>
                <ChevronDown className={`text-slate-400 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="p-6 bg-white text-slate-500 leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 bg-emerald-600 rounded-[3rem] p-10 text-white text-center space-y-6 shadow-2xl shadow-emerald-200">
          <h3 className="text-2xl font-bold">Masih butuh bantuan?</h3>
          <p className="text-emerald-100 opacity-90">Hubungi admin kami langsung melalui pesan WhatsApp untuk respon lebih cepat.</p>
          <div className="flex flex-wrap justify-center gap-4">
             <a href="https://wa.me/628123456789" className="px-8 py-4 bg-white text-emerald-600 rounded-2xl font-bold hover:scale-105 transition-all flex items-center gap-2">
               <MessageSquare size={20} />
               Chat WhatsApp
             </a>
             <a href="mailto:info@notoparaja.id" className="px-8 py-4 bg-emerald-700 text-white rounded-2xl font-bold hover:bg-emerald-800 transition-all flex items-center gap-2">
               <Mail size={20} />
               Kirim Email
             </a>
          </div>
        </div>
      </div>
    </section>
  );
}
