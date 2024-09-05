import { CategoryType } from "./category";

export type IncomeExpense = "収入" | "支出";

export interface Transaction {
  id: number;
  date: Date;
  type: IncomeExpense;
  amount: number;
  description?: string;
  category: CategoryType;
}
