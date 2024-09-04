import { Router } from "express";

const transactionsRouter = Router();

// <=============エンドポイント（/transactions）================>

// GET 入出金一覧
transactionsRouter.get("/", (req, res) => {
  res.send("入出金一覧を取得します");
});

// POST 収支入力
transactionsRouter.post("/", (req, res) => {
  res.send("収支を入力します");
});

// <=============エンドポイント（/transactions/:id）================>
// GET 入出金詳細
transactionsRouter.get("/:id", (req, res) => {
  res.send("入出金詳細を取得します");
});

// PUT 収支更新
transactionsRouter.put("/:id", (req, res) => {
  res.send("収支を更新します");
});

// DELETE 収支更新
transactionsRouter.delete("/:id", (req, res) => {
  res.send("収支を削除します");
});

export default transactionsRouter;
