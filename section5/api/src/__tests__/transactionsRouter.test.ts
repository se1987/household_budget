import request from 'supertest';
import express from 'express';
import transactionsRouter from '../router/transactions';
import { PrismaClient } from '@prisma/client';
// import Logger from '../context/logger';
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
    // expect(Logger.error).not.toHaveBeenCalled();
  });
  // 入出金一覧画面 GETメソッド エラーハンドリングのテスト
  test('should handle errors', async () => {
    const res = await request(app).get('/api/transactions');
    expect(res.status).toBe(500);
    expect(res.text).toBe('サーバーエラーが発生しました');
    // expect(Logger.error).toHaveBeenCalledWith(
    //   expect.stringContaining('エラー: GET /api/transactions - Test error'),
    // );
  });
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
    const createdTransaction = { ...newTransaction, categoryId: 1 };

    const res = await request(app)
      .post('/api/transactions')
      .send(newTransaction);
    expect(res.status).toBe(201);
    expect(res.body).toEqual(createdTransaction);
    // expect(Logger.debug).toHaveBeenCalledWith(
    //   expect.stringContaining('New transaction added'),
    // );
    // expect(Logger.error).not.toHaveBeenCalled();
  });
  // 異常系: 無効な入力（amountが負の値）
  test('should return 400 for negative amount', async () => {
    const invalidTransaction = {
      amount: -1000,
      type: '支出',
      date: new Date().toISOString(),
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
    // expect(Logger.error).toHaveBeenCalledWith(
    //   expect.stringContaining('無効な入力です'),
    // );
  });
  // 異常系: typeが不正な値
  test('should return 400 for invalid type', async () => {
    const invalidTransaction = {
      amount: 1000,
      type: '無効なタイプ',
      date: new Date().toISOString(),
      category: 'Food',
      description: 'Test',
    };

    const res = await request(app)
      .post('/api/transactions')
      .send(invalidTransaction);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: '無効な入力です: typeは"支出"または"収入"でなければなりません',
    });
    // expect(Logger.error).toHaveBeenCalledWith(
    //   expect.stringContaining('無効な入力です'),
    // );
  });
  // 異常系: 日付フォーマットが不正
  test('should return 400 for invalid date format', async () => {
    const invalidTransaction = {
      amount: 1000,
      type: '支出',
      date: 'invalid-date-format',
      category: 'Food',
      description: 'Test',
    };

    const res = await request(app)
      .post('/api/transactions')
      .send(invalidTransaction);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: '無効な入力です: 日付フォーマットが不正です',
    });
    // expect(Logger.error).toHaveBeenCalledWith(
    //   expect.stringContaining('無効な入力です'),
    // );
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
    //   expect(Logger.error).not.toHaveBeenCalled();
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
    // expect(Logger.error).toHaveBeenCalledWith(
    //   expect.stringContaining('無効な入力です'),
    // );
  });
  // POSTメソッド エラーハンドリングのテスト
  test('should handle errors', async () => {
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
    expect(res.status).toBe(500);
    expect(res.text).toBe('サーバーエラーが発生しました');
    // expect(Logger.error).toHaveBeenCalledWith(
    //   expect.stringContaining('エラー: POST /api/transactions - Test error'),
    // );
  });
});
// 詳細画面 GETメソッド 正常系テスト
describe('GET /api/transactions/:id', () => {
  test('should return a transaction by id', async () => {
    const transaction = {
      id: 1,
      amount: 1000,
      type: '支出',
      date: new Date('2024-07-03T00:00:00.000Z'),
      categoryId: 1,
      description: 'Updated Test',
    };

    const res = await request(app).get('/api/transactions/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(transaction);
    //   expect(Logger.error).not.toHaveBeenCalled();
  });
  // 異常系：該当する取引が見つからなかった場合のテスト
  test('should handle transaction not found', async () => {
    const res = await request(app).get('/api/transactions/1000');
    expect(res.status).toBe(404);
    expect(res.text).toBe('該当する取引が見つかりませんでした id: 1000');
    // expect(Logger.error).toHaveBeenCalledWith(
    //   expect.stringContaining(
    //     'Error: No matching transactions were found. id: 1',
    //   ),
    // );
  });
  // 詳細画面 GETメソッド エラーハンドリングのテスト
  test('should handle errors', async () => {
    const res = await request(app).get('/api/transactions/1');
    expect(res.status).toBe(500);
    expect(res.text).toBe('サーバーエラーが発生しました');
    // expect(Logger.error).toHaveBeenCalledWith(
    //   expect.stringContaining('エラー: GET /api/transactions/1 - Test error'),
    // );
  });
});
// 更新画面 PUTメソッド 正常系テスト
describe('PUT /api/transactions/:id', () => {
  test('should update a transaction', async () => {
    const updatedTransaction = {
      id: 1,
      amount: 2000,
      type: '収入',
      date: new Date().toISOString().slice(0, 10),
      category: '給与',
      description: 'Updated',
    };

    const res = await request(app)
      .put('/api/transactions/1')
      .send(updatedTransaction);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ...updatedTransaction, categoryId: 2 });
    //   expect(Logger.error).not.toHaveBeenCalled();
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
    // expect(Logger.error).toHaveBeenCalledWith(
    //   expect.stringContaining('無効な入力です'),
    // );
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
    // expect(Logger.error).toHaveBeenCalledWith(
    //   expect.stringContaining('無効な入力です'),
    // );
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
    // expect(Logger.error).toHaveBeenCalledWith(
    //   expect.stringContaining('無効な入力です'),
    // );
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
    // expect(Logger.error).toHaveBeenCalledWith(
    //   expect.stringContaining('無効な入力です'),
    // );
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
    //   expect(Logger.error).not.toHaveBeenCalled();
    // });
    // 更新画面PUT エラーハンドリングのテスト
    it('should handle errors', async () => {
      const updatedTransaction = {
        amount: 2000,
        type: '収入',
        date: new Date().toISOString(),
        category: '給与',
        description: 'Updated',
      };

      const res = await request(app)
        .put('/api/transactions/1')
        .send(updatedTransaction);
      expect(res.status).toBe(500);
      expect(res.text).toBe('サーバーエラーが発生しました');
      // expect(Logger.error).toHaveBeenCalledWith(
      //   expect.stringContaining('エラー: PUT /api/transactions/1 - Test error'),
      // );
    });
  });
});

