'use client';

import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import useSWR, { mutate } from 'swr';
import Title from '../../../../components/Title/Title';
import Button from '../../../../components/Button/Button';
import { Transaction } from '../../../../models/transaction';
import { CategoryType } from '@/app/models/category';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const UpdatePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  // カテゴリーデータの取得
  const { data: categories, error: categoriesError } = useSWR<
    CategoryType[],
    Error
  >(
    'http://localhost:4000/categories', // 正しいエンドポイントを指定
    fetcher,
  );

  const { data: transaction, error: transactionsError } = useSWR<
    Transaction,
    Error
  >(`http://localhost:4000/transactions/${id}`, fetcher);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Transaction>({
    defaultValues: transaction,
  });

  useEffect(() => {
    if (transaction) {
      // Dateオブジェクトを YYYY-MM-DD 形式に変換
      const formattedDate = new Date(transaction.date)
        .toISOString()
        .split('T')[0];
      setValue('date', formattedDate);
      setValue('type', transaction.type);
      setValue('category.name', transaction.category?.name);
      setValue('amount', transaction.amount);
      setValue('description', transaction.description);
    }
  }, [transaction, setValue]);

  const onSubmit: SubmitHandler<Transaction> = async (data) => {
    await fetch(`http://localhost:4000/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        categoryId: data.category, // カテゴリーIDを送信
      }),
    });
    mutate(`http://localhost:4000/transactions/${id}`);
    router.push('/');
  };

  // 削除処理を追加
  const handleCancel = async () => {
    const confirmDelete = window.confirm('本当に削除しますか？');
    if (confirmDelete) {
      await fetch(`http://localhost:4000/transactions/${id}`, {
        method: 'DELETE',
      });
      mutate('http://localhost:4000/transactions'); // 一覧データを更新
      router.push('/'); // 削除後にトランザクション一覧ページに遷移
    }
  };

  if (transactionsError || categoriesError) {
    return <div>エラーが発生しました</div>;
  }

  if (!transaction || !categories) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Title value="更新フォーム" />
      <form
        className="bg-gray-50 shadow-lg rounded-lg p-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-6 flex justify-between items-center">
          <label htmlFor="date" className="font-semibold text-xl text-gray-700">
            日付:
          </label>
          <input
            id="date"
            type="date"
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
              <option key={category.id} value={category.id}>
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
            className="w-1/2 h-12 border border-gray-300 rounded-md shadow-sm text-xl text-gray-900"
            id="amount"
            type="number"
            {...register('amount', { required: true, min: 0 })}
          />
          {errors.amount && (
            <span className="text-red-500">金額は必須です</span>
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
            className="w-1/2 h-12 border border-gray-300 rounded-md shadow-sm text-xl text-gray-900"
            id="description"
            type="text"
            {...register('description')}
          />
        </div>

        <div className="flex justify-center space-x-6 mt-8">
          <button
            className="w-40 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
            type="submit"
          >
            更新
          </button>
          <button
            className="w-40 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
            type="button"
            onClick={handleCancel}
          >
            削除
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePage;
