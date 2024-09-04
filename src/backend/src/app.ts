import express from "express";
import transactionsRouter from "./router/transactions";
import userRouter from "./router/user";
import categoriesRouter from "./router/categories";

const app = express();
const port = 4000;

app.use("/user", userRouter);
app.use("/transactions", transactionsRouter);
app.use("/categories", categoriesRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 入出金一覧表示

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
