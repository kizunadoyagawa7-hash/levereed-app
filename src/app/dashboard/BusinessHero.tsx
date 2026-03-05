"use client";

import { useState, useCallback } from "react";

/**
 * ビジネス用ヒーロー：PV風ループ動画 + ロイヤルブルーオーバーレイ + メインコピー
 * テック・ビジネス系のスピード感ある背景。動画読み込みまでは静止画フォールバック。
 */
const VIDEO_SRC =
  "https://assets.mixkit.co/videos/preview/mixkit-abstract-digital-network-5382-large.mp4";
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1280&q=80";

export default function BusinessHero() {
  const [videoReady, setVideoReady] = useState(false);
  const onCanPlay = useCallback(() => setVideoReady(true), []);

  return (
    <section className="relative aspect-[2.4/1] min-h-[280px] w-full overflow-hidden sm:min-h-[320px]">
      {/* フォールバック：動画読み込み完了まで静止画を表示 */}
      <div
        className="absolute inset-0 h-full w-full transition-opacity duration-500"
        style={{ opacity: videoReady ? 0 : 1 }}
        aria-hidden
      >
        <img
          src={FALLBACK_IMAGE}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      {/* 背景動画（muted / loop / autoPlay / playsInline） */}
      <video
        autoPlay
        muted
        loop
        playsInline
        onCanPlay={onCanPlay}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: videoReady ? 1 : 0 }}
        poster={FALLBACK_IMAGE}
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>
      {/* 半透明オーバーレイ（ロイヤルブルーグラデーション） */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(43,95,217,0.85) 0%, rgba(30,58,138,0.75) 40%, rgba(26,31,54,0.88) 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 80% 20%, rgba(255,122,47,0.25), transparent 50%)",
        }}
      />
      {/* メインコピー：drop-shadow・背景ぼかしで視認性確保 */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
        <div className="mx-auto w-full max-w-4xl">
          <div className="rounded-xl bg-black/20 px-4 py-3 backdrop-blur-sm sm:max-w-2xl sm:px-5 sm:py-4">
            <p
              className="text-xs font-semibold uppercase tracking-wider text-white/90"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.3)" }}
            >
              ビジネスの次の一歩
            </p>
            <h2
              className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5), 0 0 24px rgba(0,0,0,0.25)" }}
            >
              つながりが、成長を生む
            </h2>
            <p
              className="mt-3 max-w-xl text-sm text-white/95 sm:text-base"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
            >
              AIがパートナーを提案。紹介でポイントが積み上がる。プロの土台は、ここから。
            </p>
            <a
              href="#content"
              className="mt-4 inline-block rounded-lg bg-action-orange px-5 py-2.5 text-sm font-medium text-white shadow-lg transition hover:opacity-90"
              style={{
                boxShadow: "0 2px 12px rgba(255,122,47,0.4), 0 2px 8px rgba(0,0,0,0.3)",
                textShadow: "0 1px 2px rgba(0,0,0,0.4)",
              }}
            >
              ワンクリックで詳細
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
