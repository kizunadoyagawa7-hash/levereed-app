"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isPartnerUser } from "@/lib/auth";

/**
 * ビジネス・パートナー共通の限定コンテンツまとめページ。
 * アップグレード誘導のぼかし・リダイレクトはかけない。
 */
export default function CrowdsourcingContentPage() {
  const [dashboardHref, setDashboardHref] = useState("/business");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDashboardHref(isPartnerUser() ? "/business" : "/business");
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-levereed-navy">
        <p className="text-white/80">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-levereed-navy">
      <div
        className="fixed inset-0"
        aria-hidden
        style={{
          background: "radial-gradient(ellipse 100% 60% at 50% 0%, rgba(0, 212, 255, 0.08), transparent 50%)",
        }}
      />

      <header className="relative border-b border-levereed-navy-lighter bg-levereed-navy-light/60 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link
            href={dashboardHref}
            className="text-sm text-gray-400 hover:text-levereed-neon-blue transition-colors"
          >
            ← ダッシュボード
          </Link>
          <span className="font-semibold text-levereed-neon-blue">限定コンテンツ</span>
          <span className="w-16" aria-hidden />
        </div>
      </header>

      <main className="relative mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          クラウドソーシングサイトを24時間営業マンに変える集客術
        </h1>
        <p className="text-sm text-gray-500 mb-8">ビジネス・パートナー会員向け限定ナレッジ</p>

        {/* 動画埋め込み枠 */}
        <section className="mb-8 rounded-2xl border border-levereed-navy-lighter bg-levereed-navy-light/80 overflow-hidden">
          <div
            className="aspect-video flex items-center justify-center bg-black/40"
            style={{ minHeight: "320px" }}
          >
            <p className="text-gray-500">動画プレースホルダー（後で編集可能）</p>
          </div>
        </section>

        {/* テキスト解説エリア */}
        <section className="mb-8 rounded-2xl border border-levereed-navy-lighter bg-levereed-navy-light/80 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">解説</h2>
          <div className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed space-y-4">
            <p>
              ここにはクラウドソーシングを活用した集客ノウハウの解説テキストが入ります。後で編集可能なプレースホルダーです。実際のコンテンツでは、24時間稼働させるための設計思想・運用のコツ・注意点などを記載してください。
            </p>
            <p>
              ダミーテキスト。レバリードのポイント制度と組み合わせることで、紹介活動がそのまま集客資産の蓄積につながります。質の高いユーザーを育てることが報われる付与バランスを意識した設計が重要です。
            </p>
          </div>
        </section>

        {/* 資料ダウンロードボタン */}
        <section className="mb-8">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-levereed-neon-blue bg-levereed-neon-blue/20 px-6 py-3 text-sm font-medium text-levereed-neon-blue hover:bg-levereed-neon-blue/30 transition"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            資料をダウンロード（プレースホルダー）
          </button>
        </section>
      </main>
    </div>
  );
}
