"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isPartnerUser } from "@/lib/auth";

/**
 * パートナー会員が /upgrade/* に来た場合は即 /business へリダイレクト。
 * アップグレード訴求をパートナーに一切表示しない。
 */
export default function UpgradeGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isPartnerUser()) {
      router.replace("/business");
    }
  }, [router]);

  return <>{children}</>;
}
