import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly searchButton: Locator;
  readonly searchInput: Locator;
  readonly searchDropdownContainer: Locator;
  readonly searchResultsList: Locator;
  readonly searchResultTitles: Locator;
  readonly gettingStartedLink: Locator; 
  readonly feedbackInput: Locator; 
  readonly sendFeedbackButton: Locator; 
  
  // Localizadores para la barra lateral
  readonly sidebar: Locator; 
  readonly sidebarLinkWritingTests: Locator;
  readonly sidebarLinkActions: Locator;


  constructor(page: Page) {
    this.page = page;
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.searchInput = page.getByPlaceholder('Search docs');
    this.searchDropdownContainer = page.locator('.DocSearch-Dropdown-Container'); 
    this.searchResultsList = this.searchDropdownContainer.locator('section.DocSearch-Hits ul[role="listbox"]').first();
    this.searchResultTitles = this.searchResultsList.locator('.DocSearch-Hit-title'); 
    
    this.gettingStartedLink = page.getByRole('link', { name: 'Getting started', exact: true });

    this.feedbackInput = page.getByLabel('Feedback');
    this.sendFeedbackButton = page.getByRole('button', { name: 'Send' });

    // Localizador para el contenedor principal de la barra lateral
    this.sidebar = page.locator('nav[aria-label="Docs sidebar"]'); 
    
    // Localizadores para los enlaces de la barra lateral, anidados dentro del sidebar
    this.sidebarLinkWritingTests = this.sidebar.getByRole('link', { name: 'Writing tests', exact: true }).first(); 
    this.sidebarLinkActions = this.sidebar.getByRole('link', { name: 'Actions', exact: true });
  }

  /**
   * Navega a la URL base de la aplicación.
   * Espera que la página cargue completamente y que el botón de búsqueda sea visible y esté habilitado.
   */
  async navigate() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded'); // Esperamos a que el DOM esté completamente cargado
    await expect(this.searchButton).toBeVisible();
    await expect(this.searchButton).toBeEnabled();
  }

  /**
   * Realiza una búsqueda en la documentación de Playwright.
   * @param searchText El texto a buscar.
   */
  async performSearch(searchText: string) {
    await this.searchButton.click();
    await expect(this.searchInput).toBeVisible();
    await this.searchInput.fill(searchText);
    
    await expect(this.searchDropdownContainer).toBeVisible({ timeout: 15000 });
    await expect(this.searchResultsList).toBeVisible({ timeout: 10000 }); 
  }

  /**
   * Obtiene los títulos de los resultados de búsqueda.
   * @returns Una promesa que resuelve con un array de strings, cada uno siendo un título de resultado.
   */
  async getSearchResultTitles(): Promise<string[]> {
    await expect(this.searchResultTitles.first()).toBeVisible({ timeout: 10000 }); 
    return this.searchResultTitles.allTextContents();
  }

  /**
   * Navega a la sección "Getting started" haciendo clic en su enlace.
   */
  async navigateToGettingStarted() {
    await expect(this.gettingStartedLink).toBeVisible();
    await this.gettingStartedLink.click();
  }

  /**
   * Intenta enviar un mensaje de feedback. (Nota: esta sección ya no existe en la página).
   * @param message El mensaje de feedback a enviar.
   */
  async submitFeedback(message: string) {
    // Este método está aquí por referencia histórica, pero la funcionalidad de feedback
    // ya no está presente en la página, por lo que este método probablemente fallaría.
    await this.feedbackInput.scrollIntoViewIfNeeded(); 
    await expect(this.feedbackInput).toBeVisible();
    await this.feedbackInput.fill(message);
    await expect(this.sendFeedbackButton).toBeEnabled(); 
    await this.sendFeedbackButton.click();
  }

  /**
   * Navega a una subsección específica dentro de la barra lateral.
   * @param sectionName El nombre de la sección principal (ej. 'Writing tests').
   * @param subSectionName El nombre de la subsección (ej. 'Actions').
   * @param options Opciones adicionales, como un timeout.
   */
  async navigateToSidebarSection(sectionName: 'Writing tests', subSectionName: 'Actions', options?: { timeout?: number }) {
    // Primero, esperamos a que la barra lateral esté visible.
    // Usamos las opciones de timeout pasadas al método.
    await expect(this.sidebar).toBeVisible(options); 

    // Luego, hacemos clic en la sección principal.
    // El .first() asegura que interactuamos con el primer enlace si hay duplicados.
    await expect(this.sidebarLinkWritingTests).toBeEnabled();
    await this.sidebarLinkWritingTests.click(); 

    // Finalmente, hacemos clic en la subsección.
    await expect(this.sidebarLinkActions).toBeEnabled();
    await this.sidebarLinkActions.click();
  }
}