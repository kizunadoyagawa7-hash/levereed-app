"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getStoredUserEmail, canAccessBusiness } from "@/lib/auth";

/**
 * /dashboard はログイン後の role に応じて /life または /business へリダイレクト。
 * ビジネス会員（partner / business）は /business、それ以外は /life。
 */
export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const email = getStoredUserEmail();
    if (!email) {
      router.replace("/login");
      return;
    }
    if (canAccessBusiness()) {
      router.replace("/business");
    } else {
      router.replace("/life");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#F0F2F5" }}>
      <p className="text-slate-500">リダイレクト中...</p>
    </div>
  );
}
