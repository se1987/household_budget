import request from 'supertest';
import dotenv from 'dotenv';
import express from 'express';
import prisma from '../../prisma';
import categoriesRouter from '../categories';

dotenv.config();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

const app = express();

app.use(express.json());
app.use('/categories', categoriesRouter);

describe('Category API', () => {
  let categoryId: number;

  // TC06: すべての費目情報を取得
  it('TC06: should get all categories', async () => {
    const response = await request(app).get('/categories');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  // TC08: 新規費目を作成
  it('TC08: should create a new category', async () => {
    const newCategory = { name: '投資' };

    const response = await request(app).post('/categories').send(newCategory);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    categoryId = response.body.id;
  });

  // TC07: 特定の費目情報を取得
  it('TC07: should get a specific category by ID', async () => {
    const response = await request(app).get(`/categories/${categoryId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', categoryId);
  });

  // TC09: 特定の費目を削除
  it('TC09: should delete a specific category', async () => {
    const response = await request(app).delete(`/categories/${categoryId}`);
    expect(response.status).toBe(204);
  });
});
