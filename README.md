# プリキュア カード・シール管理アプリ

React + Vite版の初期構成です。

## 起動
```bash
npm install
npm run dev
```

## 実装済み
- 3カテゴリの独立表示
- 検索、排出弾・レアリティ・シリーズ絞り込み
- 所持／未所持、お気に入り管理
- IndexedDB保存
- JSONバックアップ／復元

Cloudflare同期は `src/cloud/cloudflareBackup.js` の接続先を設定して有効化します。

## GitHub + Cloudflare Pages
Cloudflare Pages: Build command `npm run build`, output `dist`, production branch `main`.
環境変数 `VITE_BACKUP_API_URL` と `VITE_BACKUP_TOKEN` をPagesに設定してください。

## Cloudflare Worker + R2
```bash
cd worker
npm install
npx wrangler login
npx wrangler r2 bucket create precure-card-backups
npx wrangler secret put BACKUP_TOKEN
npx wrangler secret put ALLOWED_ORIGIN
npm run deploy
```
`ALLOWED_ORIGIN` にはPagesの本番URL（例: `https://precure-card-app.pages.dev`）を設定します。
