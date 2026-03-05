"use client";

import Link from "next/link";

const ACTION_ORANGE = "#FF7A2F";
const ROYAL_BLUE = "#2B5FD9";

/**
 * パートナー会員アップグレード専用LP
 * ビジネスダッシュボードの「詳細を見て機能を解放する」から遷移。
 * 戻る・パンくずはビジネスユーザーを /business に戻す。
 */
export default function PartnerUpgradeLP() {
  return (
    <div className="min-h-screen bg-[#0f142a] text-white">
      <div
        className="fixed inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(rgba(43, 95, 217, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(43, 95, 217, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      />

      <header className="relative border-b border-white/10 bg-[#0f142a]/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link
            href="/business"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            ← ビジネスダッシュボードへ戻る
          </Link>
          <span className="font-semibold text-white">レバリード</span>
          <span className="w-40" />
        </div>
      </header>

      <main className="relative mx-auto max-w-2xl px-4 py-10">
        {/* パンくず：常に /business へ */}
        <nav className="mb-8 text-sm text-white/60" aria-label="パンくず">
          <Link href="/business" className="hover:text-white transition-colors">
            ビジネスダッシュボード
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white/90">パートナー会員へアップグレード</span>
        </nav>

        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          パートナー会員で、<br />
          AIの力を最大限に。
        </h1>
        <p className="mt-4 text-white/80 leading-relaxed">
          顧客獲得の自動化・リファーラルマッチ優先枠・AI自動クロージング。8年の実績に基づく戦略とツールを、あなたの代わりにAIが24時間実行します。
        </p>

        <ul className="mt-8 space-y-4">
          <li className="flex gap-3 rounded-xl border border-white/15 bg-white/5 p-4">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold text-white" style={{ backgroundColor: `${ACTION_ORANGE}99` }}>
              1
            </span>
            <div>
              <h2 className="font-semibold text-white">顧客獲得の自動化・実践プログラム</h2>
              <p className="mt-1 text-sm text-white/70">最短で顧客を獲得する戦略とツールを完全公開。AIがターゲットへ24時間アプローチ。</p>
            </div>
          </li>
          <li className="flex gap-3 rounded-xl border border-white/15 bg-white/5 p-4">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold text-white" style={{ backgroundColor: `${ACTION_ORANGE}99` }}>
              2
            </span>
            <div>
              <h2 className="font-semibold text-white">リファーラルマッチ優先招待枠</h2>
              <p className="mt-1 text-sm text-white/70">経営者・フリーランスが集まる限定イベントへ優先招待。AIが相性の良い相手を事前特定。</p>
            </div>
          </li>
          <li className="flex gap-3 rounded-xl border border-white/15 bg-white/5 p-4">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold text-white" style={{ backgroundColor: `${ACTION_ORANGE}99` }}>
              3
            </span>
            <div>
              <h2 className="font-semibold text-white">AI自動クロージング（運用）</h2>
              <p className="mt-1 text-sm text-white/70">SNS投稿・メッセージをAIが代行。24時間休まず成約までフォロー。</p>
            </div>
          </li>
        </ul>

        <div className="mt-10 rounded-2xl border-2 p-6 text-center" style={{ borderColor: `${ACTION_ORANGE}99`, backgroundColor: `${ACTION_ORANGE}15` }}>
          <p className="text-sm font-medium text-white/90">今ならパートナー登録で 300P 付与</p>
          <Link
            href="/business"
            className="mt-4 inline-block w-full max-w-xs rounded-xl px-6 py-4 text-center text-base font-bold text-white transition hover:opacity-90"
            style={{
              backgroundColor: ACTION_ORANGE,
              boxShadow: `0 0 24px ${ACTION_ORANGE}66`,
            }}
          >
            パートナー会員へアップグレードする
          </Link>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/business"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            ダッシュボードへ戻る
          </Link>
        </div>
      </main>
    </div>
  );
}
