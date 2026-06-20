import { useState, useEffect } from "react";
import { Users, Trash2, UserPlus, Shield, Edit2, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface UserProps {
  canDo: (menuId: string, action: string) => boolean;
  rolePermissions: any[];
}

export default function UserManager({ canDo, rolePermissions: initialRoles }: UserProps) {
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [rolePermissions, setRolePermissions] = useState<any[]>(initialRoles || []);
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "humas", nama_lengkap: "", email: "", wa: "" });
  const [newRoleName, setNewRoleName] = useState("");

  const [menus, setMenus] = useState<any[]>([]);
  const [newMenu, setNewMenu] = useState({ id: "", label: "", icon_name: "ShoppingBag", path: "/admin/", order_priority: 1 });

  useEffect(() => {
    fetchAdminUsers();
    fetchRolePermissions();
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    const { data } = await supabase.from('admin_menus').select('*').order('order_priority', { ascending: true });
    if (data) setMenus(data);
  };

  const handleSaveMenu = async () => {
    if (!newMenu.id || !newMenu.label) return alert("ID dan Label wajib diisi");
    const { error } = await supabase.from('admin_menus').upsert([newMenu]);
    if (error) alert("Gagal: " + error.message);
    else { fetchMenus(); alert("Menu berhasil disimpan!"); }
  };

  const handleDeleteMenu = async (id: string) => {
    if (!confirm("Hapus menu ini? Ini akan menghilangkan menu dari sidebar semua user.")) return;
    await supabase.from('admin_menus').delete().eq('id', id);
    fetchMenus();
  };

  const fetchAdminUsers = async () => {
    const { data } = await supabase.from('admin_users').select('*').order('id', { ascending: true });
    if (data) setAdminUsers(data);
  };

  const fetchRolePermissions = async () => {
    const { data } = await supabase.from('role_permissions').select('*').order('id', { ascending: true });
    if (data) setRolePermissions(data);
  };

  const handleSaveUser = async () => {
    if (!newUser.username || !newUser.password) return alert("Username & Password wajib diisi");
    const { error } = await supabase.from('admin_users').insert([newUser]);
    if (error) alert("Gagal: " + error.message);
    else {
      setNewUser({ username: "", password: "", role: "humas", nama_lengkap: "", email: "", wa: "" });
      fetchAdminUsers();
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Hapus user ini?")) return;
    await supabase.from('admin_users').delete().eq('id', id);
    fetchAdminUsers();
  };

  const updateRoleMenu = async (rp: any, menuId: string, isChecked: boolean) => {
    let newMenus = [...rp.menus];
    if (isChecked && !newMenus.includes(menuId)) newMenus.push(menuId);
    if (!isChecked) newMenus = newMenus.filter((m: string) => m !== menuId);
    await supabase.from('role_permissions').update({ menus: newMenus }).eq('id', rp.id);
    fetchRolePermissions();
  };

  const updateRoleCrud = async (rp: any, menuId: string, action: string, isChecked: boolean) => {
    const currentCrud = rp.crud || {};
    const currentActions: string[] = currentCrud[menuId] || [];
    let newActions = [...currentActions];
    if (isChecked && !newActions.includes(action)) newActions.push(action);
    if (!isChecked) newActions = newActions.filter(a => a !== action);
    const newCrud = { ...currentCrud, [menuId]: newActions };
    await supabase.from('role_permissions').update({ crud: newCrud }).eq('id', rp.id);
    fetchRolePermissions();
  };

  const handleAddRole = async () => {
    if (!newRoleName.trim()) return alert("Nama aktor wajib diisi!");
    const roleKey = newRoleName.toLowerCase().replace(/\s+/g, '_');
    const { error } = await supabase.from('role_permissions').insert([{ role: roleKey, menus: [], crud: {} }]);
    if (error) alert("Gagal: " + error.message);
    else { setNewRoleName(""); fetchRolePermissions(); }
  };

  const handleDeleteRole = async (id: number, role: string) => {
    if (role === 'superadmin') return alert("Superadmin tidak bisa dihapus!");
    if (!confirm(`Hapus aktor "${role}"?`)) return;
    await supabase.from('role_permissions').delete().eq('id', id);
    fetchRolePermissions();
  };

  const availableMenus = menus.map(m => ({ id: m.id, label: m.label }));

  return (
    <div className="space-y-12 text-left animate-in fade-in duration-500">
      {/* SEKSI 1: MANAJEMEN MENU */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black flex items-center gap-2 text-slate-800">
          <Shield size={28} className="text-amber-500" /> Manajemen Menu Sidebar
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-4">
              <h3 className="font-bold text-amber-600 border-b pb-4">Tambah/Edit Menu</h3>
              <div className="space-y-3">
                 <input type="text" value={newMenu.id} onChange={(e) => setNewMenu({...newMenu, id: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl text-sm" placeholder="Menu ID" />
                 <input type="text" value={newMenu.label} onChange={(e) => setNewMenu({...newMenu, label: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl text-sm" placeholder="Label Sidebar" />
                 <input type="text" value={newMenu.icon_name} onChange={(e) => setNewMenu({...newMenu, icon_name: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl text-sm" placeholder="Lucide Icon Name" />
                 <input type="text" value={newMenu.path} onChange={(e) => setNewMenu({...newMenu, path: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl text-sm" placeholder="Path (/admin/...)" />
                 <input type="number" value={newMenu.order_priority} onChange={(e) => setNewMenu({...newMenu, order_priority: Number(e.target.value)})} className="w-full bg-slate-50 border p-3 rounded-xl text-sm" placeholder="Urutan" />
                 <button onClick={handleSaveMenu} className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold shadow-lg">Simpan Menu</button>
              </div>
           </div>
           <div className="lg:col-span-2 bg-white border rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                 <thead className="bg-slate-50 text-[10px] uppercase font-black tracking-widest text-slate-400 border-b">
                    <tr><th className="p-4 text-left">Label</th><th className="p-4 text-left">Path</th><th className="p-4 text-center">Aksi</th></tr>
                 </thead>
                 <tbody className="divide-y">
                    {menus.map(m => (
                       <tr key={m.id} className="hover:bg-slate-50">
                          <td className="p-4 font-bold">{m.label} <span className="text-[10px] font-normal text-slate-400 ml-2">#{m.id}</span></td>
                          <td className="p-4 text-xs font-mono">{m.path}</td>
                          <td className="p-4 text-center">
                             <div className="flex justify-center gap-1">
                                <button onClick={() => setNewMenu(m)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg"><Edit2 size={16}/></button>
                                <button onClick={() => handleDeleteMenu(m.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={16}/></button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </section>

      {/* SEKSI 2: MANAJEMEN USER */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black flex items-center gap-2 text-slate-800">
          <Users size={28} className="text-emerald-500" /> Manajemen User
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-4">
              <h3 className="font-bold text-emerald-600 flex items-center gap-2 border-b pb-4">
                 <Users size={20} /> Tambah User Baru
              </h3>
              <div className="space-y-3">
                 <input type="text" value={newUser.nama_lengkap} onChange={(e) => setNewUser({...newUser, nama_lengkap: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl text-sm" placeholder="Nama Lengkap" />
                 <input type="text" value={newUser.username} onChange={(e) => setNewUser({...newUser, username: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl text-sm" placeholder="Username" />
                 <input type="password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl text-sm" placeholder="Password" />
                 <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl text-sm">
                    {rolePermissions.map(rp => <option key={rp.id} value={rp.role}>{rp.role.toUpperCase()}</option>)}
                 </select>
                 <button onClick={handleSaveUser} className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold shadow-lg">Simpan User</button>
              </div>
           </div>

           <div className="lg:col-span-2 bg-white border rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                 <thead className="bg-slate-50 text-[10px] uppercase font-black tracking-widest text-slate-400 border-b">
                    <tr><th className="p-4 text-left">User</th><th className="p-4 text-center">Aktor</th><th className="p-4 text-center">Aksi</th></tr>
                 </thead>
                 <tbody className="divide-y">
                    {adminUsers.map(u => (
                       <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4">
                             <div className="font-bold">{u.nama_lengkap}</div>
                             <div className="text-xs text-slate-400">@{u.username}</div>
                          </td>
                          <td className="p-4 text-center">
                             <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">{u.role}</span>
                          </td>
                          <td className="p-4 text-center">
                             <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={16}/></button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </section>

      {/* SEKSI 3: MANAJEMEN HAK AKSES */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black flex items-center gap-2 text-slate-800">
          <Shield size={28} className="text-indigo-500" /> Manajemen Hak Akses & Aktor
        </h2>
        
        <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex gap-4 items-center mb-8">
           <input type="text" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} className="flex-1 bg-white border p-3 rounded-xl outline-none" placeholder="Masukkan nama aktor baru" />
           <button onClick={handleAddRole} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg">TAMBAH AKTOR</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {rolePermissions.map(rp => (
              <div key={rp.id} className="bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-6 relative border-t-8 border-t-indigo-500">
                 <div className="flex justify-between items-center border-b pb-4">
                    <div>
                       <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500">NAMA AKTOR (ROLE)</div>
                       <div className="text-xl font-black uppercase text-slate-800">{rp.role}</div>
                    </div>
                    {rp.role !== 'superadmin' && (
                       <button onClick={() => handleDeleteRole(rp.id, rp.role)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={20}/></button>
                    )}
                 </div>

                 <div className="space-y-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hak Akses Menu & CRUD</div>
                    <div className="grid grid-cols-1 gap-2">
                       {availableMenus.map(menu => (
                          <div key={menu.id} className="flex flex-col p-3 rounded-2xl bg-slate-50 border hover:bg-white transition-all">
                             <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-700">{menu.label}</span>
                                <input 
                                   type="checkbox" 
                                   checked={rp.menus.includes(menu.id)} 
                                   disabled={rp.role === 'superadmin'}
                                   onChange={(e) => updateRoleMenu(rp, menu.id, e.target.checked)}
                                   className="w-5 h-5 accent-indigo-600"
                                />
                             </div>
                             {rp.menus.includes(menu.id) && (
                                <div className="flex gap-4 mt-2 pl-2 border-l-2 border-indigo-200">
                                   {['C', 'R', 'U', 'D'].map(action => {
                                      const fullAction = action === 'C' ? 'create' : action === 'R' ? 'read' : action === 'U' ? 'update' : 'delete';
                                      const isChecked = (rp.crud?.[menu.id] || []).includes(fullAction);
                                      return (
                                         <label key={action} className="flex items-center gap-1 cursor-pointer">
                                            <input 
                                               type="checkbox" 
                                               checked={isChecked}
                                               disabled={rp.role === 'superadmin'}
                                               onChange={(e) => updateRoleCrud(rp, menu.id, fullAction, e.target.checked)}
                                               className="w-3 h-3 accent-emerald-500"
                                            />
                                            <span className={`text-[10px] font-black ${isChecked ? 'text-emerald-600' : 'text-slate-300'}`}>{action}</span>
                                         </label>
                                      );
                                   })}
                                </div>
                             )}
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           ))}
        </div>
      </section>
    </div>
  );
}
