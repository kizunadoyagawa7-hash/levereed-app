"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

/**
 * パートナー詳細プロフィールページ（骨組み）
 */
export default function PartnerDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link href="/dashboard/partners" className="text-sm text-levereed-navy/70 hover:text-levereed-neon-blue">
            ← マッチング一覧
          </Link>
          <span className="font-semibold text-levereed-navy">パートナー詳細</span>
          <span className="w-20" />
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-slate-500">ID: {id}</p>
        <p className="mt-2 text-sm text-slate-500">詳細プロフィールはここに表示されます。</p>
      </main>
    </div>
  );
}
