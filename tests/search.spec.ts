// tests/search.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import * as path from 'path';
import * as fs from 'fs';

test.describe('Search Functionality on Playwright Documentation', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }, testInfo) => {
    homePage = new HomePage(page);
    await homePage.navigate();

    const testScreenshotDir = path.join(__dirname, `../screenshots/${testInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}`);
    fs.mkdirSync(testScreenshotDir, { recursive: true });

    await page.screenshot({ path: path.join(testScreenshotDir, '01_start_of_test.png') });
  });

  test.afterEach(async ({ page }, testInfo) => {
    const testScreenshotDir = path.join(__dirname, `../screenshots/${testInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}`);
    await page.screenshot({ path: path.join(testScreenshotDir, '03_end_of_test.png') });
  });

  test('should find relevant results when searching for "trace viewer"', async ({ page }, testInfo) => {
    const searchTerm = 'trace viewer';

    await homePage.performSearch(searchTerm);

    const testScreenshotDir = path.join(__dirname, `../screenshots/${testInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}`);
    await page.screenshot({ path: path.join(testScreenshotDir, '02_after_search.png') });

    // 1. Verificar que el contenedor general de resultados de búsqueda se muestra
    await expect(homePage.searchResultsList).toBeVisible(); 

    // 2. Verificar que al menos un resultado contiene el texto "trace viewer" en su título
    const resultTitles = await homePage.getSearchResultTitles();

    const foundRelevantResult = resultTitles.some(title =>
      title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(foundRelevantResult).toBeTruthy();
    console.log(`Resultados de búsqueda para "${searchTerm}":`, resultTitles);
  });

  test('should navigate to the home page successfully', async ({ page }, testInfo) => {
    // Este test solo verifica la navegación inicial que ya hace el beforeEach,
    // por lo que podría ser redundante si la URL de partida es siempre la misma.
    // Sin embargo, lo mantendremos por ahora como un ejemplo de aserción de URL.
    await expect(page).toHaveURL('https://playwright.dev/');

    const testScreenshotDir = path.join(__dirname, `../screenshots/${testInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}`);
    await page.screenshot({ path: path.join(testScreenshotDir, '02_home_page_verification.png') });
  });
});