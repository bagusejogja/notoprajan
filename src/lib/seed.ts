import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function seed() {
  console.log("🌱 Menghapus data lama & mengisi data baru...");

  // Clear existing
  await supabase.from('hadith').delete().neq('id', 0);
  await supabase.from('news').delete().neq('id', 0);
  await supabase.from('marketplace').delete().neq('id', 0);
  await supabase.from('study_schedules').delete().neq('id', 0);
  await supabase.from('friday_schedules').delete().neq('id', 0);
  await supabase.from('finance_reports').delete().neq('id', 0);

  // 1. Hadith (15 entries)
  const hadiths = [
    { content: "Senyummu di hadapan saudaramu adalah sedekah.", narrator: "HR. Tirmidzi", display_date: "2024-05-11" },
    { content: "Sebaik-baik kalian adalah yang belajar Al-Quran dan mengajarkannya.", narrator: "HR. Bukhari", display_date: "2024-05-12" },
    { content: "Barangsiapa yang menempuh jalan untuk mencari ilmu, Allah mudahkan baginya jalan ke surga.", narrator: "HR. Muslim", display_date: "2024-05-13" },
    { content: "Tangan di atas lebih baik daripada tangan di bawah.", narrator: "HR. Bukhari", display_date: "2024-05-14" },
    { content: "Barangsiapa yang shalat subuh maka ia berada dalam jaminan Allah.", narrator: "HR. Muslim", display_date: "2024-05-15" },
    { content: "Kebersihan sebagian dari iman.", narrator: "HR. Muslim", display_date: "2024-05-16" },
    { content: "Sesungguhnya Allah itu indah dan menyukai keindahan.", narrator: "HR. Muslim", display_date: "2024-05-17" },
    { content: "Siapa yang jujur maka ia akan tenang.", narrator: "HR. Tirmidzi", display_date: "2024-05-18" },
    { content: "Harta tidak akan berkurang karena sedekah.", narrator: "HR. Muslim", display_date: "2024-05-19" },
    { content: "Sampaikanlah dariku walau hanya satu ayat.", narrator: "HR. Bukhari", display_date: "2024-05-20" },
  ];
  await supabase.from('hadith').insert(hadiths);

  // 2. News (10 entries)
  const news = [
    { title: "Kajian Rutin Kitab Al-Hikam", category: "Kajian", content: "Membahas tasawuf setiap malam jumat.", image_url: "https://images.unsplash.com/photo-1584281729155-3c9933058122?w=800" },
    { title: "Penerimaan Zakat Fitrah 1445 H", category: "Berita", content: "Panitia Zakat masjid siap menerima penyaluran.", image_url: "https://images.unsplash.com/photo-1544923246-77307dd654ca?w=800" },
    { title: "Fogging Massal Area Notoprajan", category: "Berita", content: "Antisipasi DBD di lingkungan sekitar masjid.", image_url: "https://images.unsplash.com/photo-1519817650390-64a934479f61?w=800" },
    { title: "Lomba Adzan Tingkat Anak", category: "Berita", content: "Mencari bakat muadzin cilik di wilayah Ngampilan.", image_url: "https://images.unsplash.com/photo-1526674179247-f39ed5ffa0d8?w=800" },
    { title: "Buka Puasa Bersama Jamaah", category: "Ramadhan", content: "Tersedia 300 porsi takjil gratis setiap hari.", image_url: "https://images.unsplash.com/photo-1590073844006-33379778ae09?w=800" },
  ];
  await supabase.from('news').insert(news);

  // 3. Marketplace
  const products = [
    { name: "Madu Murni Sidr", price: "Rp 125.000", seller: "Pak Ahmad", image_url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400", whatsapp: "628123456789" },
    { name: "Kurma Ajwa VIP", price: "Rp 210.000", seller: "Ibu Fatimah", image_url: "https://images.unsplash.com/photo-1590005024862-6b67679a29fb?w=400", whatsapp: "628123456789" },
    { name: "Minyak Zaitun EVOO", price: "Rp 65.000", seller: "Ukhti Sarah", image_url: "https://images.unsplash.com/photo-1474979266404-7eaacabc8805?w=400", whatsapp: "628123456789" },
  ];
  await supabase.from('marketplace').insert(products);

  // 4. Finance
  const finance = [
    { date: "2024-05-01", type: "income", amount: 12500000, description: "Saldo Awal Bulan Mei", category: "Lain-lain" },
    { date: "2024-05-03", type: "income", amount: 4800000, description: "Infaq Jumat 1 Mei", category: "Infaq" },
    { date: "2024-05-05", type: "expense", amount: 1200000, description: "Tagihan Listrik & Air", category: "Operasional" },
    { date: "2024-05-07", type: "expense", amount: 500000, description: "Kebersihan Lingkungan", category: "Operasional" },
    { date: "2024-05-10", type: "income", amount: 5200000, description: "Infaq Jumat 8 Mei", category: "Infaq" },
  ];
  await supabase.from('finance_reports').insert(finance);

  // 5. Schedules
  const studies = [
    { title: "Tafsir Jalalain", speaker: "Ust. Khalid Basalamah", date: "2024-05-15", time: "18:30" },
    { title: "Fiqih Muamalah", speaker: "Ust. Syafiq Riza", date: "2024-05-17", time: "19:30" },
    { title: "Hadits Arba'in", speaker: "Ust. Adi Hidayat", date: "2024-05-19", time: "16:00" },
  ];
  const fridays = [
    { date: "2024-05-17", khotib: "Dr. KH. Haedar Nashir", imam: "Ust. Miftah", muadzin: "Pak Bilal" },
    { date: "2024-05-24", khotib: "Ust. Salim A. Fillah", imam: "Ust. Hanan Attaki", muadzin: "Pak Marbot" },
  ];
  await supabase.from('study_schedules').insert(studies);
  await supabase.from('friday_schedules').insert(fridays);

  console.log("🎉 DATA DUMMY LENGKAP BERHASIL DISUNTIKKAN!");
}

seed();
