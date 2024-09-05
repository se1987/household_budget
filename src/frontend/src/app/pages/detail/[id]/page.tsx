'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { Transaction } from '../../../models/transaction';
import Title from '../../../components/Title/Title';
import Button from '../../../components/Button/Button';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TransactionDetail() {
  const params = useParams();
  const router = useRouter();
  // usePramsの型が配列であってもstringであっても値を渡すため（ const { id } = params;を変更 ）
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data: transaction, error } = useSWR<Transaction, Error>(
    `http://localhost:4000/transactions/${id}`,
    fetcher,
  );
  const handleCancel = () => {
    router.back(); // 前のページに戻る
  };

  if (error) return <div>エラーが発生しました</div>;
  if (!transaction) return <div>読み込み中...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Title value="取引詳細" />
      <div className="bg-gray-50 shadow-lg rounded-lg p-8 mt-6">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-xl text-gray-700">日付:</span>
            <span className="text-xl text-gray-900">
              {new Date(transaction.date).toLocaleDateString('ja-JP')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-xl text-gray-700">区分:</span>
            <span
              className={`text-xl font-bold ${
                transaction.type === '収入' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {transaction.type}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-xl text-gray-700">項目:</span>
            <span className="text-xl text-gray-900">
              {transaction.category?.name || 'カテゴリなし'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-xl text-gray-700">金額:</span>
            <span className="text-xl font-bold text-gray-900">
              ¥{transaction.amount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-xl text-gray-700">メモ:</span>
            <span className="text-xl text-gray-900">
              {transaction.description || 'なし'}
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-center space-x-8 mt-8">
        <Link href={`${transaction.id}/update`}>
          <button
            className="w-40 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
            type="button"
          >
            更新/削除
          </button>
        </Link>
        <button
          className="w-40 bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
          onClick={handleCancel}
          type="button"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}
