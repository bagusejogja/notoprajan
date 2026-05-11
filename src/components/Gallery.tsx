"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Gallery() {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    async function fetchGallery() {
      const { data } = await supabase
        .from('gallery')
        .select('*')
        .order('id', { ascending: false })
        .limit(6);
      if (data) setImages(data);
    }
    fetchGallery();
  }, []);


  return (
    <section className="py-24 pt-32 px-4 bg-white" id="galeri">
      <div className="max-w-6xl mx-auto space-y-12 text-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-sm font-semibold mb-2">
             <span>Dokumentasi</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-outfit text-indigo-950">Galeri Kegiatan</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Momen-momen bermakna dalam syiar dan ukhuwah di Masjid Notoparaja Yogyakarta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.length > 0 ? images.map((img) => (
            <div key={img.id} className="group relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-xl bg-slate-200">
              <img 
                src={img.image_url || `https://images.unsplash.com/photo-1542623024-a797a7cbd0ed?w=800`} 
                alt={img.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-8">
                <span className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{img.title}</span>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-slate-400 italic bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
               Belum ada foto galeri. Silakan tambahkan melalui dashboard admin.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
