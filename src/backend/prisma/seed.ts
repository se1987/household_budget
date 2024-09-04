/// <reference types="node" />

import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

async function main() {
  // カテゴリーのシーディング
  const [category1, category2] = await Promise.all([
    prisma.category.create({ data: { name: '食費' } }),
    prisma.category.create({ data: { name: '日用品費' } })
  ])

  // トランザクションのシーディング
  await Promise.all([
    prisma.transaction.create({
      data: {
        amount: 1000,
        date: new Date(),
        type: '支出',
        categoryId: category1.id,
        description: 'Grocery shopping'
      },
    }),
    prisma.transaction.create({
      data: {
        amount: 500,
        date: new Date(),
        type: '支出',
        categoryId: category2.id,
        description: 'Bus ticket'
      },
    })
  ])

  console.log('Seeding completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
