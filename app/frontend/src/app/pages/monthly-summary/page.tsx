'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import Title from '../../components/Title/Title';
import { Transaction } from '@/app/models/transaction';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MonthlySummary() {
  // 現在の月を初期値として設定
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const currentDate = new Date();
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  });

  const { data: transactions, error } = useSWR<Transaction[], Error>(
    'http://localhost:4000/transactions',
    fetcher,
  );

  if (error) return <div>Failed to load</div>;
  if (!transactions) return <div>Loading...</div>;

  // 月が一致する取引をフィルタリング
  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const transactionMonth = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
    return transactionMonth === selectedMonth;
  });

  // 収入と支出の合計を計算
  const { incomeTotal, expenseTotal } = filteredTransactions.reduce(
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
      {/* 月の選択 */}
      <div className="mb-6">
        <label
          htmlFor="month"
          className="block text-xl font-semibold text-gray-700"
        ></label>
        <input
          id="month"
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-1/3 h-12 border border-gray-300 rounded-md shadow-sm text-xl text-gray-900 mt-2"
        />
      </div>
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
