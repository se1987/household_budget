'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import useSWR, { mutate } from 'swr';
import Title from '../../components/Title/Title';
import Button from '../../components/Button/Button';
import { Transaction, CategoryType } from '../../Models/Transaction';

// fetcher関数を定義
// 指定されたURLからデータを取得し、JSONとしてパースする
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// 関数コンポーネント
const TransactionForm: React.FC = () => {
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
  >('http://localhost:4000/api/transactions', fetcher);
  // カテゴリーデータの取得
  const { data: categories, error: categoriesError } = useSWR<
    CategoryType[],
    Error
  >(
    'http://localhost:4000/api/categories', // 正しいエンドポイントを指定
    fetcher,
  );

  // データ取得中やエラー時の表示
  if (transactionsError || categoriesError) return <div>Failed to load</div>;
  if (!transactions || !categories) return <div>Loading...</div>;

  // フォームが送信されたときの処理を定義

  const onSubmit: SubmitHandler<Transaction> = async (data: Transaction) => {
    fetch('http://localhost:4000/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response: Response) => response.json())
      .then((newTransaction: Transaction) => {
        mutate(
          'http://localhost:4000/api/transactions',
          [...transactions, newTransaction],
          false,
        );
        reset();
      })
      .catch((mutationError: unknown) => {
        console.error('Failed to update transactions:', mutationError);
      });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Title value="入力フォーム" />
      <form
        className="bg-white shadow-md rounded-lg p-6"
        onSubmit={handleSubmit((data) => void onSubmit(data))}
      >
        <div className="mb-4">
          <label htmlFor="date">日付:</label>
          <input
            id="date"
            type="date"
            defaultValue={today}
            {...register('date', { required: true })}
          />
          {errors.date && <span>日付は必須です</span>}{' '}
          {/* 必須入力が未入力となっている場合、エラーメッセージが出る */}
        </div>

        <div className="mb-4">
          <label htmlFor="type">タイプ:</label>
          <select
            id="type"
            {...register('type', { required: true })}
            defaultValue="支出"
          >
            <option value="収入">収入</option>
            <option value="支出">支出</option>
          </select>
          {errors.type && <span>タイプは必須です（収入/支出）</span>}
        </div>

        <div className="mb-4">
          <label htmlFor="category">カテゴリー:</label>
          <select id="category" {...register('category', { required: true })}>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {' '}
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <span>カテゴリーは必須です</span>}
        </div>

        <div className="mb-4">
          <label htmlFor="amount">金額:</label>
          <input
            className="border-b border-gray-500"
            id="amount"
            type="number"
            {...register('amount', { required: true, min: 0 })}
          />
          {errors.amount && (
            <span>金額が未入力または負の数が入力されています</span>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="description">説明:</label>
          <input
            className="border-b border-gray-500"
            id="description"
            type="text"
            {...register('description')}
          />
        </div>
        <Button value="送信" buttonType="submit" />
      </form>
    </div>
  );
};

export default TransactionForm;
