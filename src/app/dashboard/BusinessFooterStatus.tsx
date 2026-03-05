"use client";

import { useEffect, useState } from "react";

const TICKER_MESSAGES = [
  "AIがマッチング候補を分析中…",
  "今月の紹介報酬 +12,000P 獲得",
  "新規パートナー 3件 マッチング成立",
  "SNS自動投稿 今週 5件 予約済み",
  "収益レポートを更新しました",
];

/** 緩やかに増減するバー（収益・AI稼働のビジュアル） */
function AnimatedBar({ delay = 0, height = "70%" }: { delay?: number; height?: string }) {
  return (
    <div
      className="h-full w-2 rounded-full bg-white/30 overflow-hidden"
      style={{ minHeight: "24px" }}
    >
      <div
        className="h-full w-full rounded-full bg-gradient-to-t from-royal-blue to-action-orange opacity-90 business-bar-animate"
        style={{ height, animationDelay: `${delay}ms` }}
      />
    </div>
  );
}

/** 流れるティッカー */
function LiveTicker() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div className="relative w-full overflow-hidden border-t border-white/20 bg-black/20 py-2">
      <div className="business-ticker flex whitespace-nowrap text-xs font-medium text-white/95">
        {[...TICKER_MESSAGES, ...TICKER_MESSAGES].map((msg, i) => (
          <span key={i} className="mx-8 flex-shrink-0">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-action-orange animate-pulse" />
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * フッター直前の「システム稼働証」ブロック
 * 流れるティッカー + 収益・AI稼働ステータスを土台のように配置
 */
export default function BusinessFooterStatus() {
  const [barHeights, setBarHeights] = useState([65, 80, 55, 90, 72]);
  useEffect(() => {
    const id = setInterval(() => {
      setBarHeights((prev) =>
        prev.map((h) => Math.min(95, Math.max(40, h + (Math.random() - 0.5) * 8)))
      );
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-royal-blue via-[#1e3a8a] to-levereed-navy">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 20% 20%, rgba(255,122,47,0.15), transparent 50%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(43,95,217,0.2), transparent 50%)",
        }}
      />
      <div className="relative min-h-[200px] px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
            リアルタイム・ダッシュボード
          </p>
          <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">
            システムは常に稼働中
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                今月の紹介報酬
              </p>
              <p className="mt-1 text-lg font-bold text-action-orange sm:text-xl">
                +12,450<span className="text-sm font-normal text-white/80">P</span>
              </p>
              <div className="mt-2 flex gap-1">
                {barHeights.slice(0, 5).map((h, i) => (
                  <AnimatedBar key={i} delay={i * 100} height={`${h}%`} />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                AIマッチング
              </p>
              <p className="mt-1 text-lg font-bold text-white sm:text-xl">稼働中</p>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-white/80">
                <span className="business-pulse h-2 w-2 rounded-full bg-action-orange" />
                分析・提案を実行中
              </div>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                今週のマッチ
              </p>
              <p className="mt-1 text-lg font-bold text-white sm:text-xl">
                3<span className="text-sm font-normal text-white/80"> 件</span>
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="business-bar-animate h-full w-3/4 rounded-full bg-royal-blue"
                  style={{ animationDuration: "2.5s" }}
                />
              </div>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                次の目標
              </p>
              <p className="mt-1 text-lg font-bold text-action-orange sm:text-xl">
                50,000<span className="text-sm font-normal text-white/80">P</span>
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/20">
                <div className="h-full w-1/4 rounded-full bg-action-orange transition-all duration-1000" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <LiveTicker />
    </section>
  );
}
