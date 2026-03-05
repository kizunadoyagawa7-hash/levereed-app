"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isPartnerUser, canAccessBusiness, hasHearingCompleted, STORAGE_KEY_ROLE, JUST_UPGRADED_KEY, HEARING_COMPLETED_KEY } from "@/lib/auth";
import {
  emptyProfile,
  type BusinessProfile,
  HEARING_QUESTIONS,
  type HearingQuestion,
  syncProfileFromHearing,
} from "@/lib/matching";

const STORAGE_KEY = "levereed_business_profile";
const QUESTIONS_PER_STEP = 4;
const TOTAL_STEPS = Math.ceil(HEARING_QUESTIONS.length / QUESTIONS_PER_STEP);

function getHearingValue(profile: BusinessProfile, id: string): string | number | number[] | undefined {
  return profile.hearing?.[id];
}

function setHearingValue(profile: BusinessProfile, id: string, value: string | number | number[]): BusinessProfile {
  const hearing = { ...(profile.hearing ?? {}), [id]: value };
  const next: BusinessProfile = { ...profile, hearing };

  if (id === "resources" && Array.isArray(value)) next.resources = value;
  if (id === "problems" && Array.isArray(value)) next.problems = value;
  if (id === "targetIndustry" && typeof value === "number") next.target = { ...next.target, industry: value };
  if (id === "targetScale" && typeof value === "number") next.target = { ...next.target, scale: value };
  if (id === "targetBudget" && typeof value === "number") next.target = { ...next.target, budget: value };

  return next;
}

