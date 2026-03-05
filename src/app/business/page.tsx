"use client";

import AppShell from "@/components/AppShell";
import BusinessHero from "@/app/dashboard/BusinessHero";
import BusinessContent from "@/app/dashboard/BusinessContent";
import BusinessFooterStatus from "@/app/dashboard/BusinessFooterStatus";

/**
 * ビジネスモード専用ルート。
 * チェック・リダイレクト・モヤなしでフル画面を表示。
 */
export default function BusinessPage() {
  return (
    <AppShell current="business">
      <BusinessHero />
      <BusinessContent />
      <BusinessFooterStatus />
    </AppShell>
  );
}
