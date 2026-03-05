/**
 * レバリード・ポイント制度（LEVEREAD ポイント制度ガイド準拠）
 * 1P = 1円相当。換金不可のプラットフォーム内限定通貨。
 */

/** 招待成功：ライフ会員の招待（一般ユーザーを招待） */
export const POINTS_INVITE_SUCCESS_LIFE = 1000;
/** 招待成功：ビジネス会員の招待（事業者を招待） */
export const POINTS_INVITE_SUCCESS_BUSINESS = 2000;
/** アップグレード祝金：招待した方がパートナー会員に移行した際 */
export const POINTS_PARTNER_UPGRADE = 10000;
/** プロフィール20項目完備（初回1回のみ） */
export const POINTS_PROFILE_COMPLETE = 1000;
/** マッチング成立（リファラルマッチで商談成立・双方の成約報告後） */
export const POINTS_MATCHING_SUCCESS = 2000;

/** 1P = 1円相当 */
export const POINTS_TO_YEN_RATE = 1;

export type PointEventType =
  | "invite_success_life"
  | "invite_success_business"
  | "partner_upgrade"
  | "profile_complete"
  | "matching_success"
  | "badge_purchase"
  | "ad_reservation";

export interface PointEvent {
  id: string;
  date: string;
  type: PointEventType;
  points: number;
  label: string;
  /** 広告予約時の表示日数（ランク適用）など */
  meta?: { displayDays?: number; badgeId?: string };
}

export const POINTS_BY_TYPE: Record<PointEventType, number> = {
  invite_success_life: POINTS_INVITE_SUCCESS_LIFE,
  invite_success_business: POINTS_INVITE_SUCCESS_BUSINESS,
  partner_upgrade: POINTS_PARTNER_UPGRADE,
  profile_complete: POINTS_PROFILE_COMPLETE,
  matching_success: POINTS_MATCHING_SUCCESS,
  badge_purchase: 0,
  ad_reservation: -10000,
};

export const LABEL_BY_TYPE: Record<PointEventType, string> = {
  invite_success_life: "招待成功（ライフ）",
  invite_success_business: "招待成功（ビジネス）",
  partner_upgrade: "アップグレード祝金",
  profile_complete: "プロフィール20項目完備",
  matching_success: "マッチング成立",
  badge_purchase: "バッジ購入",
  ad_reservation: "ライフ画面バナー広告予約",
};

/**
 * バッジは「累計」ではなく「ポイントを消費して取得」する仕組み。
 * BRONZE=初期、SILVER/GOLD/PLATINUM は表のポイントを消費して付与。
 */
export const BADGE_TIERS = [
  { id: "bronze", label: "ブロンズ", costToUnlock: 0 },
  { id: "silver", label: "シルバー", costToUnlock: 10000 },
  { id: "gold", label: "ゴールド", costToUnlock: 50000 },
  { id: "platinum", label: "プラチナ", costToUnlock: 100000 },
] as const;

export type BadgeId = (typeof BADGE_TIERS)[number]["id"];

/** バナー広告の基準単価（10,000P）。ランクに応じて表示日数が伸びる */
export const AD_RESERVATION_BASE_COST = 10000;

/**
 * ランク別・広告表示日数（同じ10,000P消費での優待）
 * BRONZE=標準7日、SILVER=10日、GOLD=14日、PLATINUM=30日
 */
export function getAdDisplayDaysForBadge(badgeId: string | null): number {
  switch (badgeId) {
    case "platinum":
      return 30;
    case "gold":
      return 14;
    case "silver":
      return 10;
    case "bronze":
    default:
      return 7;
  }
}

/** ターゲット指定（業種・地域絞り）は GOLD 以上で解放 */
export function isAdTargetingUnlockedForBadge(badgeId: string | null): boolean {
  return badgeId === "gold" || badgeId === "platinum";
}

/** 最優先表示（AIマッチング最上位固定）は PLATINUM のみ */
export function isAdTopPriorityForBadge(badgeId: string | null): boolean {
  return badgeId === "platinum";
}

/** 現在ランクで受けられる特典の短い説明 */
export function getAdBenefitLabelForBadge(badgeId: string | null): string {
  const days = getAdDisplayDaysForBadge(badgeId);
  switch (badgeId) {
    case "platinum":
      return `PLATINUM特典：最優先表示＋${days}日間表示適用中`;
    case "gold":
      return `GOLD特典：ターゲット指定＋${days}日間表示適用中`;
    case "silver":
      return `SILVER特典：表示期間${days}日間（+3日延長）適用中`;
    case "bronze":
    default:
      return `標準：${days}日間表示`;
  }
}

/** 次のランクに上げたときの広告メリット説明（アップセル用） */
export function getAdUpsellMessageForBadge(currentBadgeId: string | null): string | null {
  const currentDays = getAdDisplayDaysForBadge(currentBadgeId);
  if (currentBadgeId === "platinum") return null;
  if (currentBadgeId === "gold") {
    return "PLATINUMランクに上げると、AIマッチング最上位固定＋表示30日間の最優先表示が受けられます。";
  }
  if (currentBadgeId === "silver") {
    return "GOLDランクに上げると、業種・地域を絞った配信機能が解放され、表示期間が14日間に延長されます。";
  }
  if (currentBadgeId === "bronze" || !currentBadgeId) {
    return "SILVERランクに上げると、同じ10,000Pで10日間表示（3日延長）の優待が受けられます。";
  }
  return null;
}

/** 法的安全性の一行注釈（ポイント通帳などに必ず表示） */
export const POINTS_LEGAL_ONE_LINER = "レバリード・ポイントは換金不可の集客資産である。";

/** 資料から引用：法的安全性の説明（画面内に表示する文言） */
export const POINTS_LEGAL_DISCLAIMER =
  "レバリード・ポイントはプラットフォーム内でのみ利用可能な「サービス利用権」であり、換金性を持ちません。これにより、特定商取引法上の連鎖販売取引に該当するリスクを排除し、パートナーの皆様が堂々と周囲にサービスを紹介できる環境を整えています。" + POINTS_LEGAL_ONE_LINER;

export function calculateTotalPoints(events: PointEvent[]): number {
  return events.reduce((sum, e) => sum + e.points, 0);
}

export function pointsToYen(points: number): number {
  return points * POINTS_TO_YEN_RATE;
}

export function createPointEvent(
  id: string,
  date: string,
  type: PointEventType,
  pointsOverride?: number,
  meta?: PointEvent["meta"]
): PointEvent {
  const points = pointsOverride ?? POINTS_BY_TYPE[type];
  const label = LABEL_BY_TYPE[type];
  return { id, date, type, points, label, meta };
}

export const POINTS_EVENTS_STORAGE_KEY = "levereed_points_events";

export function createPartnerUpgradeEvent(): PointEvent {
  const now = new Date();
  const date = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}`;
  return createPointEvent(`partner-upgrade-${Date.now()}`, date, "partner_upgrade");
}

/** プロフィール20項目完備時（初回1回のみ）に呼ぶ */
export function createProfileCompleteEvent(): PointEvent {
  const now = new Date();
  const date = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}`;
  return createPointEvent(`profile-complete-${Date.now()}`, date, "profile_complete");
}

/** マッチング成立時（双方成約報告確認後）に呼ぶ */
export function createMatchingSuccessEvent(): PointEvent {
  const now = new Date();
  const date = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}`;
  return createPointEvent(`matching-success-${Date.now()}`, date, "matching_success");
}

export const BADGE_STORAGE_KEY = "levereed_selected_badge";
