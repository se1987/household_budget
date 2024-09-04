# Node.js lts image
FROM node:lts

# ワーキングディレクトリを指定
WORKDIR /usr/src/app

# 同一ディレクトリ内のファイルを全てコピー
COPY . .

# パッケージをインストール
RUN npm install

# 3000番ポートでリッスン
EXPOSE 3001

# React の起動
CMD ["npm", "run", "dev"]
