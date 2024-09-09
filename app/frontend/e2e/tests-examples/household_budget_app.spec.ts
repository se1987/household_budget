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
});

// 収支入力画面
test('addTransactionTest', async ({ page }) => {
  await page.goto('http://localhost:3001/pages/add');
  // ページが完全にロードされるまで待つ
  await page.waitForLoadState('networkidle');

  // 日付入力
  await page.fill('input[name="date"]', '2024-09-09'); // ここで適切なセレクタを使用します

  // 区分選択
  await page.selectOption('select#type', '収入');

  // 項目入力
  await page.selectOption('select#category', '給与'); // 項目が入力フィールドである場合

  // 金額入力
  await page.fill('input#amount', '100000'); // 金額入力フィールドに入力

  // 入力後の確認や送信など
  await page.click('button[type="submit"]'); // 送信ボタンをクリックするなど

  // 追加された取引がリストに表示されていることを確認
  await page.goto('http://localhost:3001/');
  await page.waitForLoadState('networkidle');
  // '日付' や '金額' などの部分テキストが表示されていることを確認
  const transactionElement = await page.getByRole('link', {
    name: '/9/9 収入 カテゴリ: 給与 金額: ¥100,000',
  });
  await expect(transactionElement).toBeVisible({ timeout: 10000 });
});

// 月間サマリー画面
test('monthSummaryTest', async ({ page }) => {
  await page.goto('http://localhost:3001/pages/monthly-summary');
  await page.waitForLoadState('networkidle');
  // 月間レポートのテキストが表示されるまで待機
  // '月間レポート' ヘッディングが表示されることを確認
  const reportHeading = await page.getByRole('heading', {
    name: '月間レポート',
  });
  await expect(reportHeading).toBeVisible({ timeout: 10000 });

  // 収入合計の表示を確認
  const incomeText = await page.getByText('収入合計:');
  await expect(incomeText).toBeVisible({ timeout: 10000 });

  // 支出合計の表示を確認
  const expenseText = await page.getByText('支出合計:');
  await expect(expenseText).toBeVisible({ timeout: 10000 });

  // 合計金額の表示を確認（具体的な値を使用せず、固定部分のテキストで確認）
  const incomeAmountText = await page.getByText('¥1,000,000円');
  await expect(incomeAmountText).toBeVisible({ timeout: 10000 });

  const expenseAmountText = await page.getByText('¥500円');
  await expect(expenseAmountText).toBeVisible({ timeout: 10000 });

  const totalAmountText = await page.getByText('¥999,500円');
  await expect(totalAmountText).toBeVisible({ timeout: 10000 });
});
