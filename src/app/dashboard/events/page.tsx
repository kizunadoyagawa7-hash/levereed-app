"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isPartnerUser } from "@/lib/auth";

/** 交流会参加で付与（資料に基づき500P）。ビジネス会員はパートナー昇格後に付与。 */
const POINTS_EVENT_JOIN = 500;

const MOCK_EVENTS = [
  { id: "1", title: "オンライン交流会・3月", date: "2026-03-15", type: "online", capacity: 50 },
  { id: "2", title: "リファラルマッチミートアップ", date: "2026-03-22", type: "offline", capacity: 30 },
  { id: "3", title: "事業者向けナレッジ共有会", date: "2026-04-05", type: "online", capacity: 100 },
];

export default function EventsPage() {
  const [dashboardHref, setDashboardHref] = useState("/business");
  const [reserved, setReserved] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDashboardHref(isPartnerUser() ? "/business" : "/business");
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem("levereed_event_reservations");
      if (raw) {
        try {
          const arr = JSON.parse(raw) as string[];
          setReserved(new Set(arr));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const handleReserve = (eventId: string) => {
    const next = new Set(reserved);
    next.add(eventId);
    setReserved(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("levereed_event_reservations", JSON.stringify([...next]));
    }
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-levereed-navy">
        <p className="text-white/80">読み込み中...</p>
      </div>
    );
  }

  const isPartner = isPartnerUser();

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
          <span className="font-semibold text-levereed-neon-blue">交流会一覧</span>
          <span className="w-16" aria-hidden />
        </div>
      </header>

      <main className="relative mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-xl font-bold text-white mb-2">交流会</h1>
        <p className="text-sm text-gray-500 mb-2">
          オンライン・オフラインの交流会に参加予約できます。参加で<strong className="text-levereed-neon-blue">{POINTS_EVENT_JOIN}P</strong>獲得（資料に基づく）。
        </p>
        {!isPartner && (
          <p className="text-xs text-amber-400/90 mb-6 rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2">
            ポイント獲得にはパートナー昇格が必要です。参加予約はどなたでも可能です。
          </p>
        )}

        <ul className="space-y-4">
          {MOCK_EVENTS.map((ev) => {
            const isReserved = reserved.has(ev.id);
            return (
              <li
                key={ev.id}
                className="rounded-xl border border-levereed-navy-lighter bg-levereed-navy-light/80 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-white">{ev.title}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {ev.date} ・ {ev.type === "online" ? "オンライン" : "オフライン"} ・ 定員{ev.capacity}名
                    </p>
                    {isPartner && (
                      <p className="text-xs text-levereed-neon-blue mt-1">参加で{POINTS_EVENT_JOIN}P付与</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleReserve(ev.id)}
                    disabled={isReserved}
                    className="rounded-lg bg-levereed-neon-blue px-4 py-2 text-sm font-medium text-levereed-navy disabled:opacity-50 disabled:cursor-default"
                  >
                    {isReserved ? "予約済み" : "参加予約"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
