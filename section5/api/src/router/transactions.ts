import { Router } from 'express';
import Logger from '../context/logger';
import { PrismaClient } from '@prisma/client';

const transactionsRouter = Router();
const prisma = new PrismaClient(); // Prismaクライアントのインスタンス作成

// エンドポイント（/api/transactions）
// GETリクエスト
transactionsRouter.get('/', async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany(); // Prismaで取得
    res.send(transactions);
  } catch (error: unknown) {
    if (error instanceof Error) {
      Logger.error(`エラー: GET /api/transactions - ${error.message}`); // エラーログ
      res.status(500).send('サーバーエラーが発生しました');
    }
  }
});

// POSTリクエスト
transactionsRouter.post('/', async (req, res) => {
  const { amount, type, date, category, description } = req.body;
  // typeのパラメーターチェック
  if (type !== '支出' && type !== '収入') {
    throw 'Parameter is not assigned values!';
  }
  try {
    // カテゴリの 名前から id を取得
    const categoryData = await prisma.category.findFirst({
      where: { name: category },
    });
    if (!categoryData) {
      return res
        .status(400)
        .json({ error: `カテゴリーが見つかりません: ${category}` });
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        amount,
        type,
        date: new Date(date), // Date型に変換
        categoryId: categoryData.id,
        description,
      },
    });

    Logger.debug(`New transaction added: ${JSON.stringify(newTransaction)}`); // デバッグログ
    res.status(201).json(newTransaction);
  } catch (error: unknown) {
    if (error instanceof Error) {
      Logger.error(`エラー: POST /api/transactions - ${error.message}`); // エラーログ
      res.status(500).send('サーバーエラーが発生しました');
    }
  }
});

// エンドポイント（/api/transactions/:id）
// GETリクエスト
transactionsRouter.get('/:id', async (req, res) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (!transaction) {
    Logger.error(
      `Error: No matching transactions were found. id: ${req.params.id}`,
    ); // エラーログ
    res
      .status(404)
      .send(`該当する取引が見つかりませんでした id: ${req.params.id}`);
  } else {
    res.send(transaction);
  }
});

// PUTリクエスト
transactionsRouter.put('/:id', async (req, res) => {
  const { amount, type, date, category, description } = req.body;
  if (type !== '支出' && type !== '収入') {
    throw 'Parameter is not assigned values!';
  }
  try {
    // カテゴリの名前から id を取得
    const categoryData = await prisma.category.findFirst({
      where: { name: category },
    });
    if (!categoryData) {
      return res
        .status(400)
        .json({ error: `カテゴリーが見つかりません: ${category}` });
    }
    // 更新処理
    const updatedTransaction = await prisma.transaction.update({
      where: { id: parseInt(req.params.id) },
      data: {
        amount,
        type,
        date: new Date(date),
        categoryId: categoryData.id,
        description,
      },
    });
    res.send(updatedTransaction);
  } catch (error: unknown) {
    if (error instanceof Error) {
      Logger.error(
        `エラー: PUT /api/transactions/${req.params.id} - ${error.message}`,
      ); // エラーログ
      res.status(500).send('サーバーエラーが発生しました');
    }
  }
});

export default transactionsRouter;
