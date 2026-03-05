"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setStoredUserEmail, canAccessBusiness, debugLogUserRole } from "@/lib/auth";

const ROYAL_BLUE = "#2B5FD9";
const ACTION_ORANGE = "#FF7A2F";
const NAVY = "#1a1f36";
const NAVY_LIGHT = "#2a3255";
const NAVY_LIGHTER = "#3d4a6f";

/**
 * ロゴ：ロイヤルブルー基調のV字矢印（SVG）
 */
function LevereedLogo() {
  return (
    <div className="flex justify-center mb-10">
      <svg
        width="80"
        height="56"
        viewBox="0 0 80 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: "drop-shadow(0 0 12px rgba(43, 95, 217, 0.5))" }}
        aria-hidden
      >
        <path
          d="M12 48L40 8L68 48H52L40 32L28 48H12Z"
          fill={ROYAL_BLUE}
          fillOpacity="0.9"
          stroke={ROYAL_BLUE}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/** 門番撤去済み：本ページに「ログイン済みならリダイレクト」の useEffect 等は存在しない。middleware も全通過のため /login は常に表示可能。 */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredUserEmail(email);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("levereed_show_opening", "1");
    }
    debugLogUserRole();
    if (canAccessBusiness()) {
      router.replace("/business");
    } else {
      router.replace("/life");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: NAVY }}
    >
      <div
        className="fixed inset-0"
        aria-hidden
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% -20%, rgba(43, 95, 217, 0.12), transparent), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(255, 122, 47, 0.06), transparent)`,
        }}
      />

      <main className="relative w-full max-w-sm">
        <div
          className="rounded-2xl border backdrop-blur-sm px-8 py-10"
          style={{
            borderColor: NAVY_LIGHTER,
            backgroundColor: `${NAVY_LIGHT}cc`,
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          <LevereedLogo />

          <h1 className="text-center text-2xl font-semibold tracking-tight text-white">
            レバリード
          </h1>
          <p className="text-center text-sm text-gray-400 mt-1 mb-8">
            ビジネスマッチング
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-gray-600 px-4 py-3 text-white placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2B5FD9]"
                style={{ backgroundColor: `${NAVY}99` }}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-600 px-4 py-3 text-white placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2B5FD9]"
                style={{ backgroundColor: `${NAVY}99` }}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg py-3 font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a1f36]"
              style={{
                backgroundColor: ACTION_ORANGE,
                boxShadow: "0 2px 12px rgba(255, 122, 47, 0.35)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#e86d28";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(255, 122, 47, 0.45)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = ACTION_ORANGE;
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(255, 122, 47, 0.35)";
              }}
            >
              ログイン
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-500">
            アカウントをお持ちでない方は
            <a href="#" className="ml-1 hover:underline" style={{ color: ACTION_ORANGE }}>
              新規登録
            </a>
          </p>
        </div>
      </main>

      <footer className="relative mt-12 text-center text-xs text-gray-500">
        © 2025 レバリード デモ
      </footer>
    </div>
  );
}
