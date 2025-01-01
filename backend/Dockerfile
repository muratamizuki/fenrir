# ベースイメージ
FROM python:3.10

# 作業ディレクトリ設定
WORKDIR /app

# 依存ライブラリのインストール
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードのコピー
COPY . .

# PYTHONPATHを設定
ENV PYTHONPATH=/app

EXPOSE 5000

# Flaskアプリケーションの起動
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
