"use client";

/**
 * ユーザーモード用メインビジュアル：産直野菜・節約イメージのクリーンな画像
 */
export default function UserHero() {
  return (
    <section className="relative w-full overflow-hidden bg-slate-100">
      <div className="relative aspect-[2.4/1] max-h-[320px] min-h-[200px] w-full">
        {/* 産直野菜の鮮やかな写真（Unsplash） */}
        <img
          src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&q=80"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-levereed-navy">
          <p className="text-sm font-medium text-levereed-neon-blue">お得な暮らしはここから</p>
          <h2 className="mt-1 text-xl font-bold sm:text-2xl">産直・節約で、毎日をもっと快適に</h2>
        </div>
      </div>
    </section>
  );
}
