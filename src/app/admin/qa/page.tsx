"use client";
import QAManager from "../modules/QAManager";
import { useAdminAuth } from "../layout";

export default function QAPage() {
  const { canDo } = useAdminAuth();
  return <QAManager canDo={canDo} />;
}
