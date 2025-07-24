// tests/navigation.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import * as path from 'path';
import * as fs from 'fs';

test.describe('Navigation Functionality', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }, testInfo) => {
    homePage = new HomePage(page);
    await homePage.navigate(); // Navega a la página principal antes de cada test

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

  test('should navigate to the Getting Started page and verify content', async ({ page }, testInfo) => {
    // 1. Navegar a la sección "Getting Started"
    await homePage.navigateToGettingStarted();

    // Captura de pantalla después de la navegación
    const testScreenshotDir = path.join(__dirname, `../screenshots/${testInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}`);
    await page.screenshot({ path: path.join(testScreenshotDir, '02_after_navigation.png') });

    // 2. Verificaciones (Assertions)
    // Confirmamos que la URL es 'intro' (esto ya pasaba)
    await expect(page).toHaveURL('https://playwright.dev/docs/intro'); 
    
    // CAMBIO 1: Ajustar el título de la página esperado a "Installation"
    await expect(page).toHaveTitle(/Installation \| Playwright/);

    // CAMBIO 2: Ajustar el encabezado principal esperado a "Installation"
    await expect(page.getByRole('heading', { name: 'Installation', exact: true })).toBeVisible();
  });
});