"use client";

import { useState, useRef, useEffect } from "react";

// ヒーロー用：最もおすすめの案件（背景はPV風ループ動画、読み込みまで静止画フォールバック）
const heroItems = [
  {
    id: "h1",
    tag: "産直野菜",
    title: "産直野菜の定期便で、毎週届く鮮度",
    description: "農家直送。月2万円節約した声も。送料込みでお得に続けられます。",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1400&q=85",
    video: "https://assets.mixkit.co/videos/preview/mixkit-woman-holding-vegetables-39765-large.mp4",
    cta: "ワンクリックで詳細",
  },
  {
    id: "h2",
    tag: "光熱費削減",
    title: "光熱費・通信費をまとめて見直し",
    description: "乗り換えで年間10万円お得になった事例多数。無料で比較できます。",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1400&q=85",
    video: "https://assets.mixkit.co/videos/preview/mixkit-happy-family-spending-time-in-the-park-33541-large.mp4",
    cta: "ワンクリックで詳細",
  },
  {
    id: "h3",
    tag: "オーガニック",
    title: "厳選オーガニック定期便",
    description: "無農薬・減農薬の野菜を毎週。体にやさしい選択を。",
    image: "https://images.unsplash.com/photo-1518843875459-f738682238a6?w=1400&q=85",
    video: "https://assets.mixkit.co/videos/preview/mixkit-peaceful-nature-reflections-101514-large.mp4",
    cta: "ワンクリックで詳細",
  },
];

