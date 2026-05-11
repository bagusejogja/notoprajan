"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Marketplace() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase
        .from('marketplace')
        .select('*')
        .order('id', { ascending: false });
      if (data) setProducts(data);
    }
    fetchProducts();
  }, []);

  return (
    <section className="py-24 px-4 bg-white" id="market">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-sm font-semibold">
              <ShoppingBag size={14} />
              <span>Ekonomi Umat</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-outfit">Marketplace Berkah</h2>
            <p className="text-slate-500 max-w-md">
              Dukung UMKM jamaah kita. Produk berkualitas dari tangan-tangan kreatif lingkungan masjid.
            </p>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group flex flex-col bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 text-left">
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={product.image_url || "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400"} 
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium">
                    {product.seller}
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="font-bold text-lg group-hover:text-emerald-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-indigo-950">{product.price}</span>
                    <a 
                      href={`https://wa.me/${product.whatsapp || '628123456789'}?text=Assalamuallaikum, saya tertarik dengan ${product.name}`}
                      className="p-3 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-all hover:rotate-12"
                    >
                      <MessageCircle size={20} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem]">
             <p className="text-slate-400 italic">Belum ada produk marketplace yang tersedia.</p>
          </div>
        )}
      </div>
    </section>
  );
}
