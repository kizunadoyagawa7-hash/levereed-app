"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  calculateTotalPoints,
  POINTS_EVENTS_STORAGE_KEY,
  BADGE_STORAGE_KEY,
  BADGE_TIERS,
  type PointEvent,
} from "@/lib/points";
import ReferralUrlSection from "@/components/ReferralUrlSection";

function getStoredPointsEvents(): PointEvent[] {
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

function getStoredBadge(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(BADGE_STORAGE_KEY);
}

/**
 * ビジネス会員専用UI。パートナー用の要素は一切含まない。
 * 「詳細を見る」はすべてアップグレードLP（/upgrade/*）へ。
 */
export default function BusinessContentForBusiness() {
  const [totalPoints, setTotalPoints] = useState(0);
  const [badgeId, setBadgeId] = useState<string | null>(null);

  useEffect(() => {
    setTotalPoints(calculateTotalPoints(getStoredPointsEvents()));
    setBadgeId(getStoredBadge());
  }, []);

  const sixItems = [
    { label: "AIマッチング自動化", desc: "20項目の深いデータから、相性抜群のパートナーをAIが毎日提案。", upgradeHref: "/upgrade/partner" },
    { label: "SNS・営業代行", desc: "AIがターゲットへ自動アプローチ。返信や提案の手間をすべて肩代わり。", upgradeHref: "/upgrade/ai-automation" },
    { label: "集客ロードマップ", desc: "ターゲット選定から成約まで。最短で結果を出す戦略をAIと共に構築。", upgradeHref: "/upgrade/acquisition-support" },
    { label: "スキル・案件シェア", desc: "専門家と直結。コミュニティ内でリソースを補完し合い、事業を加速。", upgradeHref: "/upgrade/partner" },
    { label: "リファーラルイベント", desc: "質の高い経営者が集う紹介制マッチング。営業不要の紹介網を構築。", upgradeHref: "/upgrade/referral-match" },
    { label: "ビジネスコスト最適化", desc: "通信・決済・運営費をAIが診断。浮いたコストを次の投資へ。", upgradeHref: "/upgrade/partner" },
  ];

  return (
    <div
      id="content"
      className="relative mx-auto max-w-4xl px-4 py-8 business-grid-bg business-circuit-bg business-network-lines overflow-hidden"
      style={{
        backgroundColor: "rgba(15, 20, 42, 0.98)",
        backgroundImage:
          "linear-gradient(160deg, rgba(43,95,217,0.25) 0%, transparent 40%), linear-gradient(340deg, rgba(43,95,217,0.15) 0%, transparent 35%), linear-gradient(0deg, rgba(26,31,54,0.97) 0%, transparent 60%), repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(43,95,217,0.06) 31px, rgba(43,95,217,0.06) 32px), repeating-linear-gradient(90deg, transparent, transparent 31px, rgba(43,95,217,0.06) 31px, rgba(43,95,217,0.06) 32px)",
      }}
    >
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-white/20 bg-white/5 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/70">保有ポイント</span>
          <span className="text-2xl font-bold tabular-nums text-royal-blue drop-shadow-[0_0_12px_rgba(43,95,217,0.4)]">
            {totalPoints.toLocaleString()}P
          </span>
        </div>
        <div className="h-6 w-px bg-white/20" aria-hidden />
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/70">現在のバッジ</span>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
              badgeId === "platinum"
                ? "bg-purple-500/30 text-purple-200 border border-purple-400/50"
                : badgeId === "gold"
                  ? "bg-amber-500/30 text-amber-200 border border-amber-400/50"
                  : badgeId === "silver"
                    ? "bg-slate-400/30 text-slate-200 border border-slate-300/50"
                    : badgeId === "bronze"
                      ? "bg-orange-700/40 text-orange-200 border border-orange-500/50"
                      : "bg-white/10 text-white/80 border border-white/20"
            }`}
          >
            {badgeId ? BADGE_TIERS.find((t) => t.id === badgeId)?.label ?? "—" : "未取得"}
          </span>
        </div>
        <Link
          href="/dashboard/points"
          className="ml-auto rounded-lg border border-action-orange/50 px-4 py-2 text-sm font-medium text-action-orange transition hover:bg-action-orange/10"
        >
          ポイント通帳へ
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-xl font-semibold text-white">ビジネスダッシュボード</h1>
        <div className="flex flex-wrap gap-3 items-center">
          <Link
            href="/dashboard/setup"
            className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/90 transition hover:border-royal-blue hover:bg-white/10"
          >
            プロフィール設定
          </Link>
          <Link
            href="/dashboard/business/notifications"
            className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/90 transition hover:border-royal-blue hover:bg-white/10"
          >
            お知らせログ
          </Link>
          <Link
            href="/upgrade/partner"
            className="rounded-lg bg-action-orange px-4 py-2 text-sm font-medium text-white shadow-[0_0_20px_rgba(255,122,47,0.35)] transition hover:opacity-90"
          >
            パートナー機能を解放する
          </Link>
          <Link
            href="/dashboard/contents/crowdsourcing"
            className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/90 transition hover:border-royal-blue hover:bg-white/10"
          >
            限定コンテンツ
          </Link>
          <Link
            href="/dashboard/events"
            className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/90 transition hover:border-royal-blue hover:bg-white/10"
          >
            交流会
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <ReferralUrlSection isPartner={false} />
      </div>

      <section className="mb-10">
        <h2 className="text-sm font-medium uppercase tracking-wider text-white/70 mb-4">
          ビジネス機能
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative rounded-xl border border-white/20 bg-white/5 p-5 shadow-xl transition hover:bg-white/10 hover:border-royal-blue/30 overflow-hidden">
            <h3 className="text-lg font-semibold text-white">AIスマート・アプローチ</h3>
            <p className="mt-3 text-sm text-white/90 leading-relaxed">
              24時間、AIがあなたの代わりにお客様へ返信・提案。機会損失をゼロにします。
            </p>
            <Link href="/upgrade/ai-automation" className="mt-4 inline-block rounded-lg bg-action-orange px-4 py-2.5 text-sm font-medium text-white hover:opacity-90">
              詳細を見る
            </Link>
          </div>
          <div className="relative rounded-xl border border-white/20 bg-white/5 p-5 shadow-xl transition hover:bg-white/10 hover:border-royal-blue/30 overflow-hidden">
            <h3 className="text-lg font-semibold text-white">AI自動集客システム</h3>
            <p className="mt-3 text-sm text-white/90 leading-relaxed">
              8年の集客知見をAIが再現。あなたが寝ている間に、見込み客リストが自動で積み上がります。
            </p>
            <Link href="/upgrade/acquisition-support" className="mt-4 inline-block rounded-lg border border-action-orange/50 px-4 py-2.5 text-sm font-medium text-action-orange">
              詳細を見る
            </Link>
          </div>
          <div className="relative rounded-xl border border-white/20 bg-white/5 p-5 shadow-xl transition hover:bg-white/10 hover:border-royal-blue/30 sm:col-span-2 lg:col-span-1 overflow-hidden">
            <h3 className="text-lg font-semibold text-white">リファーラルマッチ優先枠</h3>
            <p className="mt-3 text-sm text-white/90 leading-relaxed">
              AIが「紹介し合える」相手を特定。信頼の連鎖で、営業ゼロの集客を実現します。
            </p>
            <Link href="/upgrade/referral-match" className="mt-4 inline-block rounded-lg border border-action-orange/50 px-4 py-2.5 text-sm font-medium text-action-orange">
              詳細を見る
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-medium uppercase tracking-wider text-white/70 mb-4">
          ビジネス成功のための6項目
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {sixItems.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-xl border border-white/20 bg-white/5 p-4 transition hover:bg-white/10 hover:border-royal-blue/30"
            >
              <h3 className="font-semibold text-white">{item.label}</h3>
              <p className="text-sm text-white/70 leading-relaxed">{item.desc}</p>
              <Link
                href={item.upgradeHref}
                className="mt-auto w-full rounded-lg bg-action-orange px-4 py-2.5 text-center text-sm font-medium text-white shadow-[0_0_20px_rgba(255,122,47,0.35)] transition hover:opacity-90"
              >
                詳細を見る
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
