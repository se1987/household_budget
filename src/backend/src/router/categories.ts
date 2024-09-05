import { Router } from "express";
import prisma from "../prisma";
import logger from "../context/logger";

const categoriesRouter = Router();

// <=============エンドポイント（/categories）================>
// GET カテゴリー一覧
categoriesRouter.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`エラー: GET /categories - ${error.message}`);
      res.status(500).json({ error: "カテゴリー一覧の取得に失敗しました" });
    }
  }
});

// POST カテゴリー追加
categoriesRouter.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    const newCategory = await prisma.category.create({
      data: { name },
    });
    res.json(newCategory);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`エラー: POST /categories - ${error.message}`);
      res.status(500).json({ error: "カテゴリーの作成に失敗しました" });
    }
  }
});

// <=============エンドポイント（/categories/:id）================>
// PUT カテゴリー更新
categoriesRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: { name },
    });
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: "カテゴリーの更新に失敗しました" });
  }
});

// DELETE カテゴリー削除
categoriesRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.category.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: "カテゴリーを削除しました" });
  } catch (error) {
    res.status(500).json({ error: "カテゴリーの削除に失敗しました" });
  }
});

export default categoriesRouter;
