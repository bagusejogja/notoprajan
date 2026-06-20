"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  LogOut, ShoppingBag, ImageIcon, BookOpen, Edit2, Target, MessageCircle, Settings, Quote, Newspaper, Wallet, Loader, Users, FileText
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext<any>(null);

export const useAdminAuth = () => useContext(AuthContext);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rolePermissions, setRolePermissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const [menus, setMenus] = useState<any[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("admin_user");
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    fetchRolePermissions();
    fetchMenus();
    setIsLoading(false);
  }, []);

  const fetchMenus = async () => {
    const { data } = await supabase.from('admin_menus').select('*').order('order_priority', { ascending: true });
    if (data) setMenus(data);
  };

  const iconMap: any = {
    ImageIcon, ShoppingBag, BookOpen, Quote, Newspaper, Wallet, Target, Settings, MessageCircle, Users, FileText
  };

  const fetchRolePermissions = async () => {
    const { data } = await supabase.from('role_permissions').select('*').order('id', { ascending: true });
    if (data) setRolePermissions(data);
  };

  const handleLogin = async () => {
    let user = null;
    if (username === "admin" && password === "1") {
      user = { username: "admin", role: "superadmin", nama_lengkap: "Admin Utama", id: 0 };
    } else {
      const { data } = await supabase.from('admin_users').select('*').eq('username', username).eq('password', password).single();
      user = data;
    }

    if (user) {
      setCurrentUser(user);
      localStorage.setItem("admin_user", JSON.stringify(user));
    } else alert("Login gagal!");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("admin_user");
    router.push("/admin");
  };

  const canDo = (menuId: string, action: string) => {
    if (currentUser?.role === 'superadmin') return true;
    const rp = rolePermissions.find(p => p.role === currentUser?.role);
    if (!rp) return false;
    const actions = (rp.crud || {})[menuId] || [];
    return actions.includes(action);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-emerald-500" /></div>;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[2.5rem] border w-full max-w-md shadow-2xl text-center space-y-8">
           <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-lg shadow-emerald-500/30">M</div>
           <h1 className="text-2xl font-bold font-outfit text-slate-800">Portal Admin</h1>
           <div className="space-y-4 text-left">
             <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-slate-50 border p-4 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Username" />
             <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} className="w-full bg-slate-50 border p-4 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Password" />
           </div>
           <button onClick={handleLogin} className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold tracking-widest hover:bg-emerald-600 transition-colors shadow-lg">LOGIN</button>
        </div>
      </div>
    );
  }

  const sidebarItems = menus.filter(item => {
    if (currentUser.role === 'superadmin') return true;
    const rp = rolePermissions.find(p => p.role === currentUser.role);
    return rp?.menus.includes(item.id);
  });

  return (
    <AuthContext.Provider value={{ currentUser, canDo, rolePermissions }}>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex font-inter">
        <aside className="w-64 border-r border-slate-200 bg-white p-6 flex flex-col shadow-sm z-10 sticky top-0 h-screen">
        <div className="space-y-8 flex-1 flex flex-col overflow-hidden">
          <div className="space-y-2 shrink-0">
            <div className="font-outfit font-black text-2xl text-emerald-600 px-2 tracking-tight cursor-pointer" onClick={() => router.push("/admin")}>Portal Admin</div>
            <div className="px-2">
              <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">{currentUser.role}</span>
            </div>
          </div>
          <nav className="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar flex-1">
            {sidebarItems.map(item => {
              const IconComponent = iconMap[item.icon_name] || (() => null);
              return (
                <button key={item.id} onClick={() => router.push(item.path)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all shrink-0 ${pathname === item.path ? "bg-emerald-500 text-white shadow-lg" : "text-slate-500 hover:bg-slate-100"}`}>
                  <IconComponent size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        <div className="pt-6 border-t mt-auto shrink-0">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all font-bold">
            <LogOut size={20} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>
        <main className="flex-1 p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthContext.Provider>
  );
}
