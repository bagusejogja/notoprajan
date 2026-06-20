import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Package, Tag, MessageCircle, Save, Loader } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAdminAuth } from "../layout";

interface MarketplaceProps {
  canDo: (menuId: string, action: string) => boolean;
}

export default function MarketplaceManager({ canDo }: MarketplaceProps) {
  const { currentUser } = useAdminAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({ 
    name: "", price: "", stock: "", category_id: "", description: "", image_url: "", contact_wa: "", is_active: true 
  });

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [currentUser]);

  const fetchProducts = async () => {
    let query = supabase.from('marketplace_products').select('*, marketplace_categories(name)');
    
    // FILTER: Jika bukan superadmin, hanya lihat barang miliknya sendiri
    if (currentUser?.role !== 'superadmin') {
      query = query.eq('seller_id', currentUser.id);
    }

    const { data } = await query.order('created_at', { ascending: false });
    if (data) setProducts(data);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('marketplace_categories').select('*').order('name', { ascending: true });
    if (data) setCategories(data);
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "marketplace");
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    return data.url;
  };

  const onImageUpload = async (e: any) => {
    if (!e.target.files[0]) return;
    setIsUploading(true);
    const url = await handleFileUpload(e.target.files[0]);
    if (url) {
      if (editingProduct) setEditingProduct({ ...editingProduct, image_url: url });
      else setNewProduct({ ...newProduct, image_url: url });
    }
    setIsUploading(false);
  };

  const handleSaveProduct = async () => {
    const data = editingProduct || newProduct;
    if (!data.name || !data.price) return alert("Nama dan Harga wajib diisi!");

    const payload = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      stock: Number(data.stock) || 0,
      category_id: data.category_id || null,
      image_url: data.image_url,
      contact_wa: data.contact_wa
    };

    if (editingProduct) {
      await supabase.from('marketplace_products').update(payload).eq('id', editingProduct.id);
      setEditingProduct(null);
    } else {
      await supabase.from('marketplace_products').insert([payload]);
      setNewProduct({ name: "", description: "", price: "", stock: "", category_id: "", image_url: "", contact_wa: "" });
    }
    fetchProducts();
    alert("Produk berhasil disimpan!");
  };

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-3">
           <Package className="text-emerald-600" /> Manajemen Marketplace
        </h2>
        <div className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
          {products.length} Produk Terdaftar
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORM INPUT */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-4">
            <h3 className="font-bold text-emerald-600 border-b pb-2 flex items-center gap-2">
              {editingProduct ? "📝 Edit Produk" : "✨ Tambah Produk Baru"}
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nama Produk</label>
                <input type="text" value={editingProduct ? editingProduct.name : newProduct.name} onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, name: e.target.value}) : setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none" placeholder="Misal: Kurma Ajwa 1kg" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Harga (Rp)</label>
                  <input type="number" value={editingProduct ? editingProduct.price : newProduct.price} onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, price: e.target.value}) : setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl outline-none" placeholder="150000" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Stok</label>
                  <input type="number" value={editingProduct ? editingProduct.stock : newProduct.stock} onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, stock: e.target.value}) : setNewProduct({...newProduct, stock: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl outline-none" placeholder="10" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Kategori</label>
                <select value={editingProduct ? editingProduct.category_id : newProduct.category_id} onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, category_id: e.target.value}) : setNewProduct({...newProduct, category_id: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl outline-none">
                  <option value="">Pilih Kategori</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Deskripsi Produk</label>
                <textarea value={editingProduct ? editingProduct.description : newProduct.description} onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, description: e.target.value}) : setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl h-24 outline-none" placeholder="Detail produk..." />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nomor WA Penjual</label>
                <input type="text" value={editingProduct ? editingProduct.contact_wa : newProduct.contact_wa} onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, contact_wa: e.target.value}) : setNewProduct({...newProduct, contact_wa: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl outline-none" placeholder="08..." />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Foto Produk</label>
                <div className="flex items-center gap-4">
                  {(editingProduct?.image_url || newProduct.image_url) && (
                    <img src={editingProduct?.image_url || newProduct.image_url} className="w-16 h-16 object-cover rounded-xl border" />
                  )}
                  <input type="file" onChange={onImageUpload} className="text-xs flex-1" />
                  {isUploading && <Loader className="animate-spin text-emerald-500" size={16} />}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              {editingProduct && <button onClick={() => setEditingProduct(null)} className="flex-1 bg-slate-100 py-3 rounded-xl font-bold text-sm">Batal</button>}
              {((!editingProduct && canDo('marketplace', 'create')) || (editingProduct && canDo('marketplace', 'update'))) && (
                <button onClick={handleSaveProduct} className="flex-[2] bg-emerald-500 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
                  <Save size={18} /> Simpan Produk
                </button>
              )}
            </div>
          </div>
        </div>

        {/* LIST PRODUCTS */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border rounded-[2rem] overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 font-bold border-b text-[10px] uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="p-4 text-left">Produk</th>
                  <th className="p-4 text-left">Kategori</th>
                  <th className="p-4 text-right">Harga</th>
                  <th className="p-4 text-center">Stok</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.length === 0 && (
                  <tr><td colSpan={5} className="p-10 text-center text-slate-400">Belum ada produk di marketplace.</td></tr>
                )}
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image_url || "/placeholder-product.png"} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                        <div>
                          <div className="font-bold">{p.name}</div>
                          <div className="text-[10px] text-slate-400">WA: {p.contact_wa || "-"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-bold uppercase">
                        {p.marketplace_categories?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-emerald-600">
                      Rp {p.price.toLocaleString()}
                    </td>
                    <td className="p-4 text-center font-medium">
                      {p.stock}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-1">
                        {canDo('marketplace', 'update') && (
                          <button onClick={() => setEditingProduct(p)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors">
                            <Edit2 size={16} />
                          </button>
                        )}
                        {canDo('marketplace', 'delete') && (
                          <button onClick={async () => { if(confirm("Hapus produk ini?")){ await supabase.from('marketplace_products').delete().eq('id', p.id); fetchProducts(); } }} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
