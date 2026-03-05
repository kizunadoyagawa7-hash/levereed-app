"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getStoredUserRole, JUST_UPGRADED_KEY } from "@/lib/auth";
import { computeMatchScore, generateMatchReason, emptyProfile, type BusinessProfile } from "@/lib/matching";
import { DEMO_PARTNERS } from "@/lib/demo-partners";
import {
  getPendingRequestToIds,
  getIncomingRequests,
  sendMatchRequest,
  seedIncomingRequestIfEmpty,
} from "@/lib/match-requests";
import {
  calculateTotalPoints,
  POINTS_EVENTS_STORAGE_KEY,
  BADGE_STORAGE_KEY,
  BADGE_TIERS,
  type PointEvent,
} from "@/lib/points";
import ReferralUrlSection from "@/components/ReferralUrlSection";

const STORAGE_KEY = "levereed_business_profile";
const TYPING_LINES = [
  "SNS投稿を自動作成中…",
  "メッセージ返信を代行しています",
  "24時間稼働・成約までフォロー",
];

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

function getStoredProfile(): BusinessProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BusinessProfile;
  } catch {
    return null;
  }
}

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-royal-blue px-4 py-2 text-sm font-medium text-white shadow-royal-blue">
      {message}
    </div>
  );
}

/**
 * パートナー会員専用UI。ビジネス会員用の要素は一切含まない。
 * ぼかしなし・実機能への直リンクのみ。
 */
