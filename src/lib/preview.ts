/**
 * ライフプレビューモード（ビジネス会員が一般ライフユーザー視点で確認する際のフラグ）
 * sessionStorage で管理し、タブを閉じるか「ビジネス画面に戻る」で解除
 */

const PREVIEW_KEY = "levereed_life_preview";

export function setLifePreviewMode(on: boolean): void {
  if (typeof window === "undefined") return;
  if (on) {
    window.sessionStorage.setItem(PREVIEW_KEY, "1");
  } else {
    window.sessionStorage.removeItem(PREVIEW_KEY);
  }
}

export function isLifePreviewMode(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(PREVIEW_KEY) === "1";
}
