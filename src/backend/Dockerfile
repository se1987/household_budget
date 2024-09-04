# FROM node:lts

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install

# COPY . .

# RUN npx prisma generate

# CMD ["npm", "run", "dev"]
FROM node:lts

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Prismaのクライアントを生成
RUN npx prisma generate

# デフォルトのエントリーポイントをシェルスクリプトに変更
CMD ["sh", "-c", "npx prisma migrate && npm run dev"]
