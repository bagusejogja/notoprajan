import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function seed() {
  console.log("🌟 Menyempurnakan Data (Gallery, Jumat, Kajian)...");
  
  const today = new Date().toISOString().split('T')[0];
  const nextFriday = "2026-05-15"; // Manual set to a Friday in May 2026

  // 1. Update Gallery (Fix Kegiatan Kajian)
  await supabase.from('gallery').delete().neq('id', 0);
  await supabase.from('gallery').insert([
    { title: "Kegiatan Kajian Rutin", image_url: "https://images.unsplash.com/photo-1542623024-a797a7cbd0ed?w=1200" },
    { title: "Shalat Berjamaah", image_url: "https://images.unsplash.com/photo-1590073844006-33379778ae09?w=1200" },
    { title: "Ukhuwah Islamiyah", image_url: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1200" }
  ]);

  // 2. Update Friday Schedule (Add Muadzin)
  await supabase.from('friday_schedules').delete().neq('id', 0);
  await supabase.from('friday_schedules').insert([
    { date: nextFriday, khotib: "Dr. KH. Haedar Nashir", imam: "Ust. Miftah", muadzin: "Pak Bilal" }
  ]);

  // 3. Update Study Schedules (Kajian)
  await supabase.from('study_schedules').delete().neq('id', 0);
  await supabase.from('study_schedules').insert([
    { title: "Tafsir Al-Quran Al-Azhar", speaker: "Ustadz Dr. Ahmad", date: today, time: "18:30" },
    { title: "Kajian Fiqih Kontemporer", speaker: "Ustadz Abdullah", date: "2026-05-12", time: "19:30" }
  ]);

  console.log("✅ DATA SEMPURNA BERHASIL DISUNTIKKAN!");
}

seed();
