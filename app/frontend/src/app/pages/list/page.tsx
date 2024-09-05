'use client';

// 必要なモジュールのインポート
import React from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { Transaction } from '@/app/models/transaction';
import Title from '../../components/Title/Title';

// fetcher関数を定義
// 指定されたURLからデータを取得し、JSONとしてパースする
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// 関数コンポーネント
// 関数名：TransactionList（データ型：React.FC<TransactionListProps>）
// 引数：transactions（データ型：Transaction[] Type.tsxで定義されたオブジェクトを要素にもつ配列）
// 返り値：引数の要素を変換したリスト ← JSX
//        {transaction.date} - {transaction.type} - {transaction.amount} - {transaction.description} - {transaction.category}
export default function TransactionList() {
  // SWRを使用してデータをフェッチ
  // カテゴリーデータの取得

  const { data: transactions, error } = useSWR<Transaction[], Error>(
    'http://localhost:4000/transactions',
    fetcher,
  );

  if (error) return <div>Failed to load transactions</div>;
  if (!transactions) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Title value="入出金一覧" />
      <ul className="grid grid-cols-1 gap-4">
        {transactions.map((transaction) => (
          <li
            className="p-6 bg-gray-50 shadow-md rounded-lg hover:bg-gray-200 transition duration-300"
            key={transaction.id}
          >
            <Link href={`pages/detail/${transaction.id}`}>
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold text-gray-800">
                  {new Date(transaction.date).toLocaleDateString('ja-JP')}
                </div>
                <div
                  className={`text-sm font-medium px-2 py-1 rounded-full ${
                    transaction.type === '収入'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {transaction.type}
                </div>
              </div>
              <div className="text-md text-gray-600 mt-2">
                カテゴリ: {transaction.category?.name || 'カテゴリなし'}
              </div>
              <div className="text-md font-medium text-gray-800 mt-2">
                金額: ¥{transaction.amount.toLocaleString()}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
