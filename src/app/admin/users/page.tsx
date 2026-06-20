"use client";
import UserManager from "../modules/UserManager";
import { useAdminAuth } from "../layout";

export default function UsersPage() {
  const { canDo, rolePermissions } = useAdminAuth();
  return <UserManager canDo={canDo} rolePermissions={rolePermissions} />;
}
