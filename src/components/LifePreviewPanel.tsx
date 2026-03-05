"use client";

import { useRouter } from "next/navigation";
import { setLifePreviewMode } from "@/lib/preview";

export const PREVIEW_MY_AD_SECTION_ID = "preview-my-ad";

export default function LifePreviewPanel() {
  const router = useRouter();

  const handleBackToBusiness = () => {
    setLifePreviewMode(false);
    router.push("/business");
  };

  const handleScrollToMyAd = () => {
    const el = document.getElementById(PREVIEW_MY_AD_SECTION_ID);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/20 bg-slate-900/98 px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.2)] backdrop-blur-md"
      role="region"
      aria-label="プレビュー・コントロールパネル"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-white/90">
          表示属性：<strong className="text-white">一般ライフ会員</strong>
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleScrollToMyAd}
            className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
          >
            自分の広告を確認する
          </button>
          <button
            type="button"
            onClick={handleBackToBusiness}
            className="rounded-lg bg-action-orange px-4 py-2 text-sm font-semibold text-white shadow-[0_0_16px_rgba(255,122,47,0.4)] transition hover:opacity-90"
          >
            ビジネス画面に戻る
          </button>
        </div>
      </div>
    </div>
  );
}
