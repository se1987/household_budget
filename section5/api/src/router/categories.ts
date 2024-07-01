import { Router } from 'express';
import Logger from '../context/logger';
import { PrismaClient } from '@prisma/client';

const categoriesRouter = Router();
const prisma = new PrismaClient(); // Prismaクライアントのインスタンス作成

// エンドポイント（/api/categories）
// GETリクエスト
categoriesRouter.get('/', async (req, res) => {
  try {
    const data = await prisma.category.findMany(); // Prismaで取得
    res.send(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      Logger.error(`エラー: GET /api/categories - ${error.message}`); // エラーログ
      res.status(500).send('サーバーエラーが発生しました');
    }
  }
});

// POSTリクエスト
categoriesRouter.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: '不正なリクエストです。' });
  }
  try {
    const newCategory = await prisma.category.create({
      data: {
        name,
      },
    });
    Logger.debug(`New category added: ${JSON.stringify(newCategory)}`); // デバッグログ
    res.status(201).json(newCategory);
  } catch (error: unknown) {
    if (error instanceof Error) {
      Logger.error(`エラー: POST /api/categories - ${error.message}`); // エラーログ
      res.status(500).send('サーバーエラーが発生しました');
    }
  }
});

// エンドポイント（/api/categories/:id）
// GETリクエスト
categoriesRouter.get('/:id', async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!category) {
      return res.status(404).json({
        error:
          '指定されたカテゴリーが見つかりません。別のカテゴリー名で再度、実行してください。',
      });
    }
    res.json(category);
  } catch (error: unknown) {
    if (error instanceof Error) {
      Logger.error(
        `エラー: GET /api/categories/${req.params.id} - ${error.message}`,
      ); // エラーログ
      res.status(500).send('サーバーエラーが発生しました');
    }
  }
});

export default categoriesRouter;
