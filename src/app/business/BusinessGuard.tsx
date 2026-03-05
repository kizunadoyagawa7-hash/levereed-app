"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { canAccessBusiness } from "@/lib/auth";

/**
 * ビジネスエリアへのアクセス制御。
 * サーバー（middleware）に加え、クライアントでも二重にガードし、
 * ログイン直後・戻るボタン時にも一瞬で違う権限の画面が出ないようにする。
 */
export default function BusinessGuard({ children }: { children: React.ReactNode }) {
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
