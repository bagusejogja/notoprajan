import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Masjid Notoparaja | Modern & Transparan",
  description: "Platform digital Masjid Notoparaja untuk jamaah. Jadwal shalat, marketplace berkah, dan laporan keuangan transparan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${outfit.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950">
        <main className="flex-grow">
          {children}
        </main>
        <footer className="py-8 text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
          <p>© {new Date().getFullYear()} Smart Mosque Portal. Membangun Umat, Menyejahterakan Masjid.</p>
        </footer>
      </body>
    </html>
  );
}
