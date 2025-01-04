# ベースイメージ
FROM node:18-alpine AS build

# 作業ディレクトリ設定
WORKDIR /app

# パッケージインストール
COPY package*.json ./

RUN npm install
RUN npm install react-router-dom @babel/plugin-proposal-private-property-in-object
COPY . .

# ビルド
RUN npm run build



EXPOSE 3000

# 起動
CMD ["npm", "start"]

