import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function seed() {
  console.log("🎬 Menyuntikkan 5 Slide Header Dinamis...");
  
  await supabase.from('hero_slides').delete().neq('id', 0);
  await supabase.from('hero_slides').insert([
    { 
      title: "Masjid Notoprajan", 
      subtitle: "Pusat Syiar & Ukhuwah Islamiyah di Jantung Kota Yogyakarta", 
      image_url: "https://images.unsplash.com/photo-1597404294360-fedede44308a?auto=format&fit=crop&q=80&w=2000",
      order_index: 1
    },
    { 
      title: "Kajian & Pendidikan", 
      subtitle: "Membentuk Generasi Rabbani melalui TPA dan Kajian Kitab Rutin", 
      image_url: "https://images.unsplash.com/photo-1519817650390-64a934479f61?auto=format&fit=crop&q=80&w=2000",
      order_index: 2
    },
    { 
      title: "Transparansi Keuangan", 
      subtitle: "Laporan Keuangan Real-Time sebagai Wujud Amanah Jamaah", 
      image_url: "https://images.unsplash.com/photo-1526674179247-f39ed5ffa0d8?auto=format&fit=crop&q=80&w=2000",
      order_index: 3
    },
    { 
      title: "Ramadhan di Notoprajan", 
      subtitle: "Semarak Berbagi Buka Puasa dan Ibadah di Bulan Suci", 
      image_url: "https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&q=80&w=2000",
      order_index: 4
    },
    { 
      title: "Ukhuwah Islamiyah", 
      subtitle: "Mempererat Tali Persaudaraan Antar Warga Notoprajan", 
      image_url: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=80&w=2000",
      order_index: 5
    }
  ]);

  console.log("✅ 5 SLIDE HEADER SUKSES DISUNTIKKAN!");
}

seed();
