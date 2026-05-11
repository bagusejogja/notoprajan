import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function seed() {
  console.log("📺 Mengisi data Video ke tabel [youtube_videos]...");
  
  // 1. YouTube Videos
  await supabase.from('youtube_videos').delete().neq('id', 0);
  await supabase.from('youtube_videos').insert([
    { video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "Profil Masjid Notoparaja" },
    { video_url: "https://www.youtube.com/watch?v=5qap5aO4i9A", title: "Kajian Rutin Malam Jumat" }
  ]);

  console.log("✅ Video Sukses Masuk!");
}

seed();
