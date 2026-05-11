import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function seed() {
  console.log("⚡ Menyuntikkan DATA FINAL (Semua Tabel Terisi)...");
  
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0];

  // Clear All
  const tables = ['hadith', 'news', 'gallery', 'videos', 'finance_reports', 'marketplace', 'study_schedules', 'friday_schedules'];
  for (const table of tables) {
    await supabase.from(table).delete().neq('id', 0);
  }

  // 1. Hadith
  await supabase.from('hadith').insert([
    { content: "Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain.", narrator: "HR. Ahmad", display_date: today },
    { content: "Senyummu di hadapan saudaramu adalah sedekah.", narrator: "HR. Tirmidzi", display_date: tomorrow }
  ]);

  // 2. News
  await supabase.from('news').insert([
    { title: "Kajian Rutin Al-Hikam", category: "Kajian", content: "Setiap Malam Jumat.", image_url: "https://images.unsplash.com/photo-1584281729155-3c9933058122?w=800" },
    { title: "Bakti Sosial Ramadhan", category: "Berita", content: "Pembagian Sembako.", image_url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800" }
  ]);

  // 3. Gallery
  await supabase.from('gallery').insert([
    { image_url: "https://images.unsplash.com/photo-1597404294360-fedede44308a?w=800", title: "Shalat Berjamaah" },
    { image_url: "https://images.unsplash.com/photo-1519817650390-64a934479f61?w=800", title: "Kajian Sore" }
  ]);

  // 4. Videos
  await supabase.from('videos').insert([
    { video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "Video Dokumentasi Masjid" }
  ]);

  // 5. Study Schedules (Jadwal Kajian)
  await supabase.from('study_schedules').insert([
    { title: "Tafsir Al-Quran", speaker: "Ustadz Dr. Ahmad", date: today, time: "18:30" },
    { title: "Fiqih Muamalah", speaker: "Ustadz Abdullah", date: tomorrow, time: "19:30" }
  ]);

  // 6. Friday Schedules (Jadwal Jumat)
  await supabase.from('friday_schedules').insert([
    { date: nextWeek, khotib: "Dr. KH. Haedar Nashir", imam: "Ust. Miftah", muadzin: "Pak Bilal" }
  ]);

  // 7. Finance
  await supabase.from('finance_reports').insert([
    { date: today, type: "income", amount: 15000000, description: "Saldo Awal", category: "Lain-lain" },
    { date: today, type: "income", amount: 4500000, description: "Infaq Jumat", category: "Infaq" }
  ]);

  // 8. Marketplace
  await supabase.from('marketplace').insert([
    { name: "Madu Murni", price: "Rp 120.000", seller: "Pak Ahmad", whatsapp: "628123456789", image_url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400" }
  ]);

  console.log("✅ JOSS! SEMUA TABEL TERISI DATA TAHUN 2026.");
}

seed();
