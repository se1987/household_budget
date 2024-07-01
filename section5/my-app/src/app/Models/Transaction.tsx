export type CategoryType = '住居費' | '日用品' | '食費' | '交通費' | '交際費' | '趣味・娯楽' | '医療費' | '給与';

export type IncomeExpense = '収入' | '支出';

export interface Transaction {
  id: number;
  date: string;
  type: IncomeExpense;
  category: CategoryType;
  amount: number;
  description?: string;
}
