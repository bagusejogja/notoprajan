import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function seed() {
  console.log("📸 Memperbarui foto Galeri dengan link yang lebih stabil...");
  
  await supabase.from('gallery').delete().neq('id', 0);
  await supabase.from('gallery').insert([
    { 
      title: "Kegiatan Kajian", 
      image_url: "https://images.unsplash.com/photo-1542623024-a797a7cbd0ed?auto=format&fit=crop&q=80&w=1000" 
    },
    { 
      title: "Shalat Berjamaah", 
      image_url: "https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&q=80&w=1000" 
    },
    { 
      title: "Lingkungan Masjid", 
      image_url: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=80&w=1000" 
    }
  ]);

  console.log("✅ Galeri diperbarui!");
}

seed();
