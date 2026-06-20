"use client";
import GalleryManager from "../modules/GalleryManager";
import { useAdminAuth } from "../layout";

export default function GalleryPage() {
  const { canDo } = useAdminAuth();
  return <GalleryManager canDo={canDo} />;
}
