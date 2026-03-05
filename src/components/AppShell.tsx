"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearStoredUserEmail, getStoredUserEmail, isPartnerUser, debugLogUserRole } from "@/lib/auth";
import OpeningSequence from "@/components/OpeningSequence";

const SHOW_OPENING_KEY = "levereed_show_opening";

type AppMode = "life" | "business";

function CoinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
  );
}

function HeaderRight({ hideBusinessUI }: { hideBusinessUI?: boolean }) {
  const router = useRouter();
  const [partner, setPartner] = useState(false);
  useEffect(() => setPartner(isPartnerUser()), []);
  const handleLogout = () => {
    clearStoredUserEmail();
    router.push("/login");
  };
  return (
    <div className="flex flex-row items-center justify-end gap-2 sm:gap-4">
      {!hideBusinessUI && (
        <span className="hidden text-xs font-medium text-white/80 whitespace-nowrap sm:inline">
          {partner ? "パートナー" : "ビジネス"}
        </span>
      )}
      <Link
        href="/dashboard/points"
        className="inline-flex flex-shrink-0 items-center gap-1.5 text-sm text-white/90 hover:text-white transition-colors"
        title="ポイント通帳"
      >
        <CoinIcon className="h-5 w-5 flex-shrink-0 sm:h-4 sm:w-4" />
        <span className="hidden whitespace-nowrap sm:inline">ポイント通帳</span>
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex flex-shrink-0 items-center gap-1.5 text-sm text-white/90 hover:text-white transition-colors"
        title="ログアウト"
      >
        <LogoutIcon className="h-5 w-5 flex-shrink-0 sm:h-4 sm:w-4" />
        <span className="hidden whitespace-nowrap sm:inline">ログアウト</span>
      </button>
      <button
        type="button"
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white shadow-sm hover:bg-white/20 transition-colors"
        aria-label="ユーザーメニュー"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      </button>
    </div>
  );
}

/** ロイヤルブルー・オレンジの共通ヘッダー。ビジネスユーザーはダッシュボードを /business に固定 */
export default function AppShell({
  current,
  children,
  previewMode = false,
}: {
  current: AppMode;
  children: React.ReactNode;
  /** ライフプレビューモード時はビジネス専用メニューを完全に非表示 */
  previewMode?: boolean;
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [partner, setPartner] = useState(false);
  const [openingState, setOpeningState] = useState<"checking" | "show" | "hide">("checking");

  const dashboardHref = previewMode ? "/life" : partner ? "/business" : "/life";
  const hideBusinessUI = current === "life" && previewMode;

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!mounted) return;
    if (!getStoredUserEmail()) {
      router.replace("/login");
    } else {
      setPartner(isPartnerUser());
      debugLogUserRole();
      setOpeningState(
        typeof window !== "undefined" && sessionStorage.getItem(SHOW_OPENING_KEY) === "1"
          ? "show"
          : "hide"
      );
    }
  }, [mounted, router]);

  const handleOpeningComplete = () => {
    if (typeof window !== "undefined") sessionStorage.removeItem(SHOW_OPENING_KEY);
    setOpeningState("hide");
  };

  if (!mounted || !getStoredUserEmail()) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#F0F2F5" }}>
        <p className="text-slate-500">確認中...</p>
      </div>
    );
  }
  if (openingState === "checking") {
    return <div className="min-h-screen bg-white" aria-hidden />;
  }

  const isBusiness = current === "business";
  const content = (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: isBusiness ? "rgba(26, 31, 54, 0.98)" : "#F0F2F5",
      }}
    >
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-[#2B5FD9] text-white shadow-lg">
        <div className="mx-auto flex min-h-14 max-w-5xl items-center justify-between gap-2 px-3 py-2 sm:gap-4 sm:px-4">
          <div className="w-16 flex-shrink-0 sm:w-24">
            <Link href={dashboardHref} className="font-semibold text-white hover:opacity-90">
              レバリード
            </Link>
          </div>

          {!hideBusinessUI && (
            <div className="flex min-w-0 flex-1 justify-center">
              <div
                className="flex rounded-full border border-white/30 bg-white/10 p-1 shadow-sm"
                role="tablist"
                aria-label="モード切り替え"
              >
                <span
                  role="tab"
                  aria-selected={false}
                  className="rounded-full px-5 py-2 text-sm font-medium text-white/50 cursor-not-allowed"
                  title="ライフ版は別途リリース予定のため、現在はリンクしません"
                >
                  ライフ（近日公開）
                </span>
                <Link
                  href="/business"
                  role="tab"
                  aria-selected={current === "business"}
                  className={`relative rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ease-out ${
                    current === "business" ? "bg-white text-[#2B5FD9] shadow-md" : "text-white/90 hover:bg-white/20"
                  }`}
                >
                  ビジネス
                </Link>
              </div>
            </div>
          )}

          <div className="flex min-w-0 flex-shrink-0 items-center justify-end overflow-visible">
            <HeaderRight hideBusinessUI={hideBusinessUI} />
          </div>
        </div>
      </header>

      <main className="relative">{children}</main>
    </div>
  );

  if (openingState === "show") {
    return <OpeningSequence onComplete={handleOpeningComplete}>{content}</OpeningSequence>;
  }
  return content;
}
