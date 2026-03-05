# レバリード（Levereed）デモ

ビジネスマッチングアプリのデモ機です。Next.js（App Router）と Tailwind CSS で構築しています。

## セットアップ

```bash
npm install
```

## 環境変数

Supabase を使う場合は `.env.local.example` をコピーして `.env.local` を作成し、値を設定してください。

```bash
cp .env.local.example .env.local
```

- `NEXT_PUBLIC_SUPABASE_URL` … Supabase プロジェクトの URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` … Supabase の Anon Key

## 開発サーバー

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと、ログイン画面にリダイレクトされます。

## フォルダ構成

```
src/
├── app/
│   ├── layout.tsx      # ルートレイアウト
│   ├── page.tsx        # トップ（/login へリダイレクト）
│   ├── globals.css     # グローバルスタイル
│   └── login/
│       └── page.tsx    # ログイン画面
└── lib/
    └── supabase.ts     # Supabase クライアント（フロント用）
```

## ブランドカラー

- ネオンブルー: `#00d4ff`
- ネオングリーン: `#00ff88`
- ネイビー: `#0a1628`

Tailwind では `levereed-neon-blue`、`levereed-neon-green`、`levereed-navy` などで利用できます。
