/**
 * マッチング依頼・お知らせログの型とローカルストレージ管理
 * デモ用：currentUserId = "me"。本番では認証から取得。
 */

import type { BusinessProfile } from "./matching";

export const CURRENT_USER_ID = "me";

const STORAGE_REQUESTS = "levereed_match_requests";
const STORAGE_NOTIFICATIONS = "levereed_notification_log";

export type MatchRequestStatus = "pending" | "approved" | "declined";

export interface MatchRequest {
  id: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  status: MatchRequestStatus;
  fromProfile: BusinessProfile;
  reason: string;
  createdAt: string; // ISO
}

export type NotificationType = "match_request" | "match_approved" | "match_declined";

export interface NotificationEntry {
  id: string;
  type: NotificationType;
  requestId: string;
  fromId: string;
  toId: string;
  fromName?: string;
  toName?: string;
  title: string;
  body: string;
  createdAt: string;
  read?: boolean;
}

function genId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function genNotifId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function getRequests(): MatchRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_REQUESTS);
    if (!raw) return [];
    return JSON.parse(raw) as MatchRequest[];
  } catch {
    return [];
  }
}

function setRequests(list: MatchRequest[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_REQUESTS, JSON.stringify(list));
}

function getNotifications(): NotificationEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_NOTIFICATIONS);
    if (!raw) return [];
    return JSON.parse(raw) as NotificationEntry[];
  } catch {
    return [];
  }
}

function setNotifications(list: NotificationEntry[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_NOTIFICATIONS, JSON.stringify(list));
}

/** 自分が送った依頼でまだ返答待ちの toId 一覧 */
export function getPendingRequestToIds(): string[] {
  const list = getRequests();
  return list
    .filter((r) => r.fromId === CURRENT_USER_ID && r.status === "pending")
    .map((r) => r.toId);
}

/** 自分が受信した未対応の依頼一覧 */
export function getIncomingRequests(): MatchRequest[] {
  const list = getRequests();
  return list
    .filter((r) => r.toId === CURRENT_USER_ID && r.status === "pending")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/** 依頼を送信：依頼作成 + 受信者へ通知追加 */
export function sendMatchRequest(params: {
  toId: string;
  toName: string;
  fromName: string;
  fromProfile: BusinessProfile;
  reason: string;
}): MatchRequest {
  const id = genId();
  const now = new Date().toISOString();
  const req: MatchRequest = {
    id,
    fromId: CURRENT_USER_ID,
    fromName: params.fromName,
    toId: params.toId,
    toName: params.toName,
    status: "pending",
    fromProfile: params.fromProfile,
    reason: params.reason,
    createdAt: now,
  };
  const requests = getRequests();
  requests.push(req);
  setRequests(requests);

  const notif: NotificationEntry = {
    id: genNotifId(),
    type: "match_request",
    requestId: id,
    fromId: CURRENT_USER_ID,
    toId: params.toId,
    fromName: params.fromName,
    toName: params.toName,
    title: "マッチング依頼が届きました",
    body: `${params.fromName} さんからマッチング依頼が届いています。詳細を確認して承認または辞退してください。`,
    createdAt: now,
  };
  const notifs = getNotifications();
  notifs.unshift(notif);
  setNotifications(notifs);

  return req;
}

/** IDで依頼を取得 */
export function getRequestById(requestId: string): MatchRequest | null {
  return getRequests().find((r) => r.id === requestId) ?? null;
}

/** 承認：status 更新 + 双方に通知 */
export function approveMatchRequest(requestId: string): void {
  const requests = getRequests();
  const idx = requests.findIndex((r) => r.id === requestId);
  if (idx < 0) return;
  requests[idx].status = "approved";
  setRequests(requests);

  const req = requests[idx];
  const now = new Date().toISOString();
  const body = `${req.fromName} さんと ${req.toName} さんのマッチングが成立しました。連絡用チャットまたは次のステップへ進めます。`;

  const notifs = getNotifications();
  notifs.unshift(
    { id: genNotifId(), type: "match_approved", requestId, fromId: req.fromId, toId: req.fromId, fromName: req.fromName, toName: req.toName, title: "マッチング成立！", body, createdAt: now },
    { id: genNotifId(), type: "match_approved", requestId, fromId: req.fromId, toId: req.toId, fromName: req.fromName, toName: req.toName, title: "マッチング成立！", body, createdAt: now }
  );
  setNotifications(notifs);
}

/** 辞退：status 更新 + 依頼主に通知 */
export function declineMatchRequest(requestId: string): void {
  const requests = getRequests();
  const idx = requests.findIndex((r) => r.id === requestId);
  if (idx < 0) return;
  requests[idx].status = "declined";
  setRequests(requests);

  const req = requests[idx];
  const now = new Date().toISOString();

  const notifs = getNotifications();
  notifs.unshift({
    id: genNotifId(),
    type: "match_declined",
    requestId,
    fromId: req.toId,
    toId: req.fromId,
    fromName: req.toName,
    toName: req.fromName,
    title: "返答がありました",
    body: "今回は条件が合いませんでした。またの機会にご検討ください。",
    createdAt: now,
  });
  setNotifications(notifs);
}

/** お知らせログ：自分宛ての通知を新しい順で取得 */
export function getNotificationsForCurrentUser(): NotificationEntry[] {
  const list = getNotifications();
  return list
    .filter((n) => n.toId === CURRENT_USER_ID || (n.type === "match_approved" && (n.fromId === CURRENT_USER_ID || n.toId === CURRENT_USER_ID)))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/** お知らせログ：自分が送信・受信のどちらかに関わっている通知すべて */
export function getAllNotificationLogForCurrentUser(): NotificationEntry[] {
  const list = getNotifications();
  return list
    .filter((n) => n.toId === CURRENT_USER_ID || n.fromId === CURRENT_USER_ID)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/** デモ用：自分宛ての依頼が0件のとき1件だけシード（山田→me） */
export function seedIncomingRequestIfEmpty(seed: { fromId: string; fromName: string; toName: string; fromProfile: BusinessProfile; reason: string }): void {
  if (getIncomingRequests().length > 0) return;
  const id = genId();
  const now = new Date().toISOString();
  const req: MatchRequest = {
    id,
    fromId: seed.fromId,
    fromName: seed.fromName,
    toId: CURRENT_USER_ID,
    toName: seed.toName,
    status: "pending",
    fromProfile: seed.fromProfile,
    reason: seed.reason,
    createdAt: now,
  };
  const requests = getRequests();
  requests.push(req);
  setRequests(requests);
  const notifs = getNotifications();
  notifs.unshift({
    id: genNotifId(),
    type: "match_request",
    requestId: id,
    fromId: seed.fromId,
    toId: CURRENT_USER_ID,
    fromName: seed.fromName,
    toName: seed.toName,
    title: "マッチング依頼が届きました",
    body: `${seed.fromName} さんからマッチング依頼が届いています。詳細を確認して承認または辞退してください。`,
    createdAt: now,
  });
  setNotifications(notifs);
}
