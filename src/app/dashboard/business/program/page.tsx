"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isPartnerUser } from "@/lib/auth";

/**
 * プログラム詳細：顧客獲得の自動化・実践プログラム
 * パートナー限定カード2「プログラム詳細へ」の固有ページ
 */
export default function ProgramDetailPage() {
  const [dashboardHref, setDashboardHref] = useState("/life");

  useEffect(() => {
    setDashboardHref(isPartnerUser() ? "/business" : "/life");
  }, []);

  const phases = [
    {
      num: 1,
      title: "Phase 1: ターゲット選定の最適化",
      desc: "AIがあなたの市場価値を分析し、最も成約しやすいターゲット層を特定します。",
      detail: "リソース・課題・ビジョンを20項目のヒアリングで可視化し、補完関係にある相手をマッチング。",
    },
    {
      num: 2,
      title: "Phase 2: 高成約率のLP/SNS構成",
      desc: "8年の知見を反映したテンプレートで、LPやSNSの構成を最適化。",
      detail: "成約率を上げるコピー・構成・CTA配置を、業種別テンプレートで実装可能に。",
    },
    {
      num: 3,
      title: "Phase 3: 自動集客システム構築",
      desc: "ツールを連携し、寝ている間もリードを獲得する仕組みを構築。",
      detail: "メール・SNS・LPの連携と、AIによるフォローアップで、リードを自動で育成。",
    },
  ];

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
          <span className="font-semibold text-levereed-neon-blue">プログラム詳細</span>
          <span className="w-24" />
        </div>
      </header>

      <main className="relative mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-xl font-semibold text-white">
          顧客獲得の自動化・実践プログラム
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          2年間注力してきた最新の顧客獲得手法を、Phase別に実践できます。あなたの代わりにAIがこの戦略を実行します。
        </p>
        <span className="mt-4 inline-block rounded-full bg-[#FF7A2F]/90 px-3 py-1 text-xs font-bold text-white">
          パートナー限定：全Phase解放中
        </span>

        <ul className="mt-8 space-y-6">
          {phases.map((p) => (
            <li
              key={p.num}
              className="rounded-xl border border-levereed-navy-lighter bg-levereed-navy-light/60 p-5"
            >
              <div className="flex gap-3">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#FF7A2F]/20 text-[#FF7A2F] font-bold">
                  {p.num}
                </span>
                <div>
                  <h2 className="font-semibold text-white">{p.title}</h2>
                  <p className="mt-1 text-sm text-gray-300">{p.desc}</p>
                  <p className="mt-2 text-xs text-gray-500">{p.detail}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex gap-3">
          <Link
            href={dashboardHref}
            className="rounded-lg border border-levereed-navy-lighter px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            ダッシュボードへ戻る
          </Link>
          <Link
            href="/dashboard/partners"
            className="rounded-lg bg-[#FF7A2F] px-4 py-2 text-sm font-medium text-white shadow-[0_0_20px_rgba(255,122,47,0.3)]"
          >
            AIマッチングを見る
          </Link>
        </div>
      </main>
    </div>
  );
}
