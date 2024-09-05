'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import useSWR, { mutate } from 'swr';
import Title from '../../components/Title/Title';
import Button from '../../components/Button/Button';
import { Transaction } from '@/app/models/transaction';
import { CategoryType } from '@/app/models/category';

// fetcher関数を定義
// 指定されたURLからデータを取得し、JSONとしてパースする
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// 関数コンポーネント
const TransactionForm: React.FC = () => {
  const router = useRouter();
  // useFormフックでフォームの状態を管理
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Transaction>();
  // useSWRフックを使用して、サーバーから取引データを取得
  const { data: transactions, error: transactionsError } = useSWR<
    Transaction[],
    Error
  >('http://localhost:4000/transactions', fetcher);
  // カテゴリーデータの取得
  const { data: categories, error: categoriesError } = useSWR<
    CategoryType[],
    Error
  >(
    'http://localhost:4000/categories', // 正しいエンドポイントを指定
    fetcher,
  );

  // データ取得中やエラー時の表示
  if (transactionsError || categoriesError) return <div>Failed to load</div>;
  if (!transactions || !categories) return <div>Loading...</div>;

  // フォームが送信されたときの処理を定義

  const onSubmit: SubmitHandler<Transaction> = async (data: Transaction) => {
    fetch('http://localhost:4000/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response: Response) => response.json())
      .then((newTransaction: Transaction) => {
        mutate(
          'http://localhost:4000/transactions',
          [...transactions, newTransaction],
          false,
        );
        reset();
      })
      .catch((mutationError: unknown) => {
        console.error('Failed to update transactions:', mutationError);
      });
  };

  const handleCancel = () => {
    router.back(); // 前のページに戻る
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Title value="入力フォーム" />
      <form
        className="bg-gray-50 shadow-lg rounded-lg p-8"
        onSubmit={handleSubmit((data) => void onSubmit(data))}
      >
        <div className="mb-6 flex justify-between items-center">
          <label htmlFor="date" className="font-semibold text-xl text-gray-700">
            日付:
          </label>
          <input
            id="date"
            type="date"
            defaultValue={today}
            className="w-1/2 h-12 border border-gray-300 rounded-md shadow-sm text-xl text-gray-900"
            {...register('date', { required: true })}
          />
          {errors.date && <span className="text-red-500">日付は必須です</span>}
        </div>

        <div className="mb-6 flex justify-between items-center">
          <label htmlFor="type" className="font-semibold text-xl text-gray-700">
            タイプ:
          </label>
          <select
            id="type"
            className="w-1/2 h-12 border border-gray-300 rounded-md shadow-sm text-xl text-gray-900"
            {...register('type', { required: true })}
            defaultValue="支出"
          >
            <option value="収入">収入</option>
            <option value="支出">支出</option>
          </select>
          {errors.type && (
            <span className="text-red-500">タイプは必須です</span>
          )}
        </div>

        <div className="mb-6 flex justify-between items-center">
          <label
            htmlFor="category"
            className="font-semibold text-xl text-gray-700"
          >
            カテゴリー:
          </label>
          <select
            id="category"
            className="w-1/2 h-12 border border-gray-300 rounded-md shadow-sm text-xl text-gray-900"
            {...register('category', { required: true })}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="text-red-500">カテゴリーは必須です</span>
          )}
        </div>

        <div className="mb-6 flex justify-between items-center">
          <label
            htmlFor="amount"
            className="font-semibold text-xl text-gray-700"
          >
            金額:
          </label>
          <input
            id="amount"
            className="w-1/2 h-12 border border-gray-300 rounded-md shadow-sm text-xl text-gray-900"
            type="number"
            {...register('amount', { required: true, min: 0 })}
          />
          {errors.amount && (
            <span className="text-red-500">金額が未入力または負の数です</span>
          )}
        </div>

        <div className="mb-6 flex justify-between items-center">
          <label
            htmlFor="description"
            className="font-semibold text-xl text-gray-700"
          >
            説明:
          </label>
          <input
            id="description"
            className="w-1/2 h-12 border border-gray-300 rounded-md shadow-sm text-xl text-gray-900"
            type="text"
            {...register('description')}
          />
        </div>

        <div className="flex justify-center space-x-6 mt-8">
          <Button value="送信" buttonType="submit" />
          <button
            className="w-40 bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
            onClick={handleCancel}
            type="button"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
