/**
 * AIヒアリング・マッチング用の型とオプション
 * ベクトル化可能な構造（数値IDの配列・オブジェクト）
 */

export interface OptionItem {
  id: number;
  label: string;
}

/** 提供可能なリソース（選択肢 = ベクトル次元） */
export const RESOURCE_OPTIONS: OptionItem[] = [
  { id: 1, label: "SNS集客" },
  { id: 2, label: "Web制作" },
  { id: 3, label: "営業代行" },
  { id: 4, label: "ライティング" },
  { id: 5, label: "動画編集" },
  { id: 6, label: "コンサルティング" },
  { id: 7, label: "デザイン" },
  { id: 8, label: "システム開発" },
];

/** 解決したい悩み（選択肢 = ベクトル次元） */
export const PROBLEM_OPTIONS: OptionItem[] = [
  { id: 1, label: "リード不足" },
  { id: 2, label: "クロージング率の向上" },
  { id: 3, label: "ライフラインのコスト削減" },
  { id: 4, label: "認知度・集客" },
  { id: 5, label: "人材・採用" },
  { id: 6, label: "業務効率化" },
  { id: 7, label: "資金調達" },
  { id: 8, label: "マーケティング" },
];

/** ターゲット層：業種 */
export const TARGET_INDUSTRY_OPTIONS: OptionItem[] = [
  { id: 0, label: "指定なし" },
  { id: 1, label: "IT・Web" },
  { id: 2, label: "小売・EC" },
  { id: 3, label: "サービス業" },
  { id: 4, label: "製造業" },
  { id: 5, label: "士業・コンサル" },
  { id: 6, label: "医療・介護" },
  { id: 7, label: "その他" },
];

/** ターゲット層：規模（数値化用） */
export const TARGET_SCALE_OPTIONS: OptionItem[] = [
  { id: 0, label: "指定なし" },
  { id: 1, label: "個人・フリーランス" },
  { id: 2, label: "スタートアップ（〜10名）" },
  { id: 3, label: "中小企業（〜100名）" },
  { id: 4, label: "中堅以上（100名〜）" },
];

/** ターゲット層：予算感（数値化用） */
export const TARGET_BUDGET_OPTIONS: OptionItem[] = [
  { id: 0, label: "指定なし" },
  { id: 1, label: "〜10万円" },
  { id: 2, label: "10万〜50万円" },
  { id: 3, label: "50万〜100万円" },
  { id: 4, label: "100万円〜" },
];

/** 20項目ヒアリングの1問の定義 */
export interface HearingQuestion {
  id: string;
  label: string;
  type: "text" | "select" | "multiselect";
  options?: OptionItem[];
  placeholder?: string;
}

