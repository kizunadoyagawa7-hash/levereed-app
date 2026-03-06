"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isPartnerUser } from "@/lib/auth";
import { type BusinessProfile, computeMatchScore, generateMatchReason } from "@/lib/matching";
import { DEMO_PARTNERS } from "@/lib/demo-partners";

const STORAGE_KEY = "levereed_business_profile";

function getStoredProfile(): BusinessProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BusinessProfile;
  } catch {
    return null;
  }
}

/** パートナー専用カード。このページはパートナーのみアクセス可能なためぼかし分岐なし */
function PartnerCard({
  name,
  contact,
  score,
  reason,
  agreed,
}: {
  name: string;
  contact: string;
  score: number;
  reason: string;
  agreed?: boolean;
}) {
  const showContact = !!agreed;

  return (
    <div className="relative overflow-hidden rounded-xl border border-levereed-navy-lighter bg-levereed-navy-light/80">
      <div className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="font-medium text-white">{name}</h3>
          <span className="rounded-full bg-levereed-neon-blue/20 px-3 py-0.5 text-sm font-semibold text-levereed-neon-blue">
            相性 {score}%
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-500">{reason}</p>
        {showContact && (
          <a
            href={`mailto:${contact}`}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-levereed-neon-green/20 px-3 py-2 text-sm font-medium text-levereed-neon-green border border-levereed-neon-green/50 hover:bg-levereed-neon-green/30 transition"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            連絡先を開く
          </a>
        )}
        {!agreed && (
          <p className="mt-2 text-xs text-gray-500">相性が合意されると連絡先が表示されます</p>
        )}
      </div>
    </div>
  );
}

const defaultProfile: BusinessProfile = {
  resources: [],
  problems: [],
  target: { industry: 0, scale: 0, budget: 0 },
};

export default function PartnersPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const partner = isPartnerUser();
    setAllowed(partner);
    if (!partner) {
      router.replace("/business");
    }
  }, [mounted, router]);

  useEffect(() => {
    setProfile(getStoredProfile());
  }, []);

  const dashboardHref = "/business";
  const currentProfile: BusinessProfile = profile ?? defaultProfile;

  // Always call hooks at the top level, even if their results aren't used during loading/redirect
  const partnersWithScore = useMemo(() => {
    const list = DEMO_PARTNERS.map((p) => {
      const score = computeMatchScore(currentProfile, p.profile);
      return {
        ...p,
        score,
        reason: generateMatchReason(currentProfile, p.profile, score),
      };
    });
    return [...list].sort((a, b) => b.score - a.score);
  }, [currentProfile]);

  if (!mounted || allowed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-levereed-navy">
        <p className="text-white/80">確認中...</p>
      </div>
    );
  }
  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-levereed-navy">
        <p className="text-slate-400">リダイレクト中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-levereed-navy">
      <div
        className="fixed inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 100% 60% at 50% 0%, rgba(0, 212, 255, 0.1), transparent 50%)",
        }}
      />
      <header className="relative border-b border-levereed-navy-lighter bg-levereed-navy-light/60 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <Link href={dashboardHref} className="text-sm text-gray-400 hover:text-levereed-neon-blue transition-colors">
            ← ダッシュボード
          </Link>
          <span className="font-semibold text-levereed-neon-blue">AIマッチング</span>
          <Link
            href="/dashboard/setup"
            className="text-sm text-gray-400 hover:text-levereed-neon-blue transition-colors"
          >
            プロフィール編集
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-xl font-semibold text-white mb-2">マッチングパートナー</h1>
        <p className="text-sm text-gray-500 mb-6">
          あなたのプロフィールに基づいて相性を算出しています。
        </p>

        {partnersWithScore.length === 0 ? (
          <p className="text-gray-500">マッチング結果はありません。</p>
        ) : (
          <ul className="space-y-4">
            {partnersWithScore.map((p) => (
              <li key={p.id}>
                <PartnerCard
                  name={p.name}
                  contact={p.contact}
                  score={p.score}
                  reason={p.reason}
                  agreed={p.agreed}
                />
              </li>
            ))}
          </ul>
        )}

        {(!profile || profile.resources.length === 0) && (
          <div className="mt-6 rounded-xl border border-levereed-neon-blue/40 bg-levereed-navy-light/60 p-4">
            <p className="text-sm text-gray-400">
              プロフィールを設定すると、より精度の高い相性が表示されます。
            </p>
            <Link
              href="/dashboard/setup"
              className="mt-2 inline-block text-sm text-levereed-neon-blue hover:underline"
            >
              AIヒアリングで設定する →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
