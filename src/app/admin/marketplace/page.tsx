"use client";
import MarketplaceManager from "../modules/MarketplaceManager";
import { useAdminAuth } from "../layout";

export default function MarketplacePage() {
  const { canDo } = useAdminAuth();
  return <MarketplaceManager canDo={canDo} />;
}
