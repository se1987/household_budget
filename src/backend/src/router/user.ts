import { Router } from "express";

const router = Router();

// GET ユーザー一覧
router.get("/", (req, res) => {
  res.send("User router works!");
});

// GET ユーザー詳細
router.get("/:id", (req, res) => {
  res.send("User router works!");
});

// POST ユーザー入力
router.post("/:id", (req, res) => {
  res.send("User router works!");
});

// PUT ユーザー更新
router.put("/:id", (req, res) => {
  res.send("User router works!");
});

// DELETE ユーザー削除
router.delete("/:id", (req, res) => {
  res.send("User router works!");
});

export default router;
