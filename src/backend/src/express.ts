// express.ts
import { PrismaClient } from '@prisma/client';

declare module 'express' {
  interface Request {
    prisma: PrismaClient;
  }
}

export {};
