"use client";
import LelayuManager from "../modules/LelayuManager";
import { useAdminAuth } from "../layout";

export default function LelayuPage() {
  const { canDo } = useAdminAuth();
  return <LelayuManager canDo={canDo} />;
}
