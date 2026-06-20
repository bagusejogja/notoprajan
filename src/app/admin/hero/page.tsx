"use client";
import HeroManager from "../modules/HeroManager";
import { useAdminAuth } from "../layout";

export default function HeroPage() {
  const { canDo } = useAdminAuth();
  return <HeroManager canDo={canDo} />;
}