/** 20項目のAIヒアリング質問（ビジネス解像度を高める） */
export const HEARING_QUESTIONS: HearingQuestion[] = [
  { id: "domain", label: "現在の事業ドメイン・主なサービス", type: "text", placeholder: "例：BtoB SaaS、Web制作、コンサル" },
  { id: "problems", label: "解決したい課題（複数可）", type: "multiselect", options: PROBLEM_OPTIONS },
  { id: "resources", label: "保有するリソース（技術・人脈など）", type: "multiselect", options: RESOURCE_OPTIONS },
  { id: "targetIndustry", label: "想定ターゲットの業種", type: "select", options: TARGET_INDUSTRY_OPTIONS },
  { id: "targetScale", label: "想定ターゲットの規模", type: "select", options: TARGET_SCALE_OPTIONS },
  { id: "targetBudget", label: "想定予算感", type: "select", options: TARGET_BUDGET_OPTIONS },
  { id: "partnerTraits", label: "求めるパートナーの性格・スタイル", type: "text", placeholder: "例：スピード感、丁寧なコミュニケーション" },
  { id: "collaborationHistory", label: "過去の協業実績（あれば）", type: "text", placeholder: "例：共同企画、紹介成約" },
  { id: "vision", label: "1〜3年後のビジョン", type: "text", placeholder: "例：月商500万、チーム化" },
  { id: "snsUsage", label: "SNS運用状況", type: "select", options: [{ id: 0, label: "未活用" }, { id: 1, label: "少しやっている" }, { id: 2, label: "積極的に運用中" }, { id: 3, label: "代行に任せたい" }] },
  { id: "leadTime", label: "成約までの想定リードタイム", type: "select", options: [{ id: 1, label: "即〜1ヶ月" }, { id: 2, label: "1〜3ヶ月" }, { id: 3, label: "3ヶ月〜半年" }, { id: 4, label: "半年〜" }] },
  { id: "values", label: "最も重視する価値観", type: "select", options: [{ id: 1, label: "スピード" }, { id: 2, label: "信頼・長期関係" }, { id: 3, label: "収益最大化" }, { id: 4, label: "学び・成長" }, { id: 5, label: "社会貢献" }] },
  { id: "strength", label: "自社の強み（一言で）", type: "text", placeholder: "例：スピード、専門性" },
  { id: "weakness", label: "補いたい弱み", type: "text", placeholder: "例：営業力、認知" },
  { id: "introStyle", label: "紹介で得意なこと", type: "text", placeholder: "例：同業種への紹介" },
  { id: "wantIntro", label: "紹介してほしい相手像", type: "text", placeholder: "例：経営者、マーケ担当" },
  { id: "monthlyGoal", label: "月間の成約・紹介目標（目安）", type: "text", placeholder: "例：紹介2件、成約1件" },
  { id: "communication", label: "希望する連絡頻度", type: "select", options: [{ id: 1, label: "週1回以上" }, { id: 2, label: "月2〜4回" }, { id: 3, label: "月1回程度" }, { id: 4, label: "案件時のみ" }] },
  { id: "dealBreaker", label: "協業で避けたいこと", type: "text", placeholder: "例：一方的な依頼" },
  { id: "other", label: "追加で伝えたいこと", type: "text", placeholder: "自由記述" },
];

/**
 * 事業者プロフィール（ベクトルデータ + 20項目ヒアリング回答）
 */
export interface BusinessProfile {
  resources: number[];
  problems: number[];
  target: {
    industry: number;
    scale: number;
    budget: number;
  };
  /** 20項目ヒアリングの回答（id → 文字列 / 単一数値 / 数値配列） */
  hearing?: Record<string, string | number | number[]>;
}

/** 空のプロフィール */
export function emptyProfile(): BusinessProfile {
  return {
    resources: [],
    problems: [],
    target: { industry: 0, scale: 0, budget: 0 },
    hearing: {},
  };
}

/** ヒアリング回答から profile.resources / problems / target を同期 */
export function syncProfileFromHearing(p: BusinessProfile): BusinessProfile {
  const h = p.hearing ?? {};
  const num = (v: unknown) => (typeof v === "number" ? v : Array.isArray(v) ? (v[0] as number) : Number(v) || 0);
  return {
    ...p,
    resources: Array.isArray(h.resources) ? (h.resources as number[]) : p.resources,
    problems: Array.isArray(h.problems) ? (h.problems as number[]) : p.problems,
    target: {
      industry: num(h.targetIndustry) || p.target.industry,
      scale: num(h.targetScale) || p.target.scale,
      budget: num(h.targetBudget) || p.target.budget,
    },
  };
}

/**
 * プロフィールをフラットな数値ベクトルに変換（類似度計算・DB保存用）
 */
export function profileToVector(p: BusinessProfile): number[] {
  const resourceVec = RESOURCE_OPTIONS.map((o) => (p.resources.includes(o.id) ? 1 : 0));
  const problemVec = PROBLEM_OPTIONS.map((o) => (p.problems.includes(o.id) ? 1 : 0));
  const targetVec = [
    p.target.industry / Math.max(...TARGET_INDUSTRY_OPTIONS.map((o) => o.id), 1),
    p.target.scale / Math.max(...TARGET_SCALE_OPTIONS.map((o) => o.id), 1),
    p.target.budget / Math.max(...TARGET_BUDGET_OPTIONS.map((o) => o.id), 1),
  ];
  return [...resourceVec, ...problemVec, ...targetVec];
}

