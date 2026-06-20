"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminIndex() {
  const router = useRouter();
  useEffect(() => {
    router.push("/admin/hadith");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] text-slate-400 font-medium italic animate-pulse">
      Memuat Dashboard...
    </div>
  );
}
