import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Title from './components/Title/Title';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '家計簿アプリ',
  description: '家計簿アプリ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-sky-50">
          <nav className="bg-sky-500 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
              <ul className="flex space-x-4">
                <li>
                  <Link href="/" className="hover:text-sky-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/pages/add" className="hover:text-sky-200">
                    収支入力
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pages/monthly-summary"
                    className="hover:text-sky-200"
                  >
                    レポート
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
          <main className="max-w-2xl mx-auto px-4 py-8">
            <>
              <Title value="家計簿アプリ" />
              <div className="bg-white shadow-md rounded-lg p-6">
                {children}
              </div>
            </>
          </main>
        </div>
      </body>
    </html>
  );
}
