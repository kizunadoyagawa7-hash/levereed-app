"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  getRequestById,
  approveMatchRequest,
  declineMatchRequest,
  CURRENT_USER_ID,
} from "@/lib/match-requests";
import type { MatchRequest } from "@/lib/match-requests";
import { HEARING_QUESTIONS, type BusinessProfile, type HearingQuestion } from "@/lib/matching";

function formatHearingValue(
  q: HearingQuestion,
  value: string | number | number[] | undefined
): string {
  if (value === undefined || value === null || value === "") return "—";
  if (q.type === "text") return String(value);
  const opts = q.options ?? [];
  if (q.type === "select") {
    const id = typeof value === "number" ? value : Array.isArray(value) ? value[0] : Number(value);
    return opts.find((o) => o.id === id)?.label ?? String(value);
  }
  if (q.type === "multiselect" && Array.isArray(value)) {
    const labels = value.map((id) => opts.find((o) => o.id === id)?.label ?? id);
    return labels.filter(Boolean).join("、") || "—";
  }
  return String(value);
}

function HearingProfile({ profile }: { profile: BusinessProfile }) {
  const hearing = profile.hearing ?? {};
  return (
    <div className="space-y-3">
      {HEARING_QUESTIONS.map((q) => {
        let val: string | number | number[] | undefined = hearing[q.id];
        if (q.id === "resources" && val === undefined) val = profile.resources;
        if (q.id === "problems" && val === undefined) val = profile.problems;
        if (q.id === "targetIndustry" && val === undefined) val = profile.target.industry;
        if (q.id === "targetScale" && val === undefined) val = profile.target.scale;
        if (q.id === "targetBudget" && val === undefined) val = profile.target.budget;
        const display = formatHearingValue(q, val);
        if (display === "—" && q.type === "text") return null;
        return (
          <div key={q.id} className="flex flex-col gap-0.5 border-b border-white/10 pb-2">
            <span className="text-xs text-white/60">{q.label}</span>
            <span className="text-sm text-white/90">{display}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function MatchRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [request, setRequest] = useState<MatchRequest | null>(null);
  const [action, setAction] = useState<"idle" | "approved" | "declined">("idle");

  useEffect(() => {
    const r = getRequestById(id);
    if (!r) {
      setRequest(null);
      return;
    }
    if (r.toId !== CURRENT_USER_ID) {
      router.replace("/business");
      return;
    }
    if (r.status !== "pending") {
      router.replace("/business");
      return;
    }
    setRequest(r);
  }, [id, router]);

  const handleApprove = () => {
    if (!request) return;
    approveMatchRequest(request.id);
    setAction("approved");
  };

  const handleDecline = () => {
    if (!request) return;
    declineMatchRequest(request.id);
    setAction("declined");
    setTimeout(() => router.push("/business"), 1500);
  };

  if (request === null) {
    return (
      <div className="min-h-screen bg-levereed-navy flex items-center justify-center">
        <p className="text-gray-400">依頼が見つかりません。</p>
        <Link href="/business" className="ml-4 text-levereed-neon-blue hover:underline">ダッシュボードへ</Link>
      </div>
    );
  }

  if (action === "approved") {
    return (
      <div className="min-h-screen bg-levereed-navy">
        <header className="border-b border-levereed-navy-lighter bg-levereed-navy-light/60">
          <div className="mx-auto flex h-14 max-w-2xl items-center px-4">
            <Link href="/business" className="text-sm text-gray-400 hover:text-levereed-neon-blue">← ダッシュボード</Link>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-levereed-neon-green">マッチング成立！</h1>
          <p className="mt-4 text-white/90">
            {request.fromName} さんとマッチングが成立しました。連絡用チャットまたは次のステップへ進めます。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard/partners"
              className="rounded-lg bg-levereed-neon-blue px-6 py-3 text-sm font-medium text-levereed-navy"
            >
              マッチング一覧へ
            </Link>
            <Link
              href="/business"
              className="rounded-lg border border-white/30 bg-white/5 px-6 py-3 text-sm font-medium text-white"
            >
              ビジネスダッシュボードへ
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (action === "declined") {
    return (
      <div className="min-h-screen bg-levereed-navy flex items-center justify-center">
        <p className="text-white/90">辞退しました。依頼主に通知しました。</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-levereed-navy">
      <header className="sticky top-0 z-10 border-b border-levereed-navy-lighter bg-levereed-navy-light/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <Link href="/business" className="text-sm text-gray-400 hover:text-levereed-neon-blue">
            ← お知らせへ
          </Link>
          <span className="font-semibold text-white">マッチング依頼の詳細</span>
          <span className="w-16" />
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-2xl border border-levereed-navy-lighter bg-levereed-navy-light/80 p-6">
          <h2 className="text-lg font-semibold text-white">{request.fromName} さんからの依頼</h2>
          <p className="mt-1 text-sm text-gray-400">20項目のヒアリングデータに基づくプロフィールです。</p>

          <section className="mt-6">
            <h3 className="text-sm font-medium uppercase tracking-wider text-white/70 mb-3">依頼主のプロフィール（20項目）</h3>
            <HearingProfile profile={request.fromProfile} />
          </section>

          <section className="mt-6 rounded-xl bg-royal-blue/20 border border-royal-blue/30 p-4">
            <h3 className="text-sm font-medium text-royal-blue mb-2">AI分析：この人と繋がるべき理由</h3>
            <p className="text-sm text-white/90 leading-relaxed">{request.reason}</p>
          </section>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={handleApprove}
              className="flex-1 rounded-xl bg-levereed-neon-green px-6 py-3.5 text-sm font-semibold text-levereed-navy hover:opacity-90"
            >
              承認する（マッチング成立）
            </button>
            <button
              type="button"
              onClick={handleDecline}
              className="flex-1 rounded-xl border border-white/30 bg-white/5 px-6 py-3.5 text-sm font-medium text-white hover:bg-white/10"
            >
              今回は遠慮する（非承認）
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
