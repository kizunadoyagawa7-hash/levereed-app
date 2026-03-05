"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllNotificationLogForCurrentUser } from "@/lib/match-requests";
import type { NotificationEntry } from "@/lib/match-requests";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationsLogPage() {
  const [list, setList] = useState<NotificationEntry[]>([]);

  useEffect(() => {
    setList(getAllNotificationLogForCurrentUser());
  }, []);

  return (
    <div className="min-h-screen bg-levereed-navy">
      <header className="sticky top-0 z-10 border-b border-levereed-navy-lighter bg-levereed-navy-light/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <Link href="/business" className="text-sm text-gray-400 hover:text-levereed-neon-blue">
            ← ビジネスダッシュボード
          </Link>
          <span className="font-semibold text-levereed-neon-blue">お知らせログ</span>
          <span className="w-32" />
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-8">
        <p className="mb-6 text-sm text-gray-400">
          依頼の送信・受信、承認・辞退など、これまでのやり取りを確認できます。
        </p>
        {list.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-gray-400">
            まだお知らせはありません。
          </p>
        ) : (
          <ul className="space-y-4">
            {list.map((n) => (
              <li
                key={n.id}
                className="rounded-xl border border-white/15 bg-levereed-navy-light/60 p-4"
              >
                <p className="font-medium text-white">{n.title}</p>
                <p className="mt-1 text-sm text-gray-400">{n.body}</p>
                <p className="mt-2 text-xs text-gray-500">{formatDate(n.createdAt)}</p>
                {n.type === "match_request" && n.requestId && (
                  <Link
                    href={`/dashboard/business/match-request/${n.requestId}`}
                    className="mt-3 inline-block text-sm text-levereed-neon-blue hover:underline"
                  >
                    詳細を見る →
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
