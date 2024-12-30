# ベースイメージ
FROM python:3.10

# 作業ディレクトリ設定
WORKDIR /app

# パッケージインストール
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Flaskをコピー
COPY . .

# Flaskの起動
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
