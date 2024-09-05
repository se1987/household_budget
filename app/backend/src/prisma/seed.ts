import prisma from ".";

async function main() {
  // カテゴリーの作成
  const category1 = await prisma.category.create({
    data: {
      name: "給与",
    },
  });

  const category2 = await prisma.category.create({
    data: {
      name: "食費",
    },
  });

  // トランザクションの作成
  await prisma.transaction.create({
    data: {
      amount: 500000,
      date: new Date("2024-07-26"),
      type: "収入",
      description: "7月分の給与",
      categoryId: category1.id, // リレーション
    },
  });

  await prisma.transaction.create({
    data: {
      amount: 3000,
      date: new Date("2024-07-27"),
      type: "支出",
      description: "昼食代",
      categoryId: category2.id, // リレーション
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
