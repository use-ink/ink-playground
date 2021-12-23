import { test, expect } from '@playwright/test';
import * as env from './env';

test('title was found', async ({ page }) => {
  await page.goto('http://www.ink-playground.xyz');
  const title = page.locator('title');
  await expect(title).toHaveText('ink! Playground');
});

test('rust analyzer is loading', async ({ page }) => {
  await page.goto(env.PLAYGROUND_URL);
  const loadingAnalyzer = page.locator('data-testid=message-0');
  await expect(loadingAnalyzer).toHaveText('SYSTEM:Loading Rust Analyzer...');
  await expect(loadingAnalyzer).toHaveText('SYSTEM:Rust Analyzer Ready', { timeout: 100 });
});
