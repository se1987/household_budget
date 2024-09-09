'use client';

import React from 'react';
import useSWR from 'swr';
import Title from '../../components/Title/Title';
import { Transaction } from '@/app/models/transaction';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MonthlySummary() {
  const { data: transactions, error } = useSWR<Transaction[], Error>(
    'http://localhost:4000/transactions',
    fetcher,
  );

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
    { incomeTotal: 0, expenseTotal: 0 },
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Title value="月間レポート" />
      <div className="bg-gray-50 shadow-lg rounded-lg p-8 mt-6">
        <ul className="divide-y divide-gray-200">
          <li className="py-6 flex justify-between items-center">
            <span className="font-semibold text-xl text-gray-700">
              収入合計:
            </span>
            <span className="text-2xl font-bold text-green-600">
              ¥{incomeTotal.toLocaleString()}円
            </span>
          </li>
          <li className="py-6 flex justify-between items-center">
            <span className="font-semibold text-xl text-gray-700">
              支出合計:
            </span>
            <span className="text-2xl font-bold text-red-600">
              ¥{expenseTotal.toLocaleString()}円
            </span>
          </li>
          <li className="py-6 flex justify-between items-center">
            <span className="font-semibold text-xl text-gray-700">
              収支合計:
            </span>
            <span
              className={`text-2xl font-bold ${
                incomeTotal - expenseTotal >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              ¥{(incomeTotal - expenseTotal).toLocaleString()}円
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