// カテゴリ別：アグリ・ライフライン・スキルシェア（高品質画像URL付き）
const categoryRows = [
  {
    id: "agri",
    name: "アグリ・フード",
    subtitle: "新鮮野菜や農家直送のこだわり食材",
    items: [
      { id: "a1", title: "週1回 産直野菜ボックス", description: "旬の野菜が届く定期便。送料込み", price: "月4,980円〜", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=520&q=80" },
      { id: "a2", title: "無農薬米 5kg", description: "単品OK。まとめ買いでさらにお得", price: "2,980円〜", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=520&q=80" },
      { id: "a3", title: "果物の詰め合わせ", description: "季節の果物を産地から直送", price: "3,480円〜", image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=520&q=80" },
      { id: "a4", title: "卵・乳製品セット", description: "新鮮な卵と牛乳を定期配送", price: "月2,980円〜", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=520&q=80" },
      { id: "a5", title: "お肉産直パック", description: "国産豚・鶏をまとめてお得に", price: "4,980円〜", image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=520&q=80" },
    ],
  },
  {
    id: "life",
    name: "ライフライン・節約",
    subtitle: "電気・ガス代の削減や通信費の見直し",
    items: [
      { id: "l1", title: "電気・ガス乗り換え", description: "一括比較で最安プランに切り替え", price: "年間〜10万円節約", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=520&q=80" },
      { id: "l2", title: "スマホ料金見直し", description: "格安SIM・大手キャリアを比較", price: "月額〜3,000円削減", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=520&q=80" },
      { id: "l3", title: "保険見直し無料相談", description: "プロが最適なプランを提案", price: "無料", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=520&q=80" },
      { id: "l4", title: "インターネット回線", description: "光・ホームルーターを比較", price: "初回キャッシュバック", image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=520&q=80" },
      { id: "l5", title: "クレジットカード", description: "還元率・特典で選ぶ一枚", price: "年会費無料あり", image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=520&q=80" },
    ],
  },
  {
    id: "skill",
    name: "スキルシェア・その他",
    subtitle: "学びや生活を豊かにするサービス",
    items: [
      { id: "s1", title: "オンライン習い事", description: "語学・プログラミングなど", price: "月3,000円〜", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=520&q=80" },
      { id: "s2", title: "副業マッチング", description: "スキルを活かした仕事を紹介", price: "登録無料", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=520&q=80" },
      { id: "s3", title: "家事代行・便利サービス", description: "忙しい日も生活をサポート", price: "1回〜", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=520&q=80" },
      { id: "s4", title: "サブスク・定期便", description: "日用品や食品を定期お届け", price: "お試しあり", image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=520&q=80" },
      { id: "s5", title: "ポイント還元サービス", description: "買い物でポイント最大化", price: "還元率アップ", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=520&q=80" },
    ],
  },
];

type HeroItem = (typeof heroItems)[0];

/** ヒーロー1スライド：背景動画 + フォールバック静止画 + オーバーレイ + コピー（視認性確保） */
function HeroSlide({
  item,
  videoReady,
  onVideoReady,
}: {
  item: HeroItem;
  videoReady: boolean;
  onVideoReady: () => void;
}) {
  const videoSrc = item.video ?? null;

  return (
    <div className="relative aspect-[2.35/1] w-full min-h-[280px] max-h-[420px]">
      {/* フォールバック：動画読み込み完了まで静止画 */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity: videoReady && videoSrc ? 0 : 1 }}
        aria-hidden
      >
        <img src={item.image} alt="" className="h-full w-full object-cover" />
      </div>
      {/* 背景動画（muted / loop / autoPlay / playsInline） */}
      {videoSrc && (
        <video
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={onVideoReady}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: videoReady ? 1 : 0 }}
          poster={item.image}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
      {/* 半透明オーバーレイ（黒〜ロイヤルブルー寄りグラデーションで読みやすく） */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(15,23,42,0.92) 0%, rgba(30,58,138,0.25) 40%, transparent 100%)",
        }}
      />
      {/* コピー：drop-shadow・背景ぼかしで動画に埋もれない */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10">
        <div className="rounded-xl bg-black/25 px-4 py-3 backdrop-blur-sm sm:max-w-2xl sm:px-5 sm:py-4">
          <span
            className="text-xs font-semibold uppercase tracking-wider text-royal-blue"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
          >
            {item.tag}
          </span>
          <h2
            className="mt-2 text-2xl font-bold text-white sm:text-3xl md:text-4xl"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.2)" }}
          >
            {item.title}
          </h2>
          <p
            className="mt-2 max-w-xl text-sm text-slate-200 sm:text-base"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
          >
            {item.description}
          </p>
          <button
            type="button"
            className="mt-4 rounded-lg bg-action-orange px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            style={{
              boxShadow: "0 2px 12px rgba(255,122,47,0.4), 0 2px 8px rgba(0,0,0,0.3)",
              textShadow: "0 1px 2px rgba(0,0,0,0.4)",
            }}
          >
            {item.cta}
          </button>
        </div>
      </div>
    </div>
  );
}

/** ヒーローセクション：特大カルーセル（PV風ループ動画背景） */
function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [videoReadyById, setVideoReadyById] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }, [index]);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % heroItems.length), 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative w-full bg-slate-900" aria-label="おすすめ案件">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {heroItems.map((item) => (
          <div
            key={item.id}
            className="relative min-w-full flex-shrink-0 snap-center"
          >
            <HeroSlide
              item={item}
              videoReady={!!videoReadyById[item.id]}
              onVideoReady={() => setVideoReadyById((prev) => ({ ...prev, [item.id]: true }))}
            />
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-6">
        {heroItems.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-8 bg-action-orange" : "w-2 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`スライド ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

/** カテゴリ行内のカード（高品質画像・タイトル・ワンクリックボタン） */
function ProjectCard({
  title,
  description,
  price,
  image,
  onAction,
}: {
  title: string;
  description: string;
  price: string;
  image: string;
  onAction: () => void;
}) {
  return (
    <article className="group flex w-[280px] flex-shrink-0 snap-start sm:w-[300px]">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-royal-blue/40 hover:shadow-lg">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-levereed-navy line-clamp-2 text-base">
            {title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">{description}</p>
          <p className="mt-2 text-sm font-medium text-royal-blue">{price}</p>
          <button
            type="button"
            onClick={onAction}
            className="mt-3 w-full rounded-lg bg-action-orange py-2.5 text-sm font-medium text-white shadow-action-orange transition hover:opacity-90"
          >
            ワンクリックで詳細／注文
          </button>
        </div>
      </div>
    </article>
  );
}

/** カテゴリ別横スライド行 */
function CategoryRow({
  name,
  subtitle,
  items,
}: {
  name: string;
  subtitle: string;
  items: (typeof categoryRows)[0]["items"];
}) {
  return (
    <section className="py-6 first:pt-8 sm:py-8">
      <div className="mb-4 px-4 sm:px-6">
        <h2 className="text-lg font-semibold text-levereed-navy sm:text-xl">
          {name}
        </h2>
        <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
      </div>
      <div
        className="flex gap-4 overflow-x-auto px-4 pb-2 pt-1 scroll-smooth scrollbar-hide sm:gap-5 sm:px-6"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item) => (
          <ProjectCard
            key={item.id}
            title={item.title}
            description={item.description}
            price={item.price}
            image={item.image}
            onAction={() => {}}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * ユーザーモード：Amazonプライム・ビデオ風 横スライドUI
 * ヒーローカルーセル + アグリ / ライフライン・節約 / スキルシェアの3行
 */
export default function UserContent() {
  return (
    <div className="pb-16" style={{ backgroundColor: "#F0F2F5" }}>
      <HeroCarousel />
      <div className="mx-auto max-w-7xl">
        {categoryRows.map((row, index) => (
          <div
            key={row.id}
            id={index === 0 ? "preview-my-ad" : undefined}
          >
            <CategoryRow
              name={row.name}
              subtitle={row.subtitle}
              items={row.items}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
