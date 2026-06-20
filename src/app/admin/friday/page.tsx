"use client";
import FridayManager from "../modules/FridayManager";
import { useAdminAuth } from "../layout";

export default function FridayPage() {
  const { canDo } = useAdminAuth();
  return <FridayManager canDo={canDo} />;
}
