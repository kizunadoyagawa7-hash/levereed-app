"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { hasHearingCompleted } from "@/lib/auth";

const ACTION_ORANGE = "#FF7A2F";
const NAVY = "#1a1f36";
const NAVY_LIGHT = "#2a3255";

export type ShortLPFeatureId = "ai-approach" | "ai-acquisition" | "referral";

/** AIスマート・アプローチ専用：パートナー用文言に基づく詳細メリット */
function ShortLPAIApproachContent() {
  return (
    <>
      <p className="text-sm font-medium text-action-orange">24時間・最適タイミングでメッセージ代行</p>
      <p className="mt-4 leading-relaxed text-white/90">
        SNS投稿から返信・提案まで、AIがあなたの代わりに24時間対応。機会損失をゼロにし、成約までフォローします。
      </p>
      <ul className="mt-4 space-y-2 text-sm text-white/80">
        <li>・おすすめマッチングの依頼・成約フォローまで一気通貫</li>
        <li>・営業工数ほぼゼロで事業者同士のマッチングを実現</li>
      </ul>
    </>
  );
}

/** AI自動集客専用：パートナー用文言に基づく詳細メリット */
function ShortLPAIAcquisitionContent() {
  return (
    <>
      <p className="text-sm font-medium text-action-orange">見込み客が自動で積み上がる</p>
      <p className="mt-4 leading-relaxed text-white/90">
        5,000アポの失敗から生まれた、無駄なZoomをゼロにする自動集客ロジック。あなたの代わりにAIが24時間働き、質の高い見込み客だけを連れてきます。
      </p>
      <ul className="mt-4 space-y-2 text-sm text-white/80">
        <li>・8年の集客知見をAIが再現</li>
        <li>・プログラム詳細・ロードマップへフルアクセス</li>
      </ul>
    </>
  );
}

/** リファーラルマッチ専用：パートナー用文言に基づく詳細メリット */
function ShortLPReferralContent() {
  return (
    <>
      <p className="text-sm font-medium text-action-orange">成約確度の高いマッチングへ優先招待</p>
      <p className="mt-4 leading-relaxed text-white/90">
        AIが「紹介し合える」最適なパートナーを特定。信頼で繋がるリファーラルの連鎖で、営業ゼロの集客を実現。
      </p>
      <ul className="mt-4 space-y-2 text-sm text-white/80">
        <li>・経営者・フリーランスが集まる限定マッチングイベントへ優先招待</li>
        <li>・マッチング予約・コミュニティ枠を確保</li>
      </ul>
    </>
  );
}

const SHORT_LP_TITLES: Record<ShortLPFeatureId, string> = {
  "ai-approach": "AIスマート・アプローチ",
  "ai-acquisition": "AI自動集客システム",
  referral: "リファーラルマッチ優先枠",
};

type Props = {
  open: boolean;
  onClose: () => void;
  featureId: ShortLPFeatureId;
};

/**
 * カードごとに独立したショートLP（ドロワー）。
 * featureId に応じて異なる専用コンテンツを表示し、CTAはヒアリング完了済みなら /business へ。
 */
export default function UpgradeShortLP({ open, onClose, featureId }: Props) {
  const title = SHORT_LP_TITLES[featureId];
  const [entered, setEntered] = useState(false);
  const hearingDone = typeof window !== "undefined" && hasHearingCompleted();
  const ctaHref = hearingDone ? "/business" : "/dashboard/setup";
  const ctaLabel = hearingDone ? "ビジネスダッシュボードで確認する" : "パートナープランへアップグレードして解放する";

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setEntered(true), 50);
      return () => clearTimeout(t);
    } else {
      setEntered(false);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      const onEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", onEscape);
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", onEscape);
        document.body.style.overflow = "";
      };
    }
  }, [open, onClose]);

  if (!open || !title) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 transition-opacity duration-300"
        style={{ backdropFilter: "blur(2px)" }}
        aria-hidden
        onClick={onClose}
      />
      <div
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md overflow-y-auto shadow-2xl transition-transform duration-300 ease-out"
        style={{
          backgroundColor: NAVY,
          transform: entered ? "translateX(0)" : "translateX(100%)",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.4)",
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortlp-title"
      >
        <div
          className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 px-4 py-3"
          style={{ backgroundColor: `${NAVY_LIGHT}ee` }}
        >
          <h2 id="shortlp-title" className="font-semibold text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white transition"
            aria-label="閉じる"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-8">
          {featureId === "ai-approach" && <ShortLPAIApproachContent />}
          {featureId === "ai-acquisition" && <ShortLPAIAcquisitionContent />}
          {featureId === "referral" && <ShortLPReferralContent />}
          <div
            className="mt-10 rounded-2xl border-2 p-6 text-center"
            style={{ borderColor: `${ACTION_ORANGE}99`, backgroundColor: `${ACTION_ORANGE}18` }}
          >
            <p className="text-sm font-medium text-white/90">
              {hearingDone ? "すでに解放済みです" : "20項目のヒアリングと誓約完了で、今すぐ解放"}
            </p>
            <Link
              href={ctaHref}
              onClick={onClose}
              className="mt-4 inline-block w-full max-w-xs rounded-xl px-6 py-4 text-center text-base font-bold text-white shadow-lg ring-2 ring-white/40 transition hover:opacity-95"
              style={{ backgroundColor: ACTION_ORANGE, boxShadow: `0 4px 20px ${ACTION_ORANGE}99` }}
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