function QuestionBlock({
  q,
  value,
  onChange,
}: {
  q: HearingQuestion;
  value: string | number | number[] | undefined;
  onChange: (v: string | number | number[]) => void;
}) {
  if (q.type === "text") {
    return (
      <div>
        <label className="block text-sm text-gray-400 mb-1">{q.label}</label>
        <input
          type="text"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={q.placeholder}
          className="w-full rounded-lg border border-levereed-navy-lighter bg-levereed-navy-light/80 px-3 py-2 text-white placeholder-gray-500"
        />
      </div>
    );
  }
  if (q.type === "select" && q.options) {
    const numVal = typeof value === "number" ? value : Array.isArray(value) ? value[0] : Number(value) ?? 0;
    return (
      <div>
        <label className="block text-sm text-gray-400 mb-1">{q.label}</label>
        <select
          value={numVal}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full rounded-lg border border-levereed-navy-lighter bg-levereed-navy-light/80 px-3 py-2 text-white"
        >
          {q.options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
  if (q.type === "multiselect" && q.options) {
    const arr = Array.isArray(value) ? value : [];
    const toggle = (id: number) => {
      const next = arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];
      onChange(next);
    };
    return (
      <div>
        <label className="block text-sm text-gray-400 mb-2">{q.label}</label>
        <div className="flex flex-wrap gap-2">
          {q.options.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => toggle(o.id)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                arr.includes(o.id)
                  ? "border-levereed-neon-blue bg-levereed-neon-blue/20 text-levereed-neon-blue"
                  : "border-levereed-navy-lighter bg-levereed-navy-light/60 text-gray-400 hover:border-levereed-neon-blue/50 hover:text-white"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<BusinessProfile>(emptyProfile());
  const [dashboardHref, setDashboardHref] = useState("/life");
  const [mlmPledge, setMlmPledge] = useState(false);

  useEffect(() => {
    setDashboardHref(isPartnerUser() ? "/business" : "/life");
  }, []);

  const [skipSetup, setSkipSetup] = useState<boolean | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hasHearingCompleted()) {
      /* フラグ最優先：ヒアリング済み・パートナー・マスターは二度とヒアリングを出さず /business へ */
      setSkipSetup(true);
      router.replace("/business");
      return;
    }
    setSkipSetup(false);
  }, [router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as BusinessProfile;
        if (parsed.hearing) setProfile(parsed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const start = step * QUESTIONS_PER_STEP;
  const questions = HEARING_QUESTIONS.slice(start, start + QUESTIONS_PER_STEP);
  const isLastStep = step === TOTAL_STEPS - 1;

  const handleNext = () => {
    if (isLastStep) {
      if (!mlmPledge) return;
      const synced = syncProfileFromHearing(profile);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(synced));
        window.localStorage.setItem(HEARING_COMPLETED_KEY, "1");
        if (canAccessBusiness()) {
          window.localStorage.setItem(STORAGE_KEY_ROLE, "partner");
          window.localStorage.setItem(JUST_UPGRADED_KEY, "1");
        }
        setDashboardHref("/business");
      }
      setStep(TOTAL_STEPS); // thank you
    } else {
      setStep((s) => s + 1);
    }
  };

  if (skipSetup === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-levereed-navy">
        <p className="text-levereed-neon-blue">確認中...</p>
      </div>
    );
  }
  if (skipSetup === true) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-levereed-navy">
        <p className="text-levereed-neon-blue">リダイレクト中...</p>
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
          <span className="font-semibold text-levereed-neon-blue">AIヒアリング（20項目）</span>
          <span className="text-xs text-gray-500">
            {step < TOTAL_STEPS ? `${step + 1} / ${TOTAL_STEPS}` : ""}
          </span>
        </div>
      </header>

      <main className="relative mx-auto max-w-2xl px-4 py-8">
        {step < TOTAL_STEPS && (
          <div className="mb-8 flex gap-1">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-levereed-neon-blue" : "bg-levereed-navy-lighter"
                }`}
              />
            ))}
          </div>
        )}

        <div className="rounded-2xl border border-levereed-navy-lighter bg-levereed-navy-light/80 p-6 shadow-[0_0_40px_-12px_rgba(0,212,255,0.2)]">
          {step < TOTAL_STEPS && (
            <>
              <div className="mb-6 flex gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-levereed-neon-blue/20 text-levereed-neon-blue">
                  AI
                </div>
                <p className="text-white">
                  ステップ {step + 1}：ビジネスの解像度を高めるための質問です。回答はマッチング理由の具体化に利用されます。
                </p>
              </div>
              <div className="space-y-6">
                {questions.map((q) => (
                  <QuestionBlock
                    key={q.id}
                    q={q}
                    value={getHearingValue(profile, q.id)}
                    onChange={(v) => setProfile((p) => setHearingValue(p, q.id, v))}
                  />
                ))}
                {isLastStep && (
                  <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 p-4">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={mlmPledge}
                        onChange={(e) => setMlmPledge(e.target.checked)}
                        className="mt-1 h-5 w-5 rounded border-amber-400/60 bg-levereed-navy-light text-amber-400 focus:ring-amber-400"
                      />
                      <span className="text-sm text-white">
                        <strong className="text-amber-400">必須：</strong>MLM（ネットワークビジネス）の勧誘目的で利用しません。
                      </span>
                    </label>
                  </div>
                )}
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isLastStep && !mlmPledge}
                  className="rounded-lg bg-levereed-neon-blue px-6 py-2 text-sm font-medium text-levereed-navy hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLastStep ? "完了して保存" : "次へ"}
                </button>
              </div>
            </>
          )}

          {step === TOTAL_STEPS && (
            <div className="space-y-4 text-center py-4">
              <p className="text-levereed-neon-green font-medium">20項目のプロフィールを保存しました。</p>
              {canAccessBusiness() && (
                <p className="text-sm font-medium text-white/90">パートナープランへアップグレードしました。全機能が解放されています。</p>
              )}
              <p className="text-sm text-gray-400">AIマッチングで「なぜ相性が高いか」が具体的に表示されます。</p>
              <Link
                href="/business"
                className="inline-block rounded-lg bg-levereed-neon-blue px-4 py-2 text-sm font-medium text-levereed-navy"
              >
                ビジネスダッシュボードで確認する
              </Link>
              <br />
              <Link
                href="/dashboard/partners"
                className="inline-block rounded-lg border border-levereed-neon-blue/50 px-4 py-2 text-sm font-medium text-levereed-neon-blue mt-2"
              >
                マッチングを見る
              </Link>
              <br />
              <Link href={dashboardHref} className="text-sm text-gray-500 hover:text-levereed-neon-blue mt-2 inline-block">
                ダッシュボードへ戻る
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
