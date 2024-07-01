"use client";

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Title from "../../components/Title/Title";
import Button from '@/app/components/Button/Button';
import { Transaction } from '../../Models/Transaction';
import useSWR, { mutate } from 'swr';

// fetcher関数を定義
// 指定されたURLからデータを取得し、JSONとしてパースする
const fetcher = (url: string) => fetch(url).then(res => res.json());

// 関数コンポーネント
const TransactionForm: React.FC = () => {
  // useFormフックでフォームの状態を管理
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Transaction>();
  // useSWRフックを使用して、サーバーから取引データを取得
  const { data: transactions, error } = useSWR<Transaction[]>('http://localhost:4000/api/transactions', fetcher);
  // データ取得中やエラー時の表示
  if (error) return <div>Failed to load</div>;
  if (!transactions) return <div>Loading...</div>;

  // フォームが送信されたときの処理を定義

  const onSubmit: SubmitHandler<Transaction> = async (data: Transaction) => {
    const response = await fetch('http://localhost:4000/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      const newTransaction: Transaction = await response.json();
      mutate('http://localhost:4000/api/transactions', [...transactions, newTransaction], false);
      reset();
    } else {
      console.error('Failed to add transaction');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Title value='入力フォーム' />
      <form className="bg-white shadow-md rounded-lg p-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="date">日付:</label>
          <input
            id="date"
            type="date"
            defaultValue={today}
            {...register('date', { required: true })}
          />
          {errors.date && <span>日付は必須です</span>} {/* 必須入力が未入力となっている場合、エラーメッセージが出る */}
        </div>

        <div className="mb-4">
          <label htmlFor="type">タイプ:</label>
          <select id="type" {...register('type', { required: true })} defaultValue="支出">
            <option value="収入">収入</option>
            <option value="支出">支出</option>
          </select>
          {errors.type && <span>タイプは必須です</span>}
        </div>

        <div className="mb-4">
          <label htmlFor="category">カテゴリー:</label>
          <select id="category" {...register('category', { required: true })}>
            <option value="住居費">住居費</option>
            <option value="日用品">日用品</option>
            <option value="食費">食費</option>
            <option value="交通費">交通費</option>
            <option value="交際費">交際費</option>
            <option value="趣味・娯楽">趣味・娯楽</option>
            <option value="医療費">医療費</option>
            <option value="給与">給与</option>
          </select>
          {errors.category && <span>カテゴリーは必須です</span>}
        </div>

        <div className="mb-4">
          <label htmlFor="amount">金額:</label>
          <input className="border-b border-gray-500"
            id="amount"
            type="number"
            {...register('amount', { required: true, min: 0 })}
          />
          {errors.amount && <span>金額は必須です</span>}
        </div>

        <div className="mb-4">
          <label htmlFor="description">説明:</label>
          <input className="border-b border-gray-500"
            id="description"
            type="text"
            {...register('description')}
          />
        </div>
        <Button value="送信" buttonType="submit"/>
      </form>
    </div>
  );
};

export default TransactionForm;

// "use client";
// // 必要なモジュールのインストール
// // useFormとSubmitHandler => react-hook-formからインポートされ、フォームの状態管理と送信ハンドラを設定
// import React from 'react';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import Title from "../../components/Title/Title";
// import Button from '@/app/components/Button/Button';
// import { Transaction } from '../../Models/Transaction';
// import useSWR, { mutate } from 'swr';

// // fetcher関数を定義
// const fetcher = (url: string) => fetch(url).then(res => res.json());

// // 関数コンポーネント
// const TransactionForm: React.FC = () => {
//   // useFormフックでフォームの状態を管理
//   // registerはフォームのフィールドを登録するための関数
//   // handleSubmitはフォームの送信を制御するための関数
//   // resetはフォームのリセットを行う関数
//   // formStateの中からerrorsを取得し、バリデーションエラーを管理
//   const { register, handleSubmit, reset, formState: { errors } } = useForm<Transaction>();
//   const { data: transactions, error } = useSWR<Transaction[]>('http://localhost:3000/transactions', fetcher);

//   if (error) return <div>Failed to load</div>;
//   if (!transactions) return <div>Loading...</div>;

//   const onSubmit: SubmitHandler<Transaction> = async (data: Transaction) => {
//     const response = await fetch('http://localhost:3000/transactions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(data)
//     });
//     if (response.ok) {
//       const newTransaction: Transaction = await response.json();
//       mutate('http://localhost:3000/transactions', [...transactions, newTransaction], false);
//     reset();
//   };

//   const today = new Date().toISOString().split('T')[0];

//   return (
//     <div className="max-w-lg mx-auto px-4 py-8">
//       <Title value='入力フォーム' />
//       <form className="bg-white shadow-md rounded-lg p-6" onSubmit={handleSubmit(onSubmit)}>
//         <div className="mb-4">
//           <label htmlFor="date">日付:</label>
//           <input
//             id="date"
//             type="date"
//             defaultValue={today}
//             {...register('date', { required: true })}
//           />
//           {errors.date && <span>日付は必須です</span>}    {/* 必須入力が未入力となっている場合、エラーメッセージがでる */}
//         </div>

//         <div className="mb-4">
//           <label htmlFor="type">タイプ:</label>
//           <select id="type" {...register('type', { required: true })} defaultValue="支出">
//             <option value="収入">収入</option>
//             <option value="支出">支出</option>
//           </select>
//           {errors.type && <span>タイプは必須です</span>}
//         </div>

//         <div className="mb-4">
//           <label htmlFor="category">カテゴリー:</label>
//           <select id="category" {...register('category', { required: true })}>
//             <option value="住居費">住居費</option>
//             <option value="日用品">日用品</option>
//             <option value="食費">食費</option>
//             <option value="交通費">交通費</option>
//             <option value="交際費">交際費</option>
//             <option value="趣味・娯楽">趣味・娯楽</option>
//             <option value="医療費">医療費</option>
//             <option value="給与">給与</option>
//           </select>
//           {errors.category && <span>カテゴリーは必須です</span>}
//         </div>

//         <div className="mb-4">
//           <label htmlFor="amount">金額:</label>
//           <input className="border-b border-gray-500"
//             id="amount"
//             type="number"
//             {...register('amount', { required: true, min: 0 })}
//           />
//           {errors.amount && <span>金額は必須です</span>}
//         </div>

//         <div className="mb-4" >
//           <label htmlFor="description">説明:</label>
//           <input className="border-b border-gray-500"
//             id="description"
//             type="text"
//             {...register('description', { required: true })}
//           />
//         </div>
//         <Button value="送信" buttonType="submit"/>
//       </form>
//     </div>
//   );
// };

// export default TransactionForm;