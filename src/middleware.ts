import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROLE_COOKIE_NAME = "levereed_role";

type Role = "partner" | "business" | "life";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const role = request.cookies.get(ROLE_COOKIE_NAME)?.value as Role | undefined;

  // 静的・API・ログインは通過
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname === "/login" || pathname === "/") {
    return NextResponse.next();
  }

  // ビジネスエリア: life は /life へ
  if (pathname === "/business" || pathname.startsWith("/business/")) {
    if (role === "life" || !role) {
      return NextResponse.redirect(new URL("/life", request.url));
    }
    return NextResponse.next();
  }

  // ダッシュボード配下ビジネス: life は /life へ
  if (pathname.startsWith("/dashboard/business")) {
    if (role === "life" || !role) {
      return NextResponse.redirect(new URL("/life", request.url));
    }
    return NextResponse.next();
  }

  // 限定コンテンツ・交流会: パートナー・ビジネス共通でアクセス許可（life は /life へ）
  if (pathname.startsWith("/dashboard/contents") || pathname.startsWith("/dashboard/events")) {
    if (!role) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (role === "life") {
      return NextResponse.redirect(new URL("/life", request.url));
    }
    return NextResponse.next();
  }

  // パートナー限定: /dashboard/partners は partner のみ許可、business は /business へ
  if (pathname.startsWith("/dashboard/partners")) {
    if (!role) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (role === "business") {
      return NextResponse.redirect(new URL("/business", request.url));
    }
    if (role === "life") {
      return NextResponse.redirect(new URL("/life", request.url));
    }
    return NextResponse.next();
  }

  // /life は全ロール許可（プレビュー含む）
  // /dashboard/points, /dashboard/setup は両方許可
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
