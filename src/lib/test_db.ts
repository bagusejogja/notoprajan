import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function seed() {
  console.log("🔍 Mengecek koneksi & Mengisi data...");
  const curYear = "2026";

  const hadithData = [{ content: "Hadits Test", narrator: "Test", display_date: `${curYear}-05-11` }];
  const financeData = [{ date: `${curYear}-05-11`, type: "income", amount: 1000, description: "Test", category: "Infaq" }];
  const newsData = [{ title: "Berita Test", content: "Test", category: "Test", image_url: "https://test.com" }];

  // Helper to check error
  const push = async (table: string, data: any) => {
    const { error } = await supabase.from(table).insert(data);
    if (error) {
      console.error(`❌ GAGAL di tabel [${table}]:`, error.message);
      if (error.message.includes("policy")) {
        console.log(`👉 Solusi: Matikan RLS di dashboard Supabase untuk tabel [${table}] atau tambahkan Policy 'Enable Insert for Anon'.`);
      }
    } else {
      console.log(`✅ Sukses mengisi tabel [${table}]`);
    }
  };

  await push('hadith', hadithData);
  await push('finance_reports', financeData);
  await push('news', newsData);
  await push('marketplace', [{ name: "Test", price: "100", seller: "Test", whatsapp: "123" }]);
  await push('study_schedules', [{ title: "Test", speaker: "Test", date: `${curYear}-05-11`, time: "00:00" }]);
  await push('friday_schedules', [{ date: `${curYear}-05-11`, khotib: "Test", imam: "Test", muadzin: "Test" }]);

}

seed();
