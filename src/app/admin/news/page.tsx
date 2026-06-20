"use client";
import NewsManager from "../modules/NewsManager";
import { useAdminAuth } from "../layout";

export default function NewsPage() {
  const { canDo } = useAdminAuth();
  return <NewsManager canDo={canDo} />;
}
