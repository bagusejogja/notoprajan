import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function seed() {
  console.log("📸 Mengisi 8 Foto Galeri (4x2)...");
  
  await supabase.from('gallery').delete().neq('id', 0);
  await supabase.from('gallery').insert([
    { title: "Kajian Rutin Notoprajan", image_url: "https://images.unsplash.com/photo-1542623024-a797a7cbd0ed?w=800" },
    { title: "Shalat Berjamaah", image_url: "https://images.unsplash.com/photo-1590073844006-33379778ae09?w=800" },
    { title: "Kegiatan TPA", image_url: "https://images.unsplash.com/photo-1526674179247-f39ed5ffa0d8?w=800" },
    { title: "Buka Puasa Bersama", image_url: "https://images.unsplash.com/photo-1590005024862-6b67679a29fb?w=800" },
    { title: "Persiapan Shalat Ied", image_url: "https://images.unsplash.com/photo-1584281729155-3c9933058122?w=800" },
    { title: "Santunan Anak Yatim", image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800" },
    { title: "Pemeriksaan Kesehatan", image_url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800" },
    { title: "Kerja Bakti Masjid", image_url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800" }
  ]);

  console.log("✅ 8 Foto Galeri Sukses Masuk!");
}

seed();
