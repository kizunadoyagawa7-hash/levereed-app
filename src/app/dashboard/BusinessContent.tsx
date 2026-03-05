"use client";

import { useEffect, useState } from "react";
import { getStoredUserRole } from "@/lib/auth";
import BusinessContentForBusiness from "@/app/dashboard/BusinessContentForBusiness";
import BusinessContentForPartner from "@/app/dashboard/BusinessContentForPartner";

/**
 * 権限による表示の完全分離。
 * ページ内の場当たり的な if (role) 分岐は行わず、
 * パートナー用とビジネス用のコンポーネントを物理的に切り替えるのみ。
 */
export default function BusinessContent() {
  const [role, setRole] = useState<"partner" | "business" | "life">("life");

  useEffect(() => {
    setRole(getStoredUserRole());
  }, []);

  if (role === "partner") {
    return <BusinessContentForPartner />;
  }
  return <BusinessContentForBusiness />;
}
