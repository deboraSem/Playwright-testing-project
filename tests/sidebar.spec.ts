// tests/sidebar.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage'; 
import * as path from 'path';
import * as fs from 'fs';

test.describe('Sidebar Navigation Functionality', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }, testInfo) => {
    homePage = new HomePage(page);
    await page.goto('https://playwright.dev/docs/intro'); 
    await page.waitForLoadState('domcontentloaded'); 

    // Configuración para capturas de pantalla
    const testScreenshotDir = path.join(__dirname, `../screenshots/${testInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}`);
    fs.mkdirSync(testScreenshotDir, { recursive: true });
    await page.screenshot({ path: path.join(testScreenshotDir, '01_start_of_test.png') });
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Configuración para capturas de pantalla
    const testScreenshotDir = path.join(__dirname, `../screenshots/${testInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}`);
    await page.screenshot({ path: path.join(testScreenshotDir, '03_end_of_test.png') });
  });

  test('should navigate to "Actions" section via sidebar', async ({ page }, testInfo) => {
    await homePage.navigateToSidebarSection('Writing tests', 'Actions', { timeout: 10000 }); 
    
    const testScreenshotDir = path.join(__dirname, `../screenshots/${testInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}`);
    await page.screenshot({ path: path.join(testScreenshotDir, '02_after_sidebar_navigation.png') });

    // La URL es /docs/input
    await expect(page).toHaveURL('https://playwright.dev/docs/input'); 
    // *** CAMBIO AQUÍ: EL TÍTULO RECIBIDO ES "Actions | Playwright" ***
    await expect(page).toHaveTitle(/Actions \| Playwright/); 
    
    // El encabezado principal en la página /docs/input es "Actions"
    await expect(page.getByRole('heading', { name: 'Actions', exact: true })).toBeVisible();
  });
});