/**
 * デモ用パートナー一覧（マッチング候補・依頼先）
 * partners ページと BusinessContent で共有
 */

import type { BusinessProfile } from "./matching";

export interface DemoPartner {
  id: string;
  name: string;
  contact: string;
  profile: BusinessProfile;
  agreed?: boolean;
  role?: string; // カード表示用ラベル
}

export const DEMO_PARTNERS: DemoPartner[] = [
  {
    id: "1",
    name: "田中 マーケティング",
    contact: "tanaka@example.com",
    agreed: true,
    role: "AIコンサル",
    profile: {
      resources: [1, 2, 4],
      problems: [2, 4, 8],
      target: { industry: 1, scale: 2, budget: 2 },
      hearing: { values: 2 },
    },
  },
  {
    id: "2",
    name: "山田 コンサル",
    contact: "yamada@example.com",
    agreed: false,
    role: "Webディレクター",
    profile: {
      resources: [6, 7],
      problems: [1, 3, 6],
      target: { industry: 5, scale: 3, budget: 3 },
      hearing: { values: 3 },
    },
  },
  {
    id: "3",
    name: "佐藤 デザイン事務所",
    contact: "sato@example.com",
    agreed: true,
    role: "デザイン",
    profile: {
      resources: [2, 7, 4],
      problems: [1, 4],
      target: { industry: 1, scale: 1, budget: 1 },
      hearing: { values: 2 },
    },
  },
];

export function getDemoPartnerById(id: string): DemoPartner | undefined {
  return DEMO_PARTNERS.find((p) => p.id === id);
}
