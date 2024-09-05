import dotenv from "dotenv";
import express from "express";
import logger from "./context/logger";
import morgan from "morgan";
import transactionsRouter from "./router/transactions";
import userRouter from "./router/user";
import categoriesRouter from "./router/categories";
import cors from "cors";

// 環境変数の設定
dotenv.config();

const app = express();
app.use(express.json()); // JSONをパースするためのミドルウェア
const port = 4000;

// morganの設定: winstonにログを送る
const stream = {
  write: (message: string) => logger.debug(message.trim()),
};
// morganミドルウェア設定
app.use(morgan("combined", { stream }));

// CORSミドルウェアを設定
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3001", // アクセスを許可するオリジン
    credentials: true, // クレデンシャル (Cookie など) を許可
  })
);
// エンドポイントのルーティング設定
app.use("/user", userRouter);
app.use("/transactions", transactionsRouter);
app.use("/categories", categoriesRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// サーバーの起動確認
app.listen(port, () => {
  logger.info(`♦♦Server running on http://localhost:${port}`);
});
