"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import UserContent from "@/app/dashboard/UserContent";
import LifePreviewPanel from "@/components/LifePreviewPanel";
import { isPartnerUser } from "@/lib/auth";
import { isLifePreviewMode } from "@/lib/preview";

/**
 * ライフモード専用ルート。
 * ビジネス会員が「ライフユーザーとして画面を確認する」で入った場合は
 * プレビューモードとなり、下部にコントロールパネルのみ表示しビジネス用UIは非表示。
 */
export default function LifePage() {
  const [isPartner, setIsPartner] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    setIsPartner(isPartnerUser());
    setPreviewMode(isLifePreviewMode());
  }, []);

  return (
    <AppShell current="life" previewMode={previewMode}>
      <UserContent />
      {isPartner && previewMode && (
        <>
          <div className="h-20 flex-shrink-0" aria-hidden />
          <LifePreviewPanel />
        </>
      )}
    </AppShell>
  );
}
