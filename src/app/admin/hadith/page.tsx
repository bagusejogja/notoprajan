"use client";
import HadithManager from "../modules/HadithManager";
import { useAdminAuth } from "../layout";

export default function HadithPage() {
  const { canDo } = useAdminAuth();
  return <HadithManager canDo={canDo} />;
}
