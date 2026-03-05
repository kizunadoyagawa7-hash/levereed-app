/**
 * 認証属性（Role）の固定設定
 * パートナーは PARTNER_EMAILS リストで判定。DB未使用のため localStorage の role を最優先で読み込む。
 */

export const STORAGE_KEY_EMAIL = "levereed_user_email";
export const STORAGE_KEY_ROLE = "levereed_user_role";
/** ミドルウェア用。サーバーで参照するため Cookie に同期する */
export const ROLE_COOKIE_NAME = "levereed_role";
export const ROLE_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7日
/** マスターアカウント用：ビジネス会員モードで表示するか（テスト用） */
export const FORCE_BUSINESS_PREVIEW_KEY = "levereed_force_business_preview";
/** アップグレード直後フラグ（ぼかし解除アニメーション用） */
export const JUST_UPGRADED_KEY = "levereed_just_upgraded";
/** ヒアリング（20項目＋誓約）完了フラグ。一度完了したら二度とヒアリング画面を出さない（is_profile_completed 相当） */
export const HEARING_COMPLETED_KEY = "levereed_hearing_completed";

export type UserRole = "partner" | "business" | "life";

/** 神権限：このアドレスはDBを見ずに常に { role: 'PARTNER', is_profile_completed: true } を返す（要差し替え） */
export const KATAGAWA_EMAIL = "kizuna.doyagawa7@gmail.com";

export type SessionUser = {
  email: string;
  role: "PARTNER" | "BUSINESS" | "LIFE";
  is_profile_completed: boolean;
};

export type Session = {
  user: SessionUser;
};

/**
 * セッション取得。データベースを見る前に Katagawa さんのアドレスを検知したら強制的に神権限オブジェクトを返す。
 */
export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const email = getStoredUserEmail();
  if (!email) return null;
  const normalized = email.trim().toLowerCase();
  if (normalized === KATAGAWA_EMAIL.trim().toLowerCase()) {
    return {
      user: {
        email: normalized,
        role: "PARTNER",
        is_profile_completed: true,
      },
    };
  }
  return null;
}

/**
 * パートナー会員（有料・本契約済み）のメールリスト。
 */
export const PARTNER_EMAILS: string[] = [
  "kizuna.doyagawa7@gmail.com",
];

export const PARTNER_EMAIL = PARTNER_EMAILS[0] ?? "kizuna.doyagawa7@gmail.com";
export const MASTER_EMAIL = PARTNER_EMAIL;

export const BUSINESS_EMAILS: string[] = [
  "hikasametv@gmail.com",
];

export function isPartnerEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return PARTNER_EMAILS.some((allowed) => allowed.toLowerCase() === normalized);
}

export function isBusinessAllowedEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return BUSINESS_EMAILS.some((allowed) => allowed.toLowerCase() === normalized);
}

export function getStoredUserEmail(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY_EMAIL);
  } catch {
    return null;
  }
}

export function getRoleFromEmail(email: string | null): UserRole {
  if (!email) return "life";
  const normalized = email.trim().toLowerCase();
  if (isPartnerEmail(normalized)) return "partner";
  if (isBusinessAllowedEmail(normalized)) return "business";
  return "life";
}

export function getStoredUserRole(): UserRole {
  if (typeof window === "undefined") return "life";
  const session = getSession();
  if (session && session.user.role === "PARTNER") return "partner";
  if (session && session.user.role === "BUSINESS") return "business";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY_ROLE);
    if (stored === "partner" || stored === "business" || stored === "life") return stored;
    return getRoleFromEmail(getStoredUserEmail());
  } catch {
    return getRoleFromEmail(getStoredUserEmail());
  }
}

export function debugLogUserRole(): void {
  if (typeof window === "undefined") return;
  const role = getStoredUserRole();
  console.log("User Role:", role.toUpperCase());
}

export function isPartnerUser(): boolean {
  const session = getSession();
  if (session && session.user.role === "PARTNER") return true;
  return getStoredUserRole() === "partner";
}

