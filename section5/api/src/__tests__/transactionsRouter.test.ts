import request from 'supertest';
import express from 'express';
import transactionsRouter from '../router/transactions';
import { PrismaClient } from '@prisma/client';
import { expect, describe, test, beforeAll, afterAll } from '@jest/globals';

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

const app = express();

app.use(express.json());
app.use('/api/transactions', transactionsRouter);

describe('GET /api/transactions', () => {
  // 入出金一覧画面 GETメソッド 正常系のテスト
  test('should return a list of transactions', async () => {
    const res = await request(app).get('/api/transactions');
    expect(res.status).toBe(200);
    expect(res.body).toBeTruthy();
  });
  // // 入出金一覧画面 GETメソッド エラーハンドリングのテスト
  // test('should handle errors', async () => {
  //   const res = await request(app).get('/api/transactions');
  //   expect(res.status).toBe(500);
  //   expect(res.text).toBe('サーバーエラーが発生しました');
  // });
});

// POSTメソッド 正常系テスト
describe('POST /api/transactions', () => {
  test('should create a new transaction', async () => {
    const newTransaction = {
      amount: 1000,
      type: '支出',
      date: new Date().toISOString(),
      category: '食費',
      description: 'Test',
    };

    const res = await request(app)
      .post('/api/transactions')
      .send(newTransaction);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      amount: 1000,
      type: '支出',
      date: expect.any(String), // 日付フォーマットを確認
      categoryId: expect.any(Number), // カテゴリーIDを確認
      description: 'Test',
    });
  });
  // 異常系: 無効な入力（amountが負の値）
  test('should return 400 for negative amount', async () => {
    const invalidTransaction = {
      amount: -1000,
      type: '支出',
      date: '2023-10-10',
      category: '食費',
      description: 'Test',
    };

    const res = await request(app)
      .post('/api/transactions')
      .send(invalidTransaction);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: '無効な入力です: 金額は正の値でなければなりません',
    });
  });
  // 異常系: typeが不正な値
  test('should return 400 for invalid type', async () => {
    const invalidTransaction = {
      amount: 1000,
      type: '無効なタイプ',
      date: new Date().toISOString(),
      category: '食費',
      description: 'Test',
    };

    const res = await request(app)
      .post('/api/transactions')
      .send(invalidTransaction);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: '無効な入力です: typeは"支出"または"収入"でなければなりません',
    });
  });
  // 異常系: 日付フォーマットが不正
  test('should return 400 for invalid date format', async () => {
    const invalidTransaction = {
      amount: 1000,
      type: '支出',
      date: 'invalid-date-format',
      category: '食費',
      description: 'Test',
    };

    const res = await request(app)
      .post('/api/transactions')
      .send(invalidTransaction);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: '無効な入力です: 日付フォーマットが不正です',
    });
  });
  // 異常系：カテゴリーが見つからなかった時
  test('should handle category not found', async () => {
    const newTransaction = {
      amount: 1000,
      type: '支出',
      date: new Date().toISOString(),
      category: 'NonExistentCategory',
      description: 'Test',
    };

    const res = await request(app)
      .post('/api/transactions')
      .send(newTransaction);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'カテゴリーが見つかりません: NonExistentCategory',
    });
  });
  // 異常系: 必須フィールドが欠落
  test('should return 400 for missing required fields', async () => {
    const invalidTransaction = {
      amount: 1000,
      type: '支出',
      date: new Date().toISOString(),
      // categoryが欠落
      description: 'Test',
    };

    const res = await request(app)
      .post('/api/transactions')
      .send(invalidTransaction);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: '無効な入力です: 必須フィールドが欠落しています',
    });
  });
  // // POSTメソッド エラーハンドリングのテスト
  // test('should handle errors', async () => {
  //   const newTransaction = {
  //     amount: 1000,
  //     type: '支出',
  //     date: new Date().toISOString(),
  //     category: { id: 1, name: '食費' },
  //     description: 'Test',
  //   };

  //   const res = await request(app)
  //     .post('/api/transactions')
  //     .send(newTransaction);
  //   expect(res.status).toBe(500);
  //   expect(res.text).toBe('サーバーエラーが発生しました');
  // });
});
// 詳細画面 GETメソッド 正常系テスト
describe('GET /api/transactions/:id', () => {
  test('should return a transaction by id', async () => {
    const res = await request(app).get('/api/transactions/2');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
  });
  // 異常系：該当する取引が見つからなかった場合のテスト
  test('should handle transaction not found', async () => {
    const res = await request(app).get('/api/transactions/1000');
    expect(res.status).toBe(404);
    expect(res.text).toBe('該当する取引が見つかりませんでした id: 1000');
  });
  // // 詳細画面 GETメソッド エラーハンドリングのテスト
  // test('should handle errors', async () => {
  //   const res = await request(app).get('/api/transactions/1');
  //   expect(res.status).toBe(500);
  //   expect(res.text).toBe('サーバーエラーが発生しました');
  // });
});
// 更新画面 PUTメソッド 正常系テスト
describe('PUT /api/transactions/:id', () => {
  test('should update a transaction', async () => {
    const updatedTransaction = {
      id: 2,
      amount: 2000,
      type: '支出',
      date: '2024-07-26T00:00:00.000Z',
      category: '食費',
      description: 'Updated',
    };

    const res = await request(app)
      .put('/api/transactions/2')
      .send(updatedTransaction);
    expect(res.status).toBe(200);
    expect(res.body.amount).toBe(updatedTransaction.amount);
  });
  // 異常系: 無効な入力（amountが負の値）
  test('should return 400 for negative amount', async () => {
    const invalidTransaction = {
      amount: -1000,
      type: '支出',
      date: new Date().toISOString(),
      category: '食費',
      description: 'Updated Test',
    };

    const res = await request(app)
      .put('/api/transactions/1')
      .send(invalidTransaction);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: '無効な入力です: 金額は正の値でなければなりません',
    });
  });

  // 異常系: typeが不正な値
  test('should return 400 for invalid type', async () => {
    const invalidTransaction = {
      amount: 1000,
      type: '無効なタイプ',
      date: new Date().toISOString(),
      category: '食費',
      description: 'Updated Test',
    };

    const res = await request(app)
      .put('/api/transactions/1')
      .send(invalidTransaction);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: '無効な入力です: typeは"支出"または"収入"でなければなりません',
    });
  });

  // 異常系: 必須フィールドが欠落
  test('should return 400 for missing required fields', async () => {
    const invalidTransaction = {
      amount: 1000,
      type: '支出',
      date: new Date().toISOString(),
      // categoryが欠落
      description: 'Updated Test',
    };

    const res = await request(app)
      .put('/api/transactions/1')
      .send(invalidTransaction);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: '無効な入力です: 必須フィールドが欠落しています',
    });
  });

  // 異常系: 日付フォーマットが不正
  test('should return 400 for invalid date format', async () => {
    const invalidTransaction = {
      amount: 1000,
      type: '支出',
      date: 'invalid-date-format',
      category: '食費',
      description: 'Updated Test',
    };

    const res = await request(app)
      .put('/api/transactions/1')
      .send(invalidTransaction);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: '無効な入力です: 日付フォーマットが不正です',
    });
  });
  // 異常系：カテゴリが見つからない場合のテスト
  test('should handle category not found', async () => {
    const updatedTransaction = {
      amount: 2000,
      type: '収入',
      date: new Date().toISOString(),
      category: 'NonExistentCategory',
      description: 'Updated',
    };

    const res = await request(app)
      .put('/api/transactions/1')
      .send(updatedTransaction);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'カテゴリーが見つかりません: NonExistentCategory',
    });
  });
  // // 更新画面PUT エラーハンドリングのテスト
  // test('should handle errors', async () => {
  //   const updatedTransaction = {
  //     amount: 2000,
  //     type: '収入',
  //     date: new Date().toISOString(),
  //     category: '給与',
  //     description: 'Updated',
  //   };

  //   const res = await request(app)
  //     .put('/api/transactions/1')
  //     .send(updatedTransaction);
  //   expect(res.status).toBe(500);
  //   expect(res.text).toBe('サーバーエラーが発生しました');
  // });
});

// DELETE画面 DELETEメソッド テスト
describe('DELETE /api/transactions/:id', () => {
  test('should delete a transaction', async () => {
    const res = await request(app).delete('/api/transactions/2');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 2,
      amount: 3000,
      type: '支出',
      date: expect.any(String), // Date 型は適切なフォーマットで返されるかを確認
      categoryId: 3,
      description: 'Test',
    });
  });

  // 異常系: 無効なID
  test('should return 400 for invalid ID', async () => {
    const res = await request(app).delete('/api/transactions/invalid-id');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: '無効なIDです: 数値でなければなりません',
    });
  });

  // 異常系: 存在しないトランザクション
  test('should return 404 if transaction not found', async () => {
    const res = await request(app).delete('/api/transactions/9999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: 'トランザクションが見つかりません: ID 9999',
    });
  });

  // // エラーハンドリングのテスト
  // test('should handle errors', async () => {
  //   const res = await request(app).delete('/api/transactions/1');
  //   expect(res.status).toBe(500);
  //   expect(res.text).toBe('サーバーエラーが発生しました');

  // });
});
