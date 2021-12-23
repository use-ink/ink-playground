import { test, expect } from '@playwright/test';

test('title was found', async ({ page }) => {
  await page.goto('https://www.ink-playground.xyz/');
  const title = page.locator('title');
  await expect(title).toHaveText('ink! Playground');
});

test('rust analyzer is loading', async ({ page }) => {
  await page.goto('https://www.ink-playground.xyz/');
  const loadingAnalyzer = page.locator('data-testid=message-0');
  await expect(loadingAnalyzer).toHaveText('SYSTEM:Loading Rust Analyzer...');
});
