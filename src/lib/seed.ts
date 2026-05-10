import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function seed() {
  console.log("🌱 Memulai pengisian data demo...");

  // 1. Hadith (10 data)
  const hadiths = [
    { content: "Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain.", narrator: "HR. Ahmad", display_date: "2024-05-10" },
    { content: "Kebersihan itu sebagian dari iman.", narrator: "HR. Muslim", display_date: "2024-05-11" },
    { content: "Senyummu di hadapan saudaramu adalah sedekah.", narrator: "HR. Tirmidzi", display_date: "2024-05-12" },
    { content: "Tangan di atas lebih baik daripada tangan di bawah.", narrator: "HR. Bukhari", display_date: "2024-05-13" },
    { content: "Barangsiapa yang menempuh jalan untuk mencari ilmu, Allah mudahkan baginya jalan ke surga.", narrator: "HR. Muslim", display_date: "2024-05-14" },
    { content: "Sampaikanlah dariku walau hanya satu ayat.", narrator: "HR. Bukhari", display_date: "2024-05-15" },
    { content: "Shalat adalah tiang agama.", narrator: "HR. Baihaqi", display_date: "2024-05-16" },
    { content: "Surga itu di bawah telapak kaki ibu.", narrator: "HR. Ahmad", display_date: "2024-05-17" },
    { content: "Harta tidak akan berkurang karena sedekah.", narrator: "HR. Muslim", display_date: "2024-05-18" },
    { content: "Malu adalah bagian dari iman.", narrator: "HR. Bukhari", display_date: "2024-05-19" },
  ];
  await supabase.from('hadith').insert(hadiths);
  console.log("✅ Hadits Berhasil");

  // 2. Finance (10 data)
  const finances = [
    { date: "2024-05-01", type: "income", amount: 5000000, description: "Infaq Jumat Pekan 1" },
    { date: "2024-05-02", type: "expense", amount: 250000, description: "Listrik & Air" },
    { date: "2024-05-03", type: "income", amount: 1200000, description: "Donasi Renovasi Atap" },
    { date: "2024-05-05", type: "expense", amount: 500000, description: "Bisyaroh Imam & Khotib" },
    { date: "2024-05-08", type: "income", amount: 4500000, description: "Infaq Jumat Pekan 2" },
    { date: "2024-05-10", type: "expense", amount: 150000, description: "Kebersihan & Taman" },
    { date: "2024-05-12", type: "income", amount: 2000000, description: "Zakat Mal Hamba Allah" },
    { date: "2024-05-15", type: "expense", amount: 1000000, description: "Santunan Anak Yatim" },
    { date: "2024-05-18", type: "income", amount: 3800000, description: "Infaq Jumat Pekan 3" },
    { date: "2024-05-20", type: "expense", amount: 300000, description: "Perbaikan Sound System" },
  ];
  await supabase.from('finance_reports').insert(finances);
  console.log("✅ Keuangan Berhasil");

  // 3. News (5 data)
  const news = [
    { title: "Kajian Rutin Kitab Al-Hikam", category: "Kajian", content: "Mari ikuti kajian mendalam setiap malam jumat bersama Ust. Dr. Abdullah.", image_url: "https://images.unsplash.com/photo-1584281729155-3c9933058122?w=800" },
    { title: "Penerimaan Hewan Kurban 1445 H", category: "Berita", content: "Masjid Notoparaja membuka pendaftaran kurban bagi jamaah.", image_url: "https://images.unsplash.com/photo-1544923246-77307dd654ca?w=800" },
    { title: "Fogging Massal Area Masjid", category: "Umum", content: "Antisipasi DBD, masjid melakukan penyemprotan rutin.", image_url: "https://images.unsplash.com/photo-1519817650390-64a934479f61?w=800" },
    { title: "TPA Anak-anak Libur Lebaran", category: "Berita", content: "Kegiatan belajar mengaji diliburkan selama 1 minggu.", image_url: "https://images.unsplash.com/photo-1526674179247-f39ed5ffa0d8?w=800" },
    { title: "Pelatihan Pengurusan Jenazah", category: "Kajian", content: "Edukasi fardhu kifayah bagi para pemuda masjid.", image_url: "https://images.unsplash.com/photo-1590073844006-33379778ae09?w=800" },
  ];
  await supabase.from('news').insert(news);
  console.log("✅ Berita Berhasil");

  // 4. Marketplace (5 data)
  const products = [
    { name: "Madu Murni Sidr", price: "Rp 125.000", seller: "Pak Ahmad", image_url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400", whatsapp: "628123456789" },
    { name: "Kurma Ajwa Super", price: "Rp 210.000", seller: "Ibu Fatimah", image_url: "https://images.unsplash.com/photo-1590005024862-6b67679a29fb?w=400", whatsapp: "628123456789" },
    { name: "Habbatussauda Oil", price: "Rp 45.000", seller: "Bapak Satria", image_url: "https://images.unsplash.com/photo-1611073113013-176313175001?w=400", whatsapp: "628123456789" },
    { name: "Peci Rajut Handmade", price: "Rp 35.000", seller: "Ibu Rahma", image_url: "https://images.unsplash.com/photo-1621460248083-659f6336f3d1?w=400", whatsapp: "628123456789" },
    { name: "Minyak Zaitun Extra Virgin", price: "Rp 65.000", seller: "Ukhti Sarah", image_url: "https://images.unsplash.com/photo-1474979266404-7eaacabc8805?w=400", whatsapp: "628123456789" },
  ];
  await supabase.from('marketplace').insert(products);
  console.log("✅ Marketplace Berhasil");

  // 5. Schedules
  const studies = [
    { title: "Tafsir Jalalain", speaker: "Ust. Khalid", date: "2024-05-22", time: "18:30" },
    { title: "Fiqih Muamalah", speaker: "Ust. Syafiq", date: "2024-05-24", time: "19:30" },
    { title: "Tahsin Quran", speaker: "Ust. Zulkifli", date: "2024-05-26", time: "16:00" },
  ];
  const fridays = [
    { date: "2024-05-24", khotib: "Dr. KH. Marsudi Syuhud", imam: "Ust. Miftah", muadzin: "Pak Bilal" },
    { date: "2024-05-31", khotib: "Ust. Yusuf Mansur", imam: "Ust. Hanan Attaki", muadzin: "Pak Marbot" },
  ];
  await supabase.from('study_schedules').insert(studies);
  await supabase.from('friday_schedules').insert(fridays);
  console.log("✅ Jadwal Berhasil");

  console.log("🎉 SEMUA DATA DEMO BERHASIL MASUK!");
}

seed();
