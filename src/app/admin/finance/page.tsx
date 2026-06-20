"use client";
import FinanceManager from "../modules/FinanceManager";
import { useAdminAuth } from "../layout";

export default function FinancePage() {
  const { canDo } = useAdminAuth();
  return <FinanceManager canDo={canDo} />;
}