// DELETE画面 DELETEメソッド テスト
describe('DELETE /api/transactions/:id', () => {
  test('should delete a transaction', async () => {
    const res = await request(app).delete('/api/transactions/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 1,
      amount: 2000,
      type: '支出',
      date: expect.any(String), // Date 型は適切なフォーマットで返されるかを確認
      categoryId: 2,
      description: 'Updated',
    });
    // expect(Logger.error).not.toHaveBeenCalled();
  });

  // 異常系: 無効なID
  test('should return 400 for invalid ID', async () => {
    const res = await request(app).delete('/api/transactions/invalid-id');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: '無効なIDです: 数値でなければなりません',
    });
    // expect(Logger.error).toHaveBeenCalledWith(
    //   expect.stringContaining('無効なIDです'),
    // );
  });

  // 異常系: 存在しないトランザクション
  test('should return 404 if transaction not found', async () => {
    const res = await request(app).delete('/api/transactions/9999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: 'トランザクションが見つかりません: ID 9999',
    });
    // expect(Logger.error).toHaveBeenCalledWith(
    //   expect.stringContaining('トランザクションが見つかりません'),
    // );
  });

  // エラーハンドリングのテスト
  it('should handle errors', async () => {
    const res = await request(app).delete('/api/transactions/1');
    expect(res.status).toBe(500);
    expect(res.text).toBe('サーバーエラーが発生しました');
    // expect(Logger.error).toHaveBeenCalledWith(
    //   expect.stringContaining('エラー: DELETE /api/transactions/1 - Test error'),
    // );
  });
});
