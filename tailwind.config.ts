import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.css",
  ],
  // 確実に生成するクラス（globals.css・ログイン等）
  safelist: [
    "bg-silver-grey",
    "text-gray-800",
    "bg-royal-blue",
    "bg-action-orange",
    "text-royal-blue",
    "text-action-orange",
    "border-royal-blue",
    "border-action-orange",
    "bg-levereed-navy",
    "border-levereed-navy-lighter",
    "bg-levereed-navy-light",
    "shadow-neon-blue",
  ],
  theme: {
    extend: {
      colors: {
        // ブランドカラー（強制適用）
        "royal-blue": "#2B5FD9",
        "action-orange": "#FF7A2F",
        "silver-grey": "#F0F2F5",
        // 互換用・ダークテキスト
        "levereed-navy": "#1a1f36",
        "levereed-navy-light": "#2a3255",
        "levereed-navy-lighter": "#3d4a6f",
        "levereed-neon-blue": "#00d4ff",
        "levereed-neon-green": "#00ff88",
      },
      boxShadow: {
        "royal-blue": "0 2px 12px rgba(43, 95, 217, 0.25)",
        "action-orange": "0 2px 12px rgba(255, 122, 47, 0.3)",
        "neon-blue": "0 0 24px rgba(0, 212, 255, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
