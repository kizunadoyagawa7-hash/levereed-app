"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/** ロゴ（V字矢印）白背景用・ダークトーン */
function LevereedLogoIcon() {
  return (
    <svg
      width="64"
      height="44"
      viewBox="0 0 80 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto text-slate-800"
      aria-hidden
    >
      <path
        d="M12 48L40 8L68 48H52L40 32L28 48H12Z"
        fill="currentColor"
        fillOpacity="0.9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const TOTAL_DURATION = 1.0;
const STAGE1_END = 0.5;

/**
 * 1秒間のミニマル・オープニング演出
 * 0-0.5s: 白の世界＋ロゴ・キャッチコピーふわっとフェードイン（ロゴ表示は約0.3秒）
 * 0.5-1.0s: 白が中央から左右にスリットで開き、ダッシュボードが奥→手前ズーム
 */
export default function OpeningSequence({
  children,
  onComplete,
}: {
  children: React.ReactNode;
  onComplete?: () => void;
}) {
  const [overlayVisible, setOverlayVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setOverlayVisible(false);
      onComplete?.();
    }, TOTAL_DURATION * 1000);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="relative min-h-screen">
      {/* 背面：ダッシュボード（0.5s〜1.0s でズームイン） */}
      <motion.div
        className="relative min-h-screen"
        initial={false}
        animate={{
          scale: [0.96, 0.96, 1],
          opacity: [0.85, 0.85, 1],
        }}
        transition={{
          duration: TOTAL_DURATION,
          times: [0, STAGE1_END, 1],
          ease: [0.22, 0.61, 0.36, 1],
        }}
      >
        {children}
      </motion.div>

      {/* 前面：固定オーバーレイ（1秒後にアンマウント） */}
      {overlayVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 左パネル：0.5s〜1.0s で左へスリット（扉が開く） */}
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 bg-white"
            initial={false}
            animate={{ x: ["0%", "0%", "-100%"] }}
            transition={{
              duration: TOTAL_DURATION,
              times: [0, STAGE1_END, 1],
              ease: [0.22, 0.61, 0.36, 1],
            }}
          />
          {/* 右パネル：0.5s〜1.0s で右へスリット */}
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 bg-white"
            initial={false}
            animate={{ x: ["0%", "0%", "100%"] }}
            transition={{
              duration: TOTAL_DURATION,
              times: [0, STAGE1_END, 1],
              ease: [0.22, 0.61, 0.36, 1],
            }}
          />

          {/* 中央：ロゴ＋キャッチコピー（0〜0.2s 下からふわっとフェードイン、約0.3秒表示後フェードアウト） */}
          <motion.div
            className="absolute flex flex-col items-center justify-center text-center"
            initial={false}
            animate={{
              y: [24, 0, 0, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: TOTAL_DURATION,
              times: [0, 0.2, STAGE1_END, 0.75],
              ease: [0.22, 0.61, 0.36, 1],
            }}
          >
            <LevereedLogoIcon />
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
              レバリード
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-600 sm:text-base">
              AIと、新しい成功の扉を開く
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
