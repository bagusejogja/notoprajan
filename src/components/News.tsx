"use client";

import { useEffect, useState } from "react";
import { PlayCircle, ArrowRight, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function News() {
  const [news, setNews] = useState<any[]>([]);
  const [featuredVideo, setFeaturedVideo] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: newsData } = await supabase
        .from('news')
        .select('*')
        .order('id', { ascending: false })
        .limit(3);
      if (newsData) setNews(newsData);

      const { data: videoData } = await supabase
        .from('youtube_videos')
        .select('*')
        .order('id', { ascending: false })
        .limit(1)
        .single();
      if (videoData) setFeaturedVideo(videoData);
    }
    fetchData();
  }, []);

  return (
    <section className="py-24 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold font-outfit">Media & Informasi</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Ikuti perkembangan terbaru kegiatan masjid dan perkaya ilmu dengan artikel islami pilihan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Video Feature */}
          <div className="lg:col-span-2 group relative rounded-3xl overflow-hidden aspect-video shadow-2xl bg-slate-200">
            {featuredVideo ? (
              <iframe 
                src={featuredVideo.video_url.replace("watch?v=", "embed/")} 
                className="w-full h-full" 
                title={featuredVideo.title}
                allowFullScreen
              />
            ) : (
              <>
                <img 
                  src="https://images.unsplash.com/photo-1519817650390-64a934479f61?auto=format&fit=crop&q=80&w=1200" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="Live Streaming"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 transition-all hover:scale-110 hover:bg-emerald-500">
                    <PlayCircle size={48} fill="currentColor" className="text-emerald-500 group-hover:text-white" />
                  </button>
                </div>
                <div className="absolute bottom-8 left-8 right-8 text-left">
                  <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold mb-3 inline-block animate-pulse">LATEST VIDEO</span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">Video Kajian Belum Tersedia</h3>
                </div>
              </>
            )}
          </div>

          {/* Article List */}
          <div className="space-y-8">
            <h3 className="text-xl font-bold font-outfit border-b pb-4">Berita & Kajian</h3>
            {news.length > 0 ? (
              news.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-100">
                      <img src={item.image_url || "https://images.unsplash.com/photo-1584281729155-3c9933058122?auto=format&fit=crop&q=80&w=800"} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                    </div>
                    <div className="space-y-2 text-left">
                      <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold uppercase tracking-wider">
                        <span>{item.category}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Calendar size={12} />
                        <span>{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm italic">Belum ada berita terbaru.</p>
            )}
            
            <button className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 font-medium hover:border-emerald-500 hover:text-emerald-500 transition-all flex items-center justify-center gap-2 group">
              Lihat Semua
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
