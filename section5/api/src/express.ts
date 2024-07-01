import { PrismaClient } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      prisma: PrismaClient;
    }
  }
}

// 空のエクスポートを追加
export {};
