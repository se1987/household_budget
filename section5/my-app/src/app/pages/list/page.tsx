"use client";
// 必要なモジュールのインポート
import React from 'react';
import { Transaction } from '../..//Models/Transaction';
import Title from "../../components/Title/Title";
import Link from 'next/link';
import useSWR from 'swr';

// fetcher関数を定義
// 指定されたURLからデータを取得し、JSONとしてパースする
const fetcher = (url: string) => fetch(url).then(res => res.json());

// 関数コンポーネント
// 関数名：TransactionList（データ型：React.FC<TransactionListProps>）
// 引数：transactions（データ型：Transaction[] Type.tsxで定義されたオブジェクトを要素にもつ配列）
// 返り値：引数の要素を変換したリスト ← JSX
//        {transaction.date} - {transaction.type} - {transaction.amount} - {transaction.description} - {transaction.category}
export default function TransactionList() {

  // SWRを使用してデータをフェッチ
  const { data: transactions, error } = useSWR<Transaction[]>('http://localhost:4000/api/transactions', fetcher);

  if (error) return <div>Failed to load transactions</div>;
  if (!transactions) return <div>Loading...</div>;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Title value="入出金一覧" />
      <ul className="divide-y divide-gray-200">
        {transactions.map(transaction => (
          <li className="py-4 flex justify-between items-center" key={transaction.id}>
            <Link href={`pages/detail/${transaction.id}`}>
              {transaction.date} - {transaction.type} - {transaction.category} - {transaction.amount}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
