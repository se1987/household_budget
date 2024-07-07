export interface CategoryType {
  id: number;
  name: string;
}

export type IncomeExpense = '収入' | '支出';

export interface Transaction {
  id: number;
  date: Date;
  type: IncomeExpense;
  category: string;
  amount: number;
  description?: string;
}
