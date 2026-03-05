"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isPartnerUser, getStoredUserRole } from "@/lib/auth";
import {
  calculateTotalPoints,
  pointsToYen,
  createPointEvent,
  type PointEvent,
  POINTS_EVENTS_STORAGE_KEY,
  BADGE_TIERS,
  BADGE_STORAGE_KEY,
  AD_RESERVATION_BASE_COST,
  LABEL_BY_TYPE,
  POINTS_LEGAL_DISCLAIMER,
  POINTS_LEGAL_ONE_LINER,
  getAdDisplayDaysForBadge,
  getAdBenefitLabelForBadge,
  getAdUpsellMessageForBadge,
} from "@/lib/points";

function getStoredEvents(): PointEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(POINTS_EVENTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PointEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setStoredEvents(list: PointEvent[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(POINTS_EVENTS_STORAGE_KEY, JSON.stringify(list));
}

function HistoryRow({ event, isPartnerUpgrade }: { event: PointEvent; isPartnerUpgrade: boolean }) {
  const isNegative = event.points < 0;
  const displayLabel = event.type === "ad_reservation" && event.meta?.displayDays
    ? `${event.label}（${event.meta.displayDays}日間）`
    : event.label;
  return (
    <li
      className={
        isPartnerUpgrade
          ? "rounded-xl border-2 border-amber-400/80 bg-amber-500/10 px-4 py-3 shadow-[0_0_20px_rgba(251,191,36,0.2)]"
          : "rounded-xl border border-levereed-navy-lighter bg-levereed-navy-light/60 px-4 py-3"
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-500 tabular-nums">{event.date}</span>
          <span className="text-white">{displayLabel}</span>
          {isPartnerUpgrade && (
            <span className="inline-flex w-fit rounded-full bg-amber-400/20 px-2 py-0.5 text-xs font-medium text-amber-400">
              特別
            </span>
          )}
        </div>
        <span
          className={
            isPartnerUpgrade
              ? "font-bold tabular-nums text-amber-400"
              : isNegative
                ? "font-semibold tabular-nums text-orange-400"
                : "font-semibold tabular-nums text-levereed-neon-blue"
          }
        >
          {isNegative ? "" : "+"}
          {event.points}P
        </span>
      </div>
    </li>
  );
}

export default function PointsLedgerPage() {
  const [events, setEvents] = useState<PointEvent[]>([]);
  const [dashboardHref, setDashboardHref] = useState("/life");
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  useEffect(() => {
    setEvents(getStoredEvents());
    setDashboardHref(getStoredUserRole() === "life" ? "/life" : "/business");
    if (typeof window !== "undefined") {
      setSelectedBadge(window.localStorage.getItem(BADGE_STORAGE_KEY));
    }
  }, []);

  const totalPoints = calculateTotalPoints(events);
  const yenEquivalent = pointsToYen(totalPoints);
  const currentBadgeId = selectedBadge || "bronze";
  const displayDays = getAdDisplayDaysForBadge(currentBadgeId);
  const benefitLabel = getAdBenefitLabelForBadge(currentBadgeId);
  const upsellMessage = getAdUpsellMessageForBadge(currentBadgeId);

  const addEvent = (event: PointEvent) => {
    const next = [event, ...events];
    setStoredEvents(next);
    setEvents(next);
  };

  const purchaseBadge = (tierId: string, cost: number) => {
    if (cost <= 0 || totalPoints < cost) return;
    const now = new Date();
    const date = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}`;
    const ev = createPointEvent(`badge-${tierId}-${Date.now()}`, date, "badge_purchase", -cost);
    ev.label = `${LABEL_BY_TYPE.badge_purchase}（${BADGE_TIERS.find((t) => t.id === tierId)?.label}）`;
    addEvent(ev);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(BADGE_STORAGE_KEY, tierId);
      setSelectedBadge(tierId);
    }
  };

  const reserveAd = () => {
    if (totalPoints < AD_RESERVATION_BASE_COST) return;
    const now = new Date();
    const date = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}`;
    const days = getAdDisplayDaysForBadge(currentBadgeId);
    const ev = createPointEvent(
      `ad-reservation-${Date.now()}`,
      date,
      "ad_reservation",
      -AD_RESERVATION_BASE_COST,
      { displayDays: days, badgeId: currentBadgeId }
    );
    ev.label = `${LABEL_BY_TYPE.ad_reservation}（${days}日間）`;
    addEvent(ev);
  };

  return (
    <div className="min-h-screen bg-levereed-navy">
      <div
        className="fixed inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 100% 60% at 50% 0%, rgba(0, 212, 255, 0.1), transparent 50%)",
        }}
      />

      <header className="relative border-b border-levereed-navy-lighter bg-levereed-navy-light/60 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <Link
            href={dashboardHref}
            className="text-sm text-gray-400 hover:text-levereed-neon-blue transition-colors"
          >
            ← ダッシュボード
          </Link>
          <span className="font-semibold text-levereed-neon-blue">レバリード</span>
          <Link
            href="/login"
            className="text-sm text-gray-400 hover:text-levereed-neon-blue transition-colors"
          >
            ログアウト
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-xl font-semibold text-white mb-2">ポイント通帳</h1>
        <p className="text-sm font-medium text-amber-400/95 mb-6 border-l-4 border-amber-400/50 pl-3">
          {POINTS_LEGAL_ONE_LINER}
        </p>

        {/* 法的説明（資料引用） */}
        <section className="mb-6 rounded-2xl border border-levereed-navy-lighter bg-levereed-navy-light/60 p-4">
          <p className="text-xs leading-relaxed text-gray-400">
            {POINTS_LEGAL_DISCLAIMER}
          </p>
        </section>

        {/* 保有ポイント */}
        <section className="mb-8 rounded-2xl border border-levereed-navy-lighter bg-levereed-navy-light/80 p-6 shadow-[0_0_40px_-12px_rgba(0,212,255,0.25)]">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
            保有ポイント
          </h2>
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-4xl font-bold tabular-nums text-levereed-neon-blue drop-shadow-[0_0_20px_rgba(0,212,255,0.4)]">
              {totalPoints}P
            </span>
            <span className="text-gray-500">＝</span>
            <span className="text-2xl font-semibold tabular-nums text-white">
              ¥{yenEquivalent.toLocaleString()}換算
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-400">
            1P＝1円相当。ライフ招待1,000P・ビジネス招待2,000P・プロフィール20項目完備1,000P・マッチング成立2,000P。
          </p>
        </section>

        {/* バッジ（ポイントを消費して取得） */}
        <section className="mb-8 rounded-2xl border border-levereed-navy-lighter bg-levereed-navy-light/80 p-6">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">バッジ（称号）</h2>
          <p className="text-sm text-gray-500 mb-4">
            ポイントを消費してランクを取得します。ランクに応じて広告出稿の優待が付きます。
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {BADGE_TIERS.map((tier) => {
              const cost = tier.costToUnlock;
              const isCurrent = selectedBadge === tier.id || (tier.id === "bronze" && !selectedBadge);
              const canPurchase = cost > 0 && totalPoints >= cost && !isCurrent;
              return (
                <div
                  key={tier.id}
                  className="flex flex-col rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">{tier.label}</span>
                    {cost === 0 ? (
                      <span className="text-sm text-gray-400">初期</span>
                    ) : (
                      <span className="text-sm text-gray-400">{cost.toLocaleString()}P消費</span>
                    )}
                  </div>
                  {cost === 0 ? (
                    <p className="mt-2 text-xs text-gray-500">初期ランク。上位ランクで広告優待が付与されます。</p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => purchaseBadge(tier.id, cost)}
                      disabled={!canPurchase}
                      className="mt-2 rounded-lg bg-levereed-neon-blue px-4 py-2 text-sm font-medium text-levereed-navy disabled:opacity-50"
                    >
                      {isCurrent ? "付与済み" : totalPoints < cost ? "ポイント不足" : "購入して付与"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 広告出稿メニュー（ランク別優待・アップセル） */}
        <section className="mb-8 rounded-2xl border border-levereed-navy-lighter bg-levereed-navy-light/80 p-6">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">広告出稿メニュー</h2>
          <p className="text-sm text-white mb-1">ライフ画面バナー広告</p>
          <p className="text-sm text-levereed-neon-blue font-medium mb-2">{benefitLabel}</p>
          <p className="text-sm text-gray-500 mb-4">
            {AD_RESERVATION_BASE_COST.toLocaleString()}Pで、現在のランクでは<strong className="text-white">{displayDays}日間</strong>表示されます。
          </p>
          <button
            type="button"
            onClick={reserveAd}
            disabled={totalPoints < AD_RESERVATION_BASE_COST}
            className="rounded-lg bg-action-orange px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {AD_RESERVATION_BASE_COST.toLocaleString()}Pで予約する（{displayDays}日間）
          </button>
          {upsellMessage && (
            <div className="mt-4 rounded-lg border border-amber-400/30 bg-amber-500/10 p-3">
              <p className="text-xs font-medium text-amber-400 mb-1">ランクアップで優待が増えます</p>
              <p className="text-sm text-gray-300">{upsellMessage}</p>
            </div>
          )}
        </section>

        {/* 履歴 */}
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">履歴</h2>
          {events.length === 0 ? (
            <p className="text-sm text-gray-500">まだ履歴がありません。招待・プロフィール完備・マッチング成立でポイントが加算されます。</p>
          ) : (
            <ul className="space-y-2">
              {events.map((event) => (
                <HistoryRow
                  key={event.id}
                  event={event}
                  isPartnerUpgrade={event.type === "partner_upgrade"}
                />
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
