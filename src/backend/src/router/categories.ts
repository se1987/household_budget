import { Router } from "express";

const categoriesRouter = Router();

// <=============エンドポイント（/categories）================>
// GET カテゴリー一覧
categoriesRouter.get("/", (req, res) => {
  res.send("カテゴリー一覧を取得します");
});

// POST カテゴリー追加
categoriesRouter.post("/:id", (req, res) => {
  res.send("カテゴリーを追加します");
});

// <=============エンドポイント（/categories/:id）================>
// PUT カテゴリー更新
categoriesRouter.put("/:id", (req, res) => {
  res.send("カテゴリーを更新します");
});

// DELETE カテゴリー削除
categoriesRouter.delete("/:id", (req, res) => {
  res.send("カテゴリーを削除します");
});

export default categoriesRouter;
