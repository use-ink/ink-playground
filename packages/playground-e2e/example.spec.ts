import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('https://www.ink-playground.xyz/');
  const title = page.locator('title');
  await expect(title).toHaveText('ink! Playground');
});
