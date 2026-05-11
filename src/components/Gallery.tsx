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
    <section className="py-24 px-4 bg-white" id="galeri">
      <div className="max-w-6xl mx-auto space-y-12 text-center">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold font-outfit">Galeri Kegiatan</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Dokumentasi berbagai momen bermakna di Masjid Notoparaja Yogyakarta.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {images.length > 0 ? images.map((img) => (
            <div key={img.id} className="group relative aspect-square rounded-[2rem] overflow-hidden shadow-lg bg-slate-100">
              <img 
                src={img.image_url} 
                alt={img.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <span className="text-white font-bold text-sm">{img.title}</span>
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
