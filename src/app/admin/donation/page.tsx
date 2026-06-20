"use client";
import DonationManager from "../modules/DonationManager";
import { useAdminAuth } from "../layout";

export default function DonationPage() {
  const { canDo } = useAdminAuth();
  return <DonationManager canDo={canDo} />;
}
