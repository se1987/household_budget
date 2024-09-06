import request from 'supertest';
import dotenv from 'dotenv';
import express from 'express';
import prisma from '../../prisma';
import { getOrCreateCategoryId } from '../../utils/categoryUtils';
import categoriesRouter from '../../router/categories';

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

describe('Category Utility - getOrCreateCategoryId', () => {
  let categoryName = 'テストカテゴリー';

  // テスト開始前にDBをリセット（必要に応じて）
  beforeAll(async () => {
    await prisma.category.deleteMany({
      where: {
        name: categoryName,
      },
    });
  });

  // TC01: カテゴリーが存在しない場合、新規作成しIDを取得
  it('TC01: should create a new category if it does not exist', async () => {
    const categoryId = await getOrCreateCategoryId(categoryName);
    expect(typeof categoryId).toBe('number');

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    expect(category).not.toBeNull();
    expect(category?.name).toBe(categoryName);
  });

  // TC02: 既存のカテゴリーが存在する場合、既存のIDを返す
  it('TC02: should return existing category ID if the category already exists', async () => {
    const firstCategoryId = await getOrCreateCategoryId(categoryName);
    const secondCategoryId = await getOrCreateCategoryId(categoryName);

    expect(firstCategoryId).toBe(secondCategoryId);
  });
});