/**
 * 2つのプロフィールの相性スコア（0〜100%）を計算
 * 補完関係: AのリソースがBの悩みを解決し、BのリソースがAの悩みを解決 → 高スコア
 */
export function computeMatchScore(a: BusinessProfile, b: BusinessProfile): number {
  // リソース・悩みの補完性: AのリソースとBの悩みの重なり + 逆
  const aResolveB = a.resources.filter((r) => b.problems.length === 0 || b.problems.some((p) => overlapWeight(r, p))).length;
  const bResolveA = b.resources.filter((r) => a.problems.length === 0 || a.problems.some((p) => overlapWeight(r, p))).length;
  const resourceProblemScore = Math.min(100, ((aResolveB + bResolveA) / (Math.max(a.resources.length + b.resources.length, 1) + Math.max(a.problems.length + b.problems.length, 1))) * 80);

  // 共通リソース（競合でなく協業の可能性）は少し加点
  const commonResources = a.resources.filter((r) => b.resources.includes(r)).length;
  const commonBonus = Math.min(20, commonResources * 5);

  // ターゲットの近さ（同じなら相性良いと仮定）
  let targetScore = 0;
  if (a.target.industry === b.target.industry && a.target.industry > 0) targetScore += 10;
  if (a.target.scale === b.target.scale && a.target.scale > 0) targetScore += 5;
  if (a.target.budget === b.target.budget && a.target.budget > 0) targetScore += 5;

  const total = Math.round(Math.min(100, resourceProblemScore + commonBonus + targetScore));
  return Math.max(0, total);
}

function overlapWeight(_r: number, _p: number): boolean {
  return true; // 簡易: どれか選んでいれば補完可能性あり
}

/**
 * 相性理由を自動生成（20項目の回答を反映した具体的な理由）
 * ターゲット層の補完、スキルの相乗効果、価値観の一致などを含む
 */
export function generateMatchReason(
  a: BusinessProfile,
  b: BusinessProfile,
  score: number
): string {
  const reasons: string[] = [];
  const aResolveB = a.resources.length > 0 && b.problems.length > 0;
  const bResolveA = b.resources.length > 0 && a.problems.length > 0;
  if (aResolveB && bResolveA) reasons.push("お互いのスキルが補完関係にあり、ニーズと提供が一致しています。");
  else if (aResolveB) reasons.push("ご提供リソースが相手の悩みの解決に役立つと判定されました。");
  else if (bResolveA) reasons.push("相手のリソースが、あなたの課題解決に役立つと判定されました。");

  const common = a.resources.filter((r) => b.resources.includes(r)).length;
  if (common > 0) reasons.push("同じ強みを持ち、協業や紹介し合える相乗効果が期待できます。");

  if (a.target.industry === b.target.industry && a.target.industry > 0)
    reasons.push("ターゲット層の業種が近く、紹介しやすい関係です。");
  if (a.target.scale === b.target.scale && a.target.scale > 0)
    reasons.push("想定規模が一致しており、案件の相性が良いです。");

  const aVal = a.hearing?.values;
  const bVal = b.hearing?.values;
  const aValues = Array.isArray(aVal) ? (aVal as number[])[0] : (aVal as number | undefined);
  const bValues = Array.isArray(bVal) ? (bVal as number[])[0] : (bVal as number | undefined);
  if (typeof aValues === "number" && typeof bValues === "number" && aValues === bValues)
    reasons.push("重視する価値観が一致しており、長期的な協業に向いています。");

  if (reasons.length > 0) return reasons.join(" ");
  if (score >= 70) return "ターゲット層・リソースの組み合わせから、ビジネス相性が良いと判定されました。";
  return "プロフィールの組み合わせから、相性が良いと判定されました。";
}
