# ベースイメージ
FROM python:3.10

# 作業ディレクトリ設定
WORKDIR /app

# 依存ライブラリのインストール
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# コピー
COPY . .


EXPOSE 8000

# Flaskアプリケーションの起動
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

