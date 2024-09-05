import { Router } from "express";
import prisma from "../prisma";
import logger from "../context/logger";
import { getOrCreateCategoryId } from "../utils/categoryUtils";

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
    if (error instanceof Error) {
      logger.error(`♦♦エラー: GET /transactions - ${error.message}`);
      res.status(500).json({ error: "データの取得に失敗しました" });
    }
  }
});

// POST 収支入力
// リクエスト：
// レスポンス：transactions(API設計書(TransactionResponse))
transactionsRouter.post("/", async (req, res) => {
  const { amount, date, type, category, description } = req.body;
  logger.debug(`♦♦フロントエンドから送られたカテゴリー名: ${category}`);

  logger.debug(
    `♦♦transactionエンドポイントにPOSTリクエストが送信されました${req.body}`
  );
  try {
    // カテゴリーIDを取得または作成
    logger.debug(
      `♦♦カテゴリー名: ${category} からカテゴリーIDの取得または作成を開始`
    );
    // `amount` を数値に変換
    const amountInt = parseInt(amount, 10);
    if (isNaN(amountInt)) {
      throw new Error("金額が無効です: 数値ではありません");
    }
    logger.debug(`♦♦金額が正常に変換されました: ${amountInt}`);
    const categoryId = await getOrCreateCategoryId(category);
    logger.debug(`♦♦カテゴリーID取得完了: ${categoryId}`);

    // トランザクションを作成
    const newTransaction = await prisma.transaction.create({
      data: {
        amount: amountInt,
        date: new Date(date),
        type,
        categoryId,
        description,
      },
    });
    logger.debug(
      `♦♦収支情報が正常に登録されました: ${JSON.stringify(newTransaction)}`
    );
    res.status(201).json(newTransaction);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`♦♦エラー: POST /api/transactions - ${error.message}`);
      res.status(500).json({ error: "収支の作成に失敗しました" });
    }
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
      logger.debug(`♦♦${req}に該当する取引が見つかりません`);
      return res.status(404).json({ error: "該当する取引が見つかりません" });
    }
    logger.debug(`♦♦${transaction}が取得されました`);
    res.json(transaction);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`♦♦エラー: GET /transactions - ${error.message}`);
      res.status(500).json({ error: "取引の詳細取得に失敗しました" });
    }
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
    logger.debug(`♦♦${transaction}が正常に更新されました`);
    res.json(transaction);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`♦♦エラー: PUT /transactions - ${error.message}`);
      res.status(500).json({ error: "収支の更新に失敗しました" });
    }
  }
});

// DELETE 収支更新
transactionsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.transaction.delete({
      where: { id: parseInt(req.params.id) },
    });
    logger.debug(`♦♦${req}が正常に削除されました`);
    res.json({ message: "収支を削除しました" });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`♦♦エラー: DELETE /transactions - ${error.message}`);
      res.status(500).json({ error: "収支の削除に失敗しました" });
    }
  }
});

export default transactionsRouter;
