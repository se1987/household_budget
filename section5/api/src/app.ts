require('dotenv').config();
import express from 'express';
const cors = require('cors');
// import userRouter from './router/user';
import logger from './context/logger';
import morgan from 'morgan'; //アクセスログ
import transactionsRouter from './router/transactions';
import categoriesRouter from './router/categories';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = 4000;

// ミドルウェアの設定
app.use(express.json());

// morganの設定: winstonにログを送る
const stream = {
    write: (message: string) => logger.info(message.trim())
} ;
// morganミドルウェア設定
app.use(morgan('combined', {stream}));

// CORSミドルウェアを設定
app.use(cors({
  origin: 'http://localhost:3001', // アクセスを許可するオリジン
  credentials: true, // クレデンシャル (Cookie など) を許可
}));
// Prismaクライアントをミドルウェアとして渡す
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});
// エンドポイントの設定
// app.use('/user', userRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/transactions', transactionsRouter);

// サーバーの起動確認
app.listen(port, async() => {
  await prisma.$connect();
  console.log(`Server running on http://localhost:${port}`);
});

