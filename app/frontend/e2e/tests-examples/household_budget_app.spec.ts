import { test, expect } from '@playwright/test';

// Home画面

test('homeTest', async ({ page }) => {
  // ページに移動
  await page.goto('http://localhost:3001/');
  await page.waitForLoadState('networkidle');

  // '家計簿アプリ' ヘッディングが表示されていることを確認
  const appHeading = await page.getByRole('heading', { name: '家計簿アプリ' });
  await expect(appHeading).toBeVisible({ timeout: 10000 });

  // '入出金一覧' ヘッディングが表示されていることを確認
  const transactionsHeading = await page.getByRole('heading', {
    name: '入出金一覧',
  });
  await expect(transactionsHeading).toBeVisible({ timeout: 10000 });

  // 入出金一覧の特定のテキストが表示されていることを確認
  const transactionText = await page.getByText(
    '入出金一覧2024/9/5支出カテゴリ: 金額: ¥',
  );
  await expect(transactionText).toBeVisible({ timeout: 10000 });
});

// 収支入力画面
test('addTransactionTest', async ({ page }) => {
  await page.goto('http://localhost:3001/pages/add');
  // ページが完全にロードされるまで待つ
  await page.waitForLoadState('networkidle');

  // 日付入力
  await page.fill('input[name="date"]', '2024/9/9'); // ここで適切なセレクタを使用します

  // 区分選択
  await page.selectOption('select#type', '収入');

  // 項目入力
  await page.selectOption('select#category', '給与'); // 項目が入力フィールドである場合

  // 金額入力
  await page.fill('input#amount', '100000'); // 金額入力フィールドに入力

  // 入力後の確認や送信など
  await page.click('button[type="submit"]'); // 送信ボタンをクリックするなど
  // 6. 追加された取引がリストに表示されていることを確認
  const transactionElement = await page.getByText(
    '日付:2024/9/9 区分:収入 項目:給与 金額:¥100,000',
  );
  await expect(transactionElement).toBeVisible();
});

//

// 月間サマリー画面
test('monthSummaryTest', async ({ page }) => {
  await page.goto('http://localhost:3001/pages/monthly-summary');
  await page.waitForLoadState('networkidle');
  // 月間レポートのテキストが表示されるまで待機
  const summaryText = await page.getByText(
    '月間レポート収入合計:¥ 円支出合計:¥',
  );
  await expect(summaryText).toBeVisible({ timeout: 10000 }); // 表示を確認するだけの場合
});
