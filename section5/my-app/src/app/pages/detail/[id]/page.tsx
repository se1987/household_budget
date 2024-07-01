'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { Transaction } from '@/app/Models/Transaction';
import Title from '@/app/components/Title/Title';
import Button from '@/app/components/Button/Button';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TransactionDetail() {
  const params = useParams();
  const { id } = params;

  const { data: transaction, error } = useSWR<Transaction>(
    `http://localhost:4000/api/transactions/${id}`,
    fetcher
  );

  if (error) return <div>エラーが発生しました</div>;
  if (!transaction) return <div>読み込み中...</div>;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Title value="詳細"/>
      <h3 className="py-4 flex justify-between items-center">日付: {transaction.date}</h3>
      <h3 className="py-4 flex justify-between items-center">区分: {transaction.type}</h3>
      <h3 className="py-4 flex justify-between items-center">項目: {transaction.category}</h3>
      <h3 className="py-4 flex justify-between items-center">金額: {transaction.amount}</h3>
      <h3 className="py-4 flex justify-between items-center">メモ: {transaction.description}</h3>
      <Link href={`/detail/${transaction.id}/update`}><Button value="更新"/></Link>
    </div>
  );
}