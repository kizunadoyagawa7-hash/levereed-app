#!/bin/bash
# Cursor で npm が PATH にない場合の起動用。/usr/local/bin を前置して dev サーバーを起動する。
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
cd "$(dirname "$0")/.."
if command -v npm >/dev/null 2>&1; then
  exec npm run dev
elif command -v bun >/dev/null 2>&1; then
  exec bun run dev
elif command -v yarn >/dev/null 2>&1; then
  exec yarn dev
else
  echo "npm / bun / yarn のいずれかをインストールするか、PATH に追加してください。"
  echo "例: export PATH=\"/usr/local/bin:\$PATH\""
  exit 1
fi
