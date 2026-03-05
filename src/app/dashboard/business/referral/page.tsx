"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isPartnerUser } from "@/lib/auth";

/** デモ：開催予定イベント */
const UPCOMING_EVENTS = [
  { id: "1", date: "2025/03/15", name: "春のビジネスマッチング会", participants: 24, capacity: 30 },
  { id: "2", date: "2025/04/10", name: "リファーラルマッチ・特別枠", participants: 8, capacity: 15 },
];

/** デモ：注目のマッチング案件 */
const FEATURED_CASES = [
  { id: "1", title: "Web制作 × マーケティング", score: 92, tags: ["LP制作", "SNS"] },
  { id: "2", title: "コンサル × 営業代行", score: 88, tags: ["BtoB", "紹介"] },
  { id: "3", title: "デザイン × ライティング", score: 85, tags: ["ブランディング", "コンテンツ"] },
];

/**
 * マッチング予約：リファーラルマッチの予約・開催情報
 * パートナー限定カード3「マッチング予約へ」の固有ページ
 */
export default function ReferralMatchPage() {
  const [dashboardHref, setDashboardHref] = useState("/life");

  useEffect(() => {
    setDashboardHref(isPartnerUser() ? "/business" : "/life");
  }, []);

  return (
    <div className="min-h-screen bg-levereed-navy">
      <div
        className="fixed inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 100% 60% at 50% 0%, rgba(43, 95, 217, 0.15), transparent 50%)",
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
          <span className="font-semibold text-levereed-neon-blue">マッチング予約</span>
          <span className="w-24" />
        </div>
      </header>

      <main className="relative mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-xl font-semibold text-white">
          リファーラルマッチ（コミュニティ・案件）
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          次回の開催情報と注目のマッチング案件。パートナー会員は優先マッチング枠を確保できます。
        </p>
        <div className="mt-4 rounded-lg bg-[#FF7A2F]/20 px-4 py-2 text-sm font-bold text-[#FF7A2F]">
          パートナー会員は優先マッチング枠を確保
        </div>

        <section className="mt-8">
          <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-4">
            開催予定
          </h2>
          <ul className="space-y-4">
            {UPCOMING_EVENTS.map((ev) => (
              <li
                key={ev.id}
                className="rounded-xl border border-levereed-navy-lighter bg-levereed-navy-light/60 p-4"
              >
                <p className="text-xs text-gray-500">{ev.date}</p>
                <p className="font-semibold text-white">{ev.name}</p>
                <p className="mt-1 text-sm text-gray-400">
                  参加予定 <span className="font-bold text-[#FF7A2F]">{ev.participants}名</span> / 定員{ev.capacity}名
                </p>
                <button
                  type="button"
                  className="mt-3 rounded-lg bg-[#FF7A2F] px-4 py-2 text-sm font-medium text-white"
                >
                  この回を予約する
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-4">
            注目のマッチング案件
          </h2>
          <ul className="space-y-3">
            {FEATURED_CASES.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-xl border border-levereed-navy-lighter bg-levereed-navy-light/60 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-white">{c.title}</p>
                  <p className="text-xs text-gray-500">{c.tags.join(" × ")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-levereed-neon-blue">相性{c.score}%</span>
                  <Link
                    href="/dashboard/partners"
                    className="rounded-lg border border-[#FF7A2F]/50 px-3 py-1.5 text-xs font-medium text-[#FF7A2F]"
                  >
                    詳細
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10 flex gap-3">
          <Link
            href={dashboardHref}
            className="rounded-lg border border-levereed-navy-lighter px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            ダッシュボードへ戻る
          </Link>
          <Link
            href="/dashboard/partners"
            className="rounded-lg bg-[#FF7A2F] px-4 py-2 text-sm font-medium text-white"
          >
            AIマッチング一覧
          </Link>
        </div>
      </main>
    </div>
  );
}
