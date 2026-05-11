import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function seed() {
  console.log("🌱 Menyuntikkan 10+ data dummy tahun 2026...");
  const curYear = "2026";

  // 1. Hadith (10 items)
  const hadiths = Array.from({ length: 12 }, (_, i) => ({
    content: [
      "Senyummu di hadapan saudaramu adalah sedekah.",
      "Sebaik-baik kalian adalah yang belajar Al-Quran dan mengajarkannya.",
      "Harta tidak akan berkurang karena sedekah.",
      "Kebersihan sebagian dari iman.",
      "Tangan di atas lebih baik daripada tangan di bawah.",
      "Sampaikanlah dariku walau hanya satu ayat.",
      "Siapa yang jujur maka ia akan tenang.",
      "Sesungguhnya Allah itu indah dan menyukai keindahan.",
      "Barangsiapa shalat subuh maka ia dalam jaminan Allah.",
      "Permudahlah dan jangan mempersulit.",
      "Surga berada di bawah telapak kaki ibu.",
      "Sayangilah yang di bumi, maka yang di langit menyayangimu."
    ][i],
    narrator: ["HR. Tirmidzi", "HR. Bukhari", "HR. Muslim", "HR. Muslim", "HR. Bukhari", "HR. Bukhari", "HR. Tirmidzi", "HR. Muslim", "HR. Muslim", "HR. Bukhari", "HR. Ahmad", "HR. Tirmidzi"][i],
    display_date: `${curYear}-05-${(11 + i).toString().padStart(2, '0')}`
  }));

  // 2. Finance (10 items)
  const finance = [
    { date: `${curYear}-05-01`, type: "income", amount: 25000000, description: "Saldo Awal Kas", category: "Lain-lain" },
    { date: `${curYear}-05-02`, type: "expense", amount: 1500000, description: "Honor Imam & Marbot", category: "Operasional" },
    { date: `${curYear}-05-04`, type: "income", amount: 3200000, description: "Infaq Jumat Pekan 1", category: "Infaq" },
    { date: `${curYear}-05-05`, type: "expense", amount: 800000, description: "Pembelian Alat Kebersihan", category: "Operasional" },
    { date: `${curYear}-05-06`, type: "income", amount: 1500000, description: "Sedekah Subuh", category: "Infaq" },
    { date: `${curYear}-05-08`, type: "expense", amount: 2100000, description: "Tagihan Listrik & WiFi", category: "Operasional" },
    { date: `${curYear}-05-09`, type: "income", amount: 5400000, description: "Infaq Jumat Pekan 2", category: "Infaq" },
    { date: `${curYear}-05-10`, type: "expense", amount: 450000, description: "Konsumsi Rapat Pengurus", category: "Kegiatan" },
    { date: `${curYear}-05-11`, type: "income", amount: 2000000, description: "Donasi Renovasi Atap", category: "Pembangunan" },
    { date: `${curYear}-05-11`, type: "expense", amount: 300000, description: "Perbaikan Kran Wudhu", category: "Operasional" },
  ];

  // 3. News (6 items)
  const news = [
    { title: "Kajian Kitab Al-Hikam", category: "Kajian", content: "Membahas tasawuf setiap malam jumat.", image_url: "https://images.unsplash.com/photo-1584281729155-3c9933058122?w=800" },
    { title: "Penerimaan Zakat Fitrah", category: "Zakat", content: "Panitia siap menerima zakat mal dan fitrah.", image_url: "https://images.unsplash.com/photo-1544923246-77307dd654ca?w=800" },
    { title: "Fogging Lingkungan", category: "Berita", content: "Antisipasi DBD di wilayah Notoprajan.", image_url: "https://images.unsplash.com/photo-1519817650390-64a934479f61?w=800" },
    { title: "Pemeriksaan Kesehatan Gratis", category: "Berita", content: "Kerjasama dengan Puskesmas Ngampilan.", image_url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800" },
    { title: "Santunan Anak Yatim", category: "Sosial", content: "Berbagi kebahagiaan di bulan mulia.", image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800" },
  ];

  // Clear and Insert
  await supabase.from('hadith').delete().neq('id', 0);
  await supabase.from('finance_reports').delete().neq('id', 0);
  await supabase.from('news').delete().neq('id', 0);
  
  await supabase.from('hadith').insert(hadiths);
  await supabase.from('finance_reports').insert(finance);
  await supabase.from('news').insert(news);

  console.log("🎉 30+ DATA BERHASIL MASUK KE SUPABASE!");
}

seed();