export default function BusinessContentForPartner() {
  const [requestedToIds, setRequestedToIds] = useState<string[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<ReturnType<typeof getIncomingRequests>>([]);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [badgeId, setBadgeId] = useState<string | null>(null);
  const [revealDone, setRevealDone] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(JUST_UPGRADED_KEY) === "1") {
      window.localStorage.removeItem(JUST_UPGRADED_KEY);
      setRevealDone(false);
      const t = setTimeout(() => setRevealDone(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    setProfile(getStoredProfile());
    setTotalPoints(calculateTotalPoints(getStoredPointsEvents()));
    setBadgeId(getStoredBadge());
    setRequestedToIds(getPendingRequestToIds());
    setIncomingRequests(getIncomingRequests());
    seedIncomingRequestIfEmpty({
      fromId: "2",
      fromName: "山田 コンサル",
      toName: "自分",
      fromProfile: DEMO_PARTNERS[1].profile,
      reason: "お互いのスキルが補完関係にあり、ニーズと提供が一致しています。ターゲット層の業種が近く、紹介しやすい関係です。",
    });
  }, []);

  const myProfile = profile ?? emptyProfile();
  const candidates = useMemo(() => {
    return DEMO_PARTNERS.slice(0, 3).map((p) => {
      const score = computeMatchScore(myProfile, p.profile);
      return { id: p.id, name: p.name, role: p.role ?? "パートナー", score };
    });
  }, [myProfile]);

  const refreshRequests = useCallback(() => {
    setRequestedToIds(getPendingRequestToIds());
    setIncomingRequests(getIncomingRequests());
  }, []);

  const handleMatchRequest = (candidateId: string) => {
    const partner = DEMO_PARTNERS.find((p) => p.id === candidateId);
    if (!partner) return;
    const score = computeMatchScore(myProfile, partner.profile);
    const reason = generateMatchReason(myProfile, partner.profile, score);
    sendMatchRequest({
      toId: partner.id,
      toName: partner.name,
      fromName: "自分",
      fromProfile: myProfile,
      reason,
    });
    setToast("依頼を送信しました。相手のお知らせに表示されます。");
    refreshRequests();
  };

  const partnerSixItems = [
    { label: "AIマッチング自動化", desc: "20項目の深いデータから、相性抜群のパートナーをAIが毎日提案。", reason: "20項目の回答から、ターゲット層・提供価値が一致。", href: "/dashboard/partners" },
    { label: "SNS・営業代行", desc: "AIがターゲットへ自動アプローチ。返信や提案の手間をすべて肩代わり。", reason: "営業スタイル・フォロー頻度がプロフィールと合致。", href: "/dashboard/partners" },
    { label: "集客ロードマップ", desc: "ターゲット選定から成約まで。最短で結果を出す戦略をAIと共に構築。", reason: "集客フェーズ・課題が20項目で可視化。", href: "/dashboard/business/program" },
    { label: "スキル・案件シェア", desc: "専門家と直結。コミュニティ内でリソースを補完し合い、事業を加速。", reason: "リソース・強みが20項目でマッチ。", href: "/dashboard/partners" },
    { label: "リファーラルイベント", desc: "質の高い経営者が集う紹介制マッチング。営業不要の紹介網を構築。", reason: "紹介で繋がりたい層・ビジョンが一致。", href: "/dashboard/business/referral" },
    { label: "ビジネスコスト最適化", desc: "通信・決済・運営費をAIが診断。浮いたコストを次の投資へ。", reason: "コスト構造・規模がプロフィールと合致。", href: "/dashboard/partners" },
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
      {toast !== null && <Toast message={toast} onDone={() => setToast(null)} />}

      {!revealDone && (
        <div
          className="fixed inset-0 z-[60] transition-all duration-500"
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            backgroundColor: "rgba(15, 20, 42, 0.5)",
            opacity: revealDone ? 0 : 1,
          }}
          aria-hidden
        />
      )}

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
          <button
            type="button"
            disabled
            className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white/50 cursor-not-allowed opacity-60"
            title="ライフ版は別途リリース予定のため、現在は無効です"
          >
            ライフプレビュー（近日公開）
          </button>
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
            href="/dashboard/partners"
            className="rounded-lg bg-action-orange px-4 py-2 text-sm font-medium text-white shadow-[0_0_20px_rgba(255,122,47,0.35)] transition hover:opacity-90"
          >
            AIマッチング
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
        <ReferralUrlSection isPartner={true} />
      </div>

      {incomingRequests.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-medium uppercase tracking-wider text-white/70 mb-3">お知らせ</h2>
          <ul className="space-y-3">
            {incomingRequests.map((req) => (
              <li key={req.id} className="rounded-xl border border-white/20 bg-white/5 p-4">
                <p className="text-sm text-white/90">{req.fromName} さんからマッチング依頼が届きました</p>
                <Link
                  href={`/dashboard/business/match-request/${req.id}`}
                  className="mt-2 inline-block rounded-lg bg-royal-blue px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  詳細を見る
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-10">
        <h2 className="text-sm font-medium uppercase tracking-wider text-white/70 mb-4">パートナー限定機能</h2>
        <div className="mt-6">
          <p className="mb-3 text-xs font-medium text-white/70">おすすめマッチング</p>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {candidates.map((c) => {
              const requested = requestedToIds.includes(c.id);
              return (
                <div key={c.id} className="min-h-[320px] w-[300px] flex-shrink-0 rounded-xl border border-white/20 bg-white/5 p-5 shadow-xl">
                  <h3 className="text-lg font-semibold text-white">AIスマート・アプローチ</h3>
                  <div className="mt-3 min-w-[140px] rounded-lg border border-white/20 bg-white/5 p-2">
                    <span className="text-[10px] text-royal-blue">{c.role}</span>
                    <span className="ml-1 text-xs font-bold text-white">相性{c.score}%</span>
                    <Link href={`/dashboard/business/partner/${c.id}`} className="mt-1 block truncate text-xs text-white/90 hover:underline">
                      {c.name}
                    </Link>
                    {requested ? (
                      <span className="mt-1 block w-full rounded bg-white/20 px-2 py-1 text-center text-[10px] font-medium text-white/80">
                        依頼済み（返答待ち）
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleMatchRequest(c.id)}
                        className="mt-1 w-full rounded bg-action-orange px-2 py-1 text-[10px] font-medium text-white"
                      >
                        依頼
                      </button>
                    )}
                  </div>
                  <Link href="/dashboard/partners" className="mt-4 inline-block rounded-lg border border-action-orange/50 px-4 py-2.5 text-sm font-medium text-action-orange">
                    マッチング一覧へ
                  </Link>
                </div>
              );
            })}
            <div className="min-h-[320px] w-[300px] flex-shrink-0 rounded-xl border border-white/20 bg-white/5 p-5 shadow-xl">
              <h3 className="text-lg font-semibold text-white">AI自動集客システム</h3>
              <p className="mt-3 text-sm text-white/90 leading-relaxed">8年の集客知見をAIが再現。</p>
              <Link href="/dashboard/business/program" className="mt-4 inline-block rounded-lg border border-action-orange/50 px-4 py-2.5 text-sm font-medium text-action-orange">
                プログラム詳細へ
              </Link>
            </div>
            <div className="min-h-[320px] w-[300px] flex-shrink-0 rounded-xl border border-white/20 bg-white/5 p-5 shadow-xl">
              <h3 className="text-lg font-semibold text-white">リファーラルマッチ優先枠</h3>
              <p className="mt-3 text-sm text-white/90 leading-relaxed">AIが「紹介し合える」相手を特定。</p>
              <Link href="/dashboard/business/referral" className="mt-4 inline-block rounded-lg border border-action-orange/50 px-4 py-2.5 text-sm font-medium text-action-orange">
                マッチング予約へ
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-medium uppercase tracking-wider text-white/70 mb-4">ビジネス成功のための6項目</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {partnerSixItems.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-xl border border-white/20 bg-white/5 p-4 transition hover:bg-white/10 hover:border-royal-blue/30"
            >
              <h3 className="font-semibold text-white">{item.label}</h3>
              <p className="text-sm text-white/70 leading-relaxed">{item.desc}</p>
              <p className="rounded-lg bg-royal-blue/15 px-3 py-2 text-xs text-white/90 border border-royal-blue/20">{item.reason}</p>
              <Link
                href={item.href}
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
