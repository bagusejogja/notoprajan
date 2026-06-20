"use client";
import SettingsManager from "../modules/SettingsManager";
import { useAdminAuth } from "../layout";

export default function SettingsPage() {
  const { canDo } = useAdminAuth();
  return <SettingsManager canDo={canDo} />;
}
