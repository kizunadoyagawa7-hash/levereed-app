import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "レバリード | ビジネスマッチング",
  description: "ビジネスマッチングアプリ レバリード デモ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-silver-grey text-gray-800 antialiased">{children}</body>
    </html>
  );
}