export function isMasterUser(): boolean {
  const email = getStoredUserEmail();
  return email !== null && email.trim().toLowerCase() === MASTER_EMAIL.trim().toLowerCase();
}

export function getForceBusinessPreview(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(FORCE_BUSINESS_PREVIEW_KEY) === "1";
  } catch {
    return false;
  }
}

export function setForceBusinessPreview(value: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (value) {
      window.localStorage.setItem(FORCE_BUSINESS_PREVIEW_KEY, "1");
    } else {
      window.localStorage.removeItem(FORCE_BUSINESS_PREVIEW_KEY);
    }
  } catch {
    // ignore
  }
}

// --- 既存のリダイレクト処理（一時コメントアウト）---
// export function isPartnerUserEffective(): boolean {
//   if (isMasterUser() && getForceBusinessPreview()) return false;
//   return isPartnerUser();
// }
export function isPartnerUserEffective(): boolean {
  const session = getSession();
  if (session && session.user.role === "PARTNER" && session.user.is_profile_completed) return true;
  if (isMasterUser() && getForceBusinessPreview()) return false;
  return isPartnerUser();
}

// export function canAccessBusiness(): boolean {
//   const role = getStoredUserRole();
//   return role === "partner" || role === "business";
// }
export function canAccessBusiness(): boolean {
  const session = getSession();
  if (session && (session.user.role === "PARTNER" || session.user.role === "BUSINESS")) return true;
  const role = getStoredUserRole();
  return role === "partner" || role === "business";
}

// export function hasHearingCompleted(): boolean {
//   if (typeof window === "undefined") return false;
//   try {
//     const email = getStoredUserEmail();
//     if (email && email.trim().toLowerCase() === KATAGAWA_MASTER_EMAIL.trim().toLowerCase()) return true;
//     if (getStoredUserRole() === "partner") return true;
//     return window.localStorage.getItem(HEARING_COMPLETED_KEY) === "1";
//   } catch {
//     return false;
//   }
// }
export function hasHearingCompleted(): boolean {
  const session = getSession();
  if (session && session.user.is_profile_completed) return true;
  if (typeof window === "undefined") return false;
  try {
    if (getStoredUserRole() === "partner") return true;
    return window.localStorage.getItem(HEARING_COMPLETED_KEY) === "1";
  } catch {
    return false;
  }
}

/** ミドルウェア用：ロールを Cookie に書き、サーバー側ガードで参照する */
export function setRoleCookie(role: UserRole): void {
  if (typeof document === "undefined") return;
  try {
    document.cookie = `${ROLE_COOKIE_NAME}=${role}; path=/; max-age=${ROLE_COOKIE_MAX_AGE}; SameSite=Lax`;
  } catch {
    // ignore
  }
}

export function setStoredUserEmail(email: string): void {
  if (typeof window === "undefined") return;
  try {
    const normalized = email.trim().toLowerCase();
    window.localStorage.setItem(STORAGE_KEY_EMAIL, normalized);
    let role: UserRole = "life";
    if (normalized === KATAGAWA_EMAIL.trim().toLowerCase()) {
      window.localStorage.setItem(STORAGE_KEY_ROLE, "partner");
      window.localStorage.setItem(HEARING_COMPLETED_KEY, "1");
      role = "partner";
      debugLogUserRole();
      setRoleCookie(role);
      return;
    }
    role = getRoleFromEmail(normalized);
    window.localStorage.setItem(STORAGE_KEY_ROLE, role);
    if (role === "partner") {
      window.localStorage.setItem(HEARING_COMPLETED_KEY, "1");
    }
    debugLogUserRole();
    setRoleCookie(role);
  } catch {
    // ignore
  }
}

export function clearStoredUserEmail(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY_EMAIL);
    window.localStorage.removeItem(STORAGE_KEY_ROLE);
    if (typeof document !== "undefined") {
      document.cookie = `${ROLE_COOKIE_NAME}=; path=/; max-age=0`;
    }
  } catch {
    // ignore
  }
}
