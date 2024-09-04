import { Router } from 'express';
import Logger from '../context/logger';
import { PrismaClient } from '@prisma/client';

const transactionsRouter = Router();
const prisma = new PrismaClient(); // Prismaクライアントのインスタンス作成

// エンドポイント（/api/transactions）
// GETリクエスト
transactionsRouter.get('/', async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        category: true,
      },
    }); // Prismaでデータベース内のデータ取得
    const transactionsWithCategoryName = transactions.map((transaction) => ({
      ...transaction,
      category: transaction.category.name,
    }));
    res.send(transactionsWithCategoryName);
  } catch (error: unknown) {
    if (error instanceof Error) {
      Logger.error(`エラー: GET /api/transactions - ${error.message}`); // エラーログ
      res.status(500).send('サーバーエラーが発生しました');
    }
  }
});

// POSTリクエスト
transactionsRouter.post('/', async (req, res) => {
  try {
    const { amount, type, date, category, description } = req.body;
    // 入力検証
    if (!amount || !type || !date || !category) {
      Logger.error('無効な入力です: 必須フィールドが欠落しています');
      return res.status(400).json({
        error: '無効な入力です: 必須フィールドが欠落しています',
      });
    }
    // amountを整数に変換
    const amountInt = parseInt(amount, 10);
    if (isNaN(amountInt)) {
      Logger.error('無効な入力です: amountは数値でなければなりません');
      return res.status(400).json({
        error: '無効な入力です: amountは数値でなければなりません',
      });
    }
    if (amountInt <= 0) {
      Logger.error('無効な入力です: 金額は正の値でなければなりません');
      return res.status(400).json({
        error: '無効な入力です: 金額は正の値でなければなりません',
      });
    }

    if (!['支出', '収入'].includes(type)) {
      Logger.error(
        '無効な入力です: typeは"支出"または"収入"でなければなりません',
      );
      return res.status(400).json({
        error: '無効な入力です: typeは"支出"または"収入"でなければなりません',
      });
    }

    // 日付のバリデーション
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      Logger.error('無効な入力です: 日付フォーマットが不正です');
      return res.status(400).json({
        error: '無効な入力です: 日付フォーマットが不正です',
      });
    }
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
        amount: amountInt,
        type,
        date: parsedDate, // Date型に変換
        categoryId: categoryData.id,
        description: description || '',
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
    include: {
      category: true,
    },
  });
  if (!transaction) {
    Logger.error(`該当する取引が見つかりませんでした id: ${req.params.id}`); // エラーログ
    res
      .status(404)
      .send(`該当する取引が見つかりませんでした id: ${req.params.id}`);
  } else {
    res.send(transaction);
  }
});

// PUTリクエスト
transactionsRouter.put('/:id', async (req, res) => {
  try {
    const { amount, type, date, category, description } = req.body;
    // 入力検証
    if (!amount || !type || !date || !category) {
      Logger.error('無効な入力です: 必須フィールドが欠落しています');
      return res.status(400).json({
        error: '無効な入力です: 必須フィールドが欠落しています',
      });
    }
    // amountを整数に変換
    const amountInt = parseInt(amount, 10);
    if (isNaN(amountInt)) {
      Logger.error('無効な入力です: amountは数値でなければなりません');
      return res.status(400).json({
        error: '無効な入力です: amountは数値でなければなりません',
      });
    }
    if (amountInt <= 0) {
      Logger.error('無効な入力です: 金額は正の値でなければなりません');
      return res.status(400).json({
        error: '無効な入力です: 金額は正の値でなければなりません',
      });
    }
    if (!['支出', '収入'].includes(type)) {
      Logger.error(
        '無効な入力です: typeは"支出"または"収入"でなければなりません',
      );
      return res.status(400).json({
        error: '無効な入力です: typeは"支出"または"収入"でなければなりません',
      });
    }

    // 日付のバリデーション
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      Logger.error('無効な入力です: 日付フォーマットが不正です');
      return res.status(400).json({
        error: '無効な入力です: 日付フォーマットが不正です',
      });
    }
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
        amount: amountInt,
        type,
        date: parsedDate,
        categoryId: categoryData.id,
        description,
      },
      include: { category: true },
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

// DELETEリクエスト
transactionsRouter.delete('/:id', async (req, res) => {
  try {
    const transactionId = parseInt(req.params.id);

    if (isNaN(transactionId)) {
      Logger.error('無効なIDです: 数値でなければなりません');
      return res.status(400).json({
        error: '無効なIDです: 数値でなければなりません',
      });
    }

    // トランザクションが存在するかどうかを確認
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!existingTransaction) {
      Logger.error(`トランザクションが見つかりません: ID ${transactionId}`);
      return res.status(404).json({
        error: `トランザクションが見つかりません: ID ${transactionId}`,
      });
    }

    // トランザクションの削除
    const deletedTransaction = await prisma.transaction.delete({
      where: { id: transactionId },
    });

    Logger.debug(`トランザクションが削除されました: ID ${transactionId}`); // デバッグログ
    res.status(200).json(deletedTransaction);
  } catch (error: unknown) {
    if (error instanceof Error) {
      Logger.error(
        `エラー: DELETE /api/transactions/${req.params.id} - ${error.message}`,
      ); // エラーログ
      res.status(500).send('サーバーエラーが発生しました');
    }
  }
});

export default transactionsRouter;
