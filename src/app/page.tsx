import Hero from "@/components/Hero";
import DailyHadith from "@/components/DailyHadith";
import Schedules from "@/components/Schedules";
import Marketplace from "@/components/Marketplace";
import News from "@/components/News";
import Finance from "@/components/Finance";
import Gallery from "@/components/Gallery";
import Donation from "@/components/Donation";
import { MessageSquare } from "lucide-react";

export default function Home() {
  return (
    <div className="relative">
      {/* Navigation - Floating Glass Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
        <div className="glass-dark px-8 py-4 rounded-3xl flex items-center justify-between shadow-2xl backdrop-blur-xl border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="font-outfit font-bold text-white text-lg tracking-tight hidden sm:block">SmartMosque</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-slate-300 text-sm font-medium">
            <a href="#" className="hover:text-emerald-400 transition-colors">Beranda</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Marketplace</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Keuangan</a>
            <a href="/admin" className="text-emerald-500 font-bold hover:text-emerald-400 transition-colors border-l border-white/10 pl-8">Admin</a>
          </div>

          <button className="px-5 py-2 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30">
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section (Includes Slider) */}
      <Hero />

      {/* Daily Hadith Section */}
      <DailyHadith />

      {/* Schedules Section */}
      <Schedules />

      {/* Marketplace Section */}
      <Marketplace />

      {/* News & Multimedia Section */}
      <News />

      {/* Gallery Section */}
      <Gallery />

      {/* Finance Section */}
      <Finance />

      {/* Donation Section */}
      <Donation />

      {/* Floating Action Button for Support/WhatsApp */}
      <a 
        href="https://wa.me/628123456789" 
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform hover:bg-emerald-600 group"
      >
        <MessageSquare size={28} />
        <span className="absolute right-20 px-4 py-2 rounded-xl bg-white text-slate-900 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-xl pointer-events-none whitespace-nowrap">
          Tanya Pengurus
        </span>
      </a>
    </div>
  );
}
