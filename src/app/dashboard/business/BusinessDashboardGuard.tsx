"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { canAccessBusiness } from "@/lib/auth";

/**
 * ライフ会員が /dashboard/business/* にアクセスした場合にのみ /life へリダイレクト。
 * ビジネス会員（Partner）はそのまま表示。
 */
export default function BusinessDashboardGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canAccess = canAccessBusiness();
    setAllowed(canAccess);
    if (!canAccess) {
      router.replace("/life");
    }
  }, [mounted, router]);

  if (!mounted || allowed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "rgba(26, 31, 54, 0.98)" }}>
        <p className="text-white/80">確認中...</p>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#F0F2F5" }}>
        <p className="text-slate-500">リダイレクト中...</p>
      </div>
    );
  }

  return <>{children}</>;
}
