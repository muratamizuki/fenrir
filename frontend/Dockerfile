# ベースイメージ
FROM node:18-alpine AS builder

# 作業ディレクトリ設定
WORKDIR /app

# パッケージコピー
COPY package.json yarn.lock ./

# パッケージインストール
RUN yarn install

# ソースコードをコピー
COPY . .

# ビルド
RUN NODE_OPTIONS=--max_old_space_size=8192 yarn build

FROM node:18-alpine

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# ポート公開
EXPOSE 3000

# 起動コマンド
CMD ["yarn", "start"]
