'use client';

import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams } from 'next/navigation';
import useSWR, { mutate } from 'swr';
import Title from '../../../../components/Title/Title';
import Button from '../../../../components/Button/Button';
import { Transaction, CategoryType } from '../../../../Models/Transaction';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const UpdatePage: React.FC = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  // カテゴリーデータの取得
  const { data: categories, error: categoriesError } = useSWR<
    CategoryType[],
    Error
  >(
    'http://localhost:4000/api/categories', // 正しいエンドポイントを指定
    fetcher,
  );

  const { data: transaction, error: transactionsError } = useSWR<
    Transaction,
    Error
  >(`http://localhost:4000/api/transactions/${id}`, fetcher);

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
      setValue('date', transaction.date);
      setValue('type', transaction.type);
      setValue('category', transaction.category);
      setValue('amount', transaction.amount);
      setValue('description', transaction.description);
    }
  }, [transaction, setValue]);

  const onSubmit: SubmitHandler<Transaction> = async (data) => {
    await fetch(`http://localhost:4000/api/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    mutate(`http://localhost:4000/api/transactions/${id}`);
  };

  const handleCancel = () => {
    // 適切なキャンセル処理を実装
  };

  if (transactionsError || categoriesError)
    return <div>エラーが発生しました</div>;
  if (!transaction || !categories) return <div>読み込み中...</div>;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Title value="更新フォーム" />
      <form
        className="bg-white shadow-md rounded-lg p-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-4">
          <label htmlFor="date">日付:</label>
          <input
            id="date"
            type="date"
            {...register('date', { required: true })}
          />
          {errors.date && <span>日付は必須です</span>}
        </div>

        <div className="mb-4">
          <label htmlFor="type">タイプ:</label>
          <select id="type" {...register('type', { required: true })}>
            <option value="収入">収入</option>
            <option value="支出">支出</option>
          </select>
          {errors.type && <span>タイプは必須です</span>}
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
          {errors.amount && <span>金額は必須です</span>}
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
        <div className="flex">
          <Button value="更新" buttonType="submit" />
          <Button
            value="キャンセル"
            buttonType="button"
            clickFunc={handleCancel}
          />
        </div>
      </form>
    </div>
  );
};

export default UpdatePage;
