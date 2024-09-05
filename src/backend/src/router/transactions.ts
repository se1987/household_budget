import { Router } from "express";
import prisma from "../prisma";

const transactionsRouter = Router();

// <=============エンドポイント（/transactions）================>

// GET 入出金一覧
// リクエスト：なし
// レスポンス：transactions(API設計書(TransactionResponse))
transactionsRouter.get("/", async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        category: true,
      },
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "データの取得に失敗しました" });
  }
});

// POST 収支入力
// リクエスト：
// レスポンス：transactions(API設計書(TransactionResponse))
transactionsRouter.post("/", async (req, res) => {
  const { amount, date, type, categoryId, description } = req.body;
  try {
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        date: new Date(date),
        type,
        categoryId,
        description,
      },
    });
    res.json(transaction);
  } catch {
    res.status(500).json({ error: "収支の作成に失敗しました" });
  }
});

// <=============エンドポイント（/transactions/:id）================>
// GET 入出金詳細
transactionsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        category: true,
      },
    });
    if (!transaction) {
      return res.status(404).json({ error: "該当する取引が見つかりません" });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: "取引の詳細取得に失敗しました" });
  }
});

// PUT 収支更新
transactionsRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { amount, date, type, categoryId, description } = req.body;
  try {
    const transaction = await prisma.transaction.update({
      where: { id: parseInt(req.params.id) },
      data: {
        amount,
        date: new Date(date),
        type,
        categoryId,
        description,
      },
    });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: "収支の更新に失敗しました" });
  }
});

// DELETE 収支更新
transactionsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.transaction.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: "収支を削除しました" });
  } catch (error) {
    res.status(500).json({ error: "収支の削除に失敗しました" });
  }
});

export default transactionsRouter;
