"use client";
import React from 'react';
import TransactionList from './pages/list/page'

export default function Home() {
  return (
    <div>
      <main className="max-w-2xl mx-auto px-4 py-8">
        <>
          <TransactionList />
        </>
      </main>
    </div>
  );
}
