# ランチョイス

##実行の際用意いただくもの
リクルートWEBサービスのホットペッパー グルメサーチAPI
https://webservice.recruit.co.jp/doc/hotpepper/reference.html

を用意してbackendディレクトリ下に.env.sampleを参考に.envを作成してください
---

## 主な機能

- **ランチチョイス機能**: 条件に合った飲食店の中からランダムに一つを選んでくれます。
- **サーチ機能**: 条件に合ったお店を表示できます。  

---

## 使用技術

### フロントエンド

- **React**
- **Next.js**
- **TailwindCSS**

### バックエンド

- **Python**
- **FastAPI**

---

## 環境構築

以下の手順に従って開発環境をセットアップしてください。

1. **Dockerコンテナを構築**:
   ```zsh
   docker-compose build

僕の環境だと100秒くらいかかったのでもし他にやることがなければTwitterとかyoutube見ててください
これとか時間もちょうど良くておすすめです。https://youtu.be/DqoVbYPIdRQ?si=6HuQNSH-xPQnRLzS

2. **Dockerコンテナを起動**
    ```zsh
    docker-compose up 
3. **ブラウザでアクセス**:  
   `http://localhost:3000/`
---

## 操作方法

1. **検索画面**:  
   好きなキーワードを入力し、絞りたい条件のオプションにチェックをつけ、検索をするとその条件に合ったお店が表示されます
   キーワードは無しや中華や和食といったジャンルでも、肉や魚などのアバウトなものでも構いません

2. **一覧画面**:  
   気になるお店をクリックすると詳細な情報が載ったページに移動します。

---

## API仕様書の確認
    Dockerコンテナを起動中にアクセスしてください

- **Swagger UI**:
  `http://localhost:3000/docs`
- **ReDoc**:
  `http://localhost:3000/redoc`
