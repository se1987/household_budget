// __tests__/transactions.test.ts

import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// すべてのテストが実行される前に、Prismaクライアントをデータベースに接続
beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Transactions API', () => {
  it('should get all transactions', async () => {
    const response = await request(app).get('/api/transactions');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it('should create a new transaction', async () => {
    const newTransaction = {
      amount: 1000,
      type: '支出',
      date: new Date().toISOString(),
      category: 'Food',
      description: 'Lunch',
    };

    const response = await request(app)
      .post('/api/transactions')
      .send(newTransaction);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  // 他のテストケースも同様に追加
});
