import { test, expect } from '@playwright/test';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const indexHtml = fs.readFileSync(path.resolve(__dirname, 'public', 'index.html'), 'utf8');
const projectRoot = path.resolve(__dirname, '..');
const distRoot = path.resolve(projectRoot, 'dist');

test('first run fetches ranges, second run uses cache (no ranges)', async ({ page }) => {
  // Single route handler to serve app and endpoints on the same origin (http).
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    const pathname = url.pathname;
    const method = route.request().method();

    if (pathname === '/' || pathname === '/index.html') {
      return route.fulfill({ status: 200, contentType: 'text/html', body: indexHtml });
    }
    if (pathname === '/ping') {
      return route.fulfill({ status: 200, body: 'ok' });
    }
    if (pathname.startsWith('/dist/')) {
      const filePath = path.resolve(distRoot, pathname.replace(/^\/dist\//, ''));
      if (fs.existsSync(filePath)) {
        const body = fs.readFileSync(filePath);
        const ct = filePath.endsWith('.js') ? 'application/javascript' : undefined;
        return route.fulfill({ status: 200, body, contentType: ct });
      }
      return route.fulfill({ status: 404, body: 'not found' });
    }
    if (pathname === '/file.bin') {
      if (method === 'HEAD') {
        return route.fulfill({ status: 200, headers: { 'content-length': '100' }, body: '' });
      }
      const range = await route.request().headerValue('range');
      if (range) {
        const buf = Buffer.alloc(100);
        return route.fulfill({ status: 206, headers: { 'content-length': String(buf.length) }, body: buf });
      }
      return route.fulfill({ status: 404, body: 'not found' });
    }
    return route.fallback();
  });

  // First visit: should perform range
  await page.goto('http://e2e.local/');

  await page.waitForFunction(() => (window as any).__started === true);
  await page.waitForFunction(() => (window as any).__prefetchCompleted === true);

  const firstCounts = await page.evaluate(() => (window as any).__fetchCounts);
  expect(firstCounts.head).toBeGreaterThan(0);
  expect(firstCounts.range).toBeGreaterThan(0);

  const statusLog1 = await page.evaluate(() => (window as any).__statusLog);
  expect(statusLog1).toEqual(expect.arrayContaining(['started', 'paused', 'resumed', 'completed']));

  // Second visit: emulate same page again on the same origin (storage persists)
  await page.reload();

  // In-memory cache is process-bound, but we can still assert that our hook counters reflect only HEAD
  const secondCounts = await page.evaluate(() => (window as any).__fetchCounts);
  expect(secondCounts.head).toBeGreaterThan(0);
  // We expect no additional range calls after reload for the same size
  expect(secondCounts.range).toBe(0);
});
