"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { getStoredUserEmail } from "@/lib/auth";
import { POINTS_INVITE_SUCCESS_LIFE, POINTS_INVITE_SUCCESS_BUSINESS } from "@/lib/points";

/** 数ヶ月後の公開時に true にするとライフ会員招待リンクが有効になる */
const LIFETIME_INVITE_PUBLIC = false;

function getRefId(): string {
  if (typeof window === "undefined") return "";
  const email = getStoredUserEmail();
  if (!email) return "";
  try {
    return btoa(email).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch {
    return "";
  }
}

function buildUrls(): { general: string; business: string } {
  if (typeof window === "undefined") return { general: "", business: "" };
  const origin = window.location.origin;
  const refId = getRefId();
  const base = `${origin}/login?ref=${encodeURIComponent(refId)}`;
  return {
    general: base,
    business: `${base}&type=business`,
  };
}

export default function ReferralUrlSection({ isPartner }: { isPartner: boolean }) {
  const [copied, setCopied] = useState<"general" | "business" | null>(null);
  const [showPartnerUpsell, setShowPartnerUpsell] = useState(false);

  const urls = typeof window !== "undefined" ? buildUrls() : { general: "", business: "" };

  const copyToClipboard = useCallback(
    (url: string, type: "general" | "business") => {
      if (typeof navigator?.clipboard === "undefined") return;
      navigator.clipboard.writeText(url).then(() => {
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
      });
      if (!isPartner) {
        setShowPartnerUpsell(true);
      }
    },
    [isPartner]
  );

  return (
    <section className="rounded-xl border border-white/20 bg-white/5 p-5">
      <h3 className="text-lg font-semibold text-white mb-2">集客用リンク</h3>
      <p className="text-sm text-white/70 mb-4">
        ビジネス会員招待で<strong className="text-royal-blue">{POINTS_INVITE_SUCCESS_BUSINESS.toLocaleString()}P</strong>、ライフ会員招待で<strong className="text-royal-blue">{POINTS_INVITE_SUCCESS_LIFE.toLocaleString()}P</strong>が自動付与されます。
      </p>

      <div className="space-y-3">
        {/* ビジネス会員招待リンク: 通常表示・コピー有効 */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-white/80 w-32 shrink-0">ビジネス会員招待</span>
          <code className="flex-1 min-w-0 truncate rounded bg-black/30 px-2 py-1.5 text-xs text-gray-300">
            {urls.business || "—"}
          </code>
          <button
            type="button"
            onClick={() => urls.business && copyToClipboard(urls.business, "business")}
            className="shrink-0 rounded-lg bg-royal-blue px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
          >
            {copied === "business" ? "コピー済み" : "コピー"}
          </button>
        </div>

        {/* ライフ会員招待リンク: 近日公開・薄く・無効化（ロジックは保持） */}
        <div
          className="flex flex-wrap items-center gap-2 opacity-50 pointer-events-none select-none"
          aria-disabled="true"
        >
          <span className="text-sm text-white/80 w-32 shrink-0">ライフ会員招待</span>
          <code className="flex-1 min-w-0 truncate rounded bg-black/30 px-2 py-1.5 text-xs text-gray-500">
            {LIFETIME_INVITE_PUBLIC ? urls.general : "—"}
          </code>
          <span className="shrink-0 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-medium text-white/80">
            近日公開
          </span>
        </div>
        {!LIFETIME_INVITE_PUBLIC && (
          <p className="text-xs text-gray-500">ライフ会員招待リンクは準備が整い次第、公開します。</p>
        )}
      </div>

      {showPartnerUpsell && !isPartner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          role="dialog"
          aria-modal="true"
          aria-labelledby="partner-upsell-title"
        >
          <div className="rounded-2xl border border-white/20 bg-levereed-navy-light p-6 max-w-sm shadow-xl">
            <h2 id="partner-upsell-title" className="text-lg font-semibold text-white mb-2">
              パートナーへ昇格して招待報酬を受け取りませんか？
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              パートナー会員になると、紹介した方の登録完了時に招待報酬（ライフ1,000P・ビジネス2,000P）が自動付与されます。
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowPartnerUpsell(false)}
                className="flex-1 rounded-lg border border-white/30 px-4 py-2 text-sm text-white/90"
              >
                閉じる
              </button>
              <Link
                href="/upgrade/partner"
                className="flex-1 rounded-lg bg-action-orange px-4 py-2 text-sm font-medium text-white text-center hover:opacity-90"
              >
                パートナーへ昇格
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
