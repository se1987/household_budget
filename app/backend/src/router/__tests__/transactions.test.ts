import dotenv from 'dotenv';
import request from 'supertest';
import express from 'express';
import prisma from '../../prisma';
import transactionsRouter from '../transactions';
import { expect, describe, beforeAll, afterAll } from '@jest/globals';

dotenv.config();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

const app = express();

app.use(express.json());
app.use('/transactions', transactionsRouter);

describe('Transaction API', () => {
  let transactionId: number;

  // TC01: すべての収入・支出情報を取得
  it('TC01: should get all transactions', async () => {
    const response = await request(app).get('/transactions');
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
  });

  // TC03: 新規収入・支出を作成
  it('TC03: should create a new transaction', async () => {
    const newTransaction = {
      amount: 1000,
      date: '2024-07-26T00:00:00.000Z',
      type: '収入',
      description: 'ボーナス',
      category: {
        id: 1,
        name: '給与',
      },
    };

    const response = await request(app)
      .post('/transactions')
      .send(newTransaction);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    transactionId = response.body.id; // 生成されたIDを保持
  });

  // TC02: 特定の収入・支出情報を取得
  it('TC02: should get a specific transaction by ID', async () => {
    const response = await request(app).get(`/transactions/${transactionId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', transactionId);
  });

  // TC04: 特定の収入・支出を更新
  it('TC04: should update a specific transaction', async () => {
    const updatedTransaction = {
      amount: 1500,
      date: '2024-08-01T00:00:00.000Z',
      type: '収入',
      description: 'ボーナス増額',
      category: {
        id: 1,
        name: '給与',
      },
    };

    const response = await request(app)
      .put(`/transactions/${transactionId}`)
      .send(updatedTransaction);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('amount', 1500);
  });

  // TC05: 特定の収入・支出を削除
  it('TC05: should delete a specific transaction', async () => {
    const response = await request(app).delete(
      `/transactions/${transactionId}`,
    );
    expect(response.status).toBe(204);
  });

  // TC10: 不正なリクエストで400エラーを確認
  it('TC10: should return 400 for invalid request', async () => {
    const invalidTransaction = {
      amount: 'invalid data',
    };

    const response = await request(app)
      .post('/transactions')
      .send(invalidTransaction);
    expect(response.status).toBe(400);
  });

  // TC11: 存在しないリソースで404エラーを確認
  it('TC11: should return 404 for non-existent transaction', async () => {
    const response = await request(app).get('/transactions/99999');
    expect(response.status).toBe(404);
  });
});
