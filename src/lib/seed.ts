import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function seed() {
  console.log("🌟 Sinkronisasi Nama Notoprajan & Perbaikan Galeri...");
  
  const today = new Date().toISOString().split('T')[0];

  // 1. Fix Gallery Images & Titles
  await supabase.from('gallery').delete().neq('id', 0);
  await supabase.from('gallery').insert([
    { 
      title: "Kegiatan Kajian Rutin Notoprajan", 
      image_url: "https://images.unsplash.com/photo-1542623024-a797a7cbd0ed?auto=format&fit=crop&q=80&w=1200" 
    },
    { 
      title: "Shalat Berjamaah di Notoprajan", 
      image_url: "https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&q=80&w=1200" 
    },
    { 
      title: "Lingkungan Asri Notoprajan", 
      image_url: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=80&w=1200" 
    }
  ]);

  console.log("✅ DATA NOTOPRAJAN & GALERI SIAP!");
}

seed();
