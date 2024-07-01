"use client";
import React from 'react';
import Title from "../../components/Title/Title";
import useSWR from 'swr';
import { Transaction } from '../../Models/Transaction';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function MonthlySummary() {
  const { data: transactions, error } = useSWR<Transaction[]>('http://localhost:4000/api/transactions', fetcher);

  if (error) return <div>Failed to load</div>;
  if (!transactions) return <div>Loading...</div>;

   // 収入と支出の合計を計算
  const { incomeTotal, expenseTotal } = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === '収入') {
        acc.incomeTotal += transaction.amount;
      } else {
        acc.expenseTotal += transaction.amount;
      }
      return acc;
    },
    { incomeTotal: 0, expenseTotal: 0 }
  );

  return (
    <div>
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Title value="月間レポート" />
        <ul className="divide-y divide-gray-200">
          <li className="py-4 flex justify-between items-center">収入合計: {incomeTotal}円</li>
          <li className="py-4 flex justify-between items-center">支出合計: {expenseTotal}円</li>
          <li className="py-4 flex justify-between items-center">収支合計: {incomeTotal + expenseTotal}円</li>
        </ul>
      </main>
    </div>
  );
}