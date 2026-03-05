"use client";

import Link from "next/link";

const ACTION_ORANGE = "#FF7A2F";

/**
 * リファーラルマッチ優先参加権利 専用LP
 * カード3「詳細を見て機能を解放する」から遷移。戻るは /business。
 */
export default function ReferralMatchLP() {
  return (
    <div className="min-h-screen bg-[#0f142a] text-white">
      <div
        className="fixed inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage: `linear-gradient(rgba(43,95,217,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(43,95,217,0.08) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <header className="relative border-b border-white/10 bg-[#0f142a]/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link href="/business" className="text-sm text-white/70 hover:text-white transition-colors">
            ← ビジネスダッシュボードへ戻る
          </Link>
          <span className="font-semibold text-white">レバリード</span>
          <span className="w-40" />
        </div>
      </header>
      <main className="relative mx-auto max-w-2xl px-4 py-10">
        <nav className="mb-8 text-sm text-white/60" aria-label="パンくず">
          <Link href="/business" className="hover:text-white transition-colors">ビジネスダッシュボード</Link>
          <span className="mx-2">/</span>
          <span className="text-white/90">リファーラルマッチ優先参加権利</span>
        </nav>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">リファーラルマッチ優先参加権利</h1>
        <p className="mt-4 text-white/90 leading-relaxed">
          AIが『紹介し合える』最適なパートナーを特定。信頼で繋がるリファーラル（紹介）の連鎖で、営業ゼロの集客を実現。経営者・フリーランスが集まる限定マッチングイベントへ、パートナー会員は優先招待されます。
        </p>
        <div className="mt-10 rounded-2xl border-2 p-6 text-center" style={{ borderColor: `${ACTION_ORANGE}99`, backgroundColor: `${ACTION_ORANGE}15` }}>
          <p className="text-sm font-medium text-white/90">パートナー会員は優先枠を確保</p>
          <Link
            href="/business"
            className="mt-4 inline-block w-full max-w-xs rounded-xl px-6 py-4 text-center text-base font-bold text-white transition hover:opacity-90"
            style={{ backgroundColor: ACTION_ORANGE, boxShadow: `0 0 24px ${ACTION_ORANGE}66` }}
          >
            パートナー会員へアップグレードする
          </Link>
        </div>
        <div className="mt-8 flex justify-center">
          <Link href="/business" className="text-sm text-white/60 hover:text-white transition-colors">ダッシュボードへ戻る</Link>
        </div>
      </main>
    </div>
  );
}
