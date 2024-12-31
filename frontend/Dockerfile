# ベースイメージ
FROM node:14-alpine

# 作業ディレクトリ設定
WORKDIR /app

# パッケージインストール
COPY package*.json ./

RUN npm install

COPY . .

# ビルド
RUN npm run build


EXPOSE 3000

# 起動
CMD ["npm", "start"]

