import prisma from "../prisma";
import logger from "../context/logger";

// カテゴリー名からカテゴリーIDを取得、存在しない場合は作成してIDを返す関数
export const getOrCreateCategoryId = async (
  categoryName: string
): Promise<number> => {
  logger.debug(`♦♦カテゴリー名: ${categoryName} からカテゴリーIDを取得開始`);

  // カテゴリー名からカテゴリーを取得
  let existingCategory = await prisma.category.findFirst({
    where: { name: categoryName }, // カテゴリー名で検索
  });

  if (existingCategory) {
    logger.debug(
      `♦♦既存のカテゴリーが見つかりました: ${JSON.stringify(existingCategory)}`
    );
  } else {
    logger.debug(`♦♦カテゴリーが見つからないため、新規作成: ${categoryName}`);
  }

  // カテゴリーが存在しない場合は新規作成
  if (!existingCategory) {
    existingCategory = await prisma.category.create({
      data: { name: categoryName },
    });
    logger.debug(
      `♦♦新規カテゴリーが作成されました: ${JSON.stringify(existingCategory)}`
    );
  }

  /// カテゴリーIDを返す
  if (existingCategory && existingCategory.id) {
    logger.debug(`♦♦カテゴリーIDを返します: ${existingCategory.id}`);
    return existingCategory.id;
  } else {
    logger.error("♦♦カテゴリーIDの取得に失敗しました");
    throw new Error("カテゴリーIDの取得に失敗しました");
  }
};
