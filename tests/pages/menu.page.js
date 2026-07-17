/**
 * MenuPage - Page Object para tela principal/menu
 * Responsável por navegação e elementos do menu principal
 */

const BasePage = require('./base.page');
const { PLATFORM } = require('../helpers/constants');
const { log } = require('../helpers/utils');

class MenuPage extends BasePage {
  // ===================================
  // Elementos - Selectors
  // ===================================

  /**
   * Selector para título do menu
   * @returns {string}
   */
  get menuTitle() {
    return this.getPlatformSelector({
      android: '//android.view.View[@text="WebView"]',
      ios: "//XCUIElementTypeStaticText[@name='WebView']",
      default: '//android.view.View[@text="WebView"]',
    });
  }

  /**
   * Selector para aba Home
   * @returns {string}
   */
  get homeTab() {
    return this.getPlatformSelector({
      android: '//android.widget.Button[@content-desc="Home"]',
      ios: "//XCUIElementTypeButton[@name='Home']",
      default: '//android.widget.Button[@content-desc="Home"]',
    });
  }

  /**
   * Selector para aba WebView
   * @returns {string}
   */
  get webViewTab() {
    return this.getPlatformSelector({
      android: '//android.widget.Button[@content-desc="WebView"]',
      ios: "//XCUIElementTypeButton[@name='WebView']",
      default: '//android.widget.Button[@content-desc="WebView"]',
    });
  }

  /**
   * Selector para aba Forms
   * @returns {string}
   */
  get formsTab() {
    return this.getPlatformSelector({
      android: '//android.widget.Button[@content-desc="Forms"]',
      ios: "//XCUIElementTypeButton[@name='Forms']",
      default: '//android.widget.Button[@content-desc="Forms"]',
    });
  }

  /**
   * Selector para aba Swipe
   * @returns {string}
   */
  get swipeTab() {
    return this.getPlatformSelector({
      android: '//android.widget.Button[@content-desc="Swipe"]',
      ios: "//XCUIElementTypeButton[@name='Swipe']",
      default: '//android.widget.Button[@content-desc="Swipe"]',
    });
  }

  /**
   * Selector para botão logout
   * @returns {string}
   */
  get logoutButton() {
    return this.getPlatformSelector({
      android: '//android.widget.Button[@text="Logout"]',
      ios: "//XCUIElementTypeButton[@name='Logout']",
      default: '//android.widget.Button[@text="Logout"]',
    });
  }

  /**
   * Selector para botão login (quando não logado)
   * @returns {string}
   */
  get loginButton() {
    return this.getPlatformSelector({
      android: '//android.widget.Button[@text="Login"]',
      ios: "//XCUIElementTypeButton[@name='Login']",
      default: '//android.widget.Button[@text="Login"]',
    });
  }

  // ===================================
  // Navegação por Abas
  // ===================================

  /**
   * Clica na aba Home
   */
  async clickHomeTab() {
    log(`Clicando na aba Home`, 'info');
    await this.clickElement($(this.homeTab));
  }

  /**
   * Clica na aba WebView
   */
  async clickWebViewTab() {
    log(`Clicando na aba WebView`, 'info');
    await this.clickElement($(this.webViewTab));
  }

  /**
   * Clica na aba Forms
   */
  async clickFormsTab() {
    log(`Clicando na aba Forms`, 'info');
    await this.clickElement($(this.formsTab));
  }

  /**
   * Clica na aba Swipe
   */
  async clickSwipeTab() {
    log(`Clicando na aba Swipe`, 'info');
    await this.clickElement($(this.swipeTab));
  }

  /**
   * Navega para aba específica
   * @param {string} tabName - Nome da aba (home, webview, forms, swipe)
   */
  async navigateToTab(tabName) {
    log(`Navegando para aba: ${tabName}`, 'info');

    const tabs = {
      home: () => this.clickHomeTab(),
      webview: () => this.clickWebViewTab(),
      forms: () => this.clickFormsTab(),
      swipe: () => this.clickSwipeTab(),
    };

    if (tabs[tabName]) {
      await tabs[tabName]();
    } else {
      throw new Error(`Aba "${tabName}" não reconhecida`);
    }
  }

  // ===================================
  // Validações
  // ===================================

  /**
   * Verifica se está no menu principal
   * @returns {Promise<boolean>}
   */
  async isOnMenu() {
    try {
      const title = $(this.menuTitle);
      await this.waitForElementVisible(title);
      return await this.isElementVisible(title);
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica se aba está ativa/selecionada
   * @param {string} tabName - Nome da aba
   * @returns {Promise<boolean>}
   */
  async isTabActive(tabName) {
    try {
      const tabs = {
        home: this.homeTab,
        webview: this.webViewTab,
        forms: this.formsTab,
        swipe: this.swipeTab,
      };

      const tabElement = $(tabs[tabName]);

      if (!await this.isElementVisible(tabElement)) {
        return false;
      }

      // Verificar atributo que indica aba ativa
      // Isso varia por app - ajuste conforme necessário
      const selected = await tabElement.getAttribute('selected');
      return selected === 'true' || selected === true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica se todas as abas estão visíveis
   * @returns {Promise<boolean>}
   */
  async areAllTabsVisible() {
    try {
      const tabs = [
        $(this.homeTab),
        $(this.webViewTab),
        $(this.formsTab),
        $(this.swipeTab),
      ];

      for (const tab of tabs) {
        if (!await this.isElementVisible(tab)) {
          return false;
        }
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica se usuário está logado (botão logout visível)
   * @returns {Promise<boolean>}
   */
  async isLoggedIn() {
    try {
      return await this.isElementVisible($(this.logoutButton));
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica se usuário não está logado (botão login visível)
   * @returns {Promise<boolean>}
   */
  async isNotLoggedIn() {
    try {
      return await this.isElementVisible($(this.loginButton));
    } catch (error) {
      return false;
    }
  }

  // ===================================
  // Ações de Menu
  // ===================================

  /**
   * Realiza logout
   */
  async performLogout() {
    log(`Realizando logout`, 'info');

    if (await this.isLoggedIn()) {
      await this.clickElement($(this.logoutButton));
      await this.wait(2000); // Aguardar logout
    }
  }

  /**
   * Navega para tela de login
   */
  async navigateToLogin() {
    log(`Navegando para tela de login`, 'info');

    if (await this.isNotLoggedIn()) {
      await this.clickElement($(this.loginButton));
    } else if (await this.isLoggedIn()) {
      // Se estiver logado, fazer logout primeiro
      await this.performLogout();
      await this.clickElement($(this.loginButton));
    }
  }

  // ===================================
  // Navegação Multi-step
  // ===================================

  /**
   * Navega por todas as abas em sequência
   */
  async navigateThroughAllTabs() {
    log(`Navegando por todas as abas`, 'info');

    const tabs = ['home', 'webview', 'forms', 'swipe'];

    for (const tab of tabs) {
      await this.navigateToTab(tab);
      await this.wait(1000); // Aguardar transição
    }
  }

  /**
   * Testa acessibilidade de todas as abas
   * @returns {Promise<object>} - Status de cada aba
   */
  async testAllTabsAccessibility() {
    log(`Testando acessibilidade das abas`, 'info');

    const tabs = ['home', 'webview', 'forms', 'swipe'];
    const results = {};

    for (const tab of tabs) {
      try {
        await this.navigateToTab(tab);
        const isActive = await this.isTabActive(tab);
        results[tab] = {
          accessible: true,
          active: isActive,
        };
      } catch (error) {
        results[tab] = {
          accessible: false,
          error: error.message,
        };
      }
    }

    return results;
  }

  // ===================================
  // Informações da Tela
  // ===================================

  /**
   * Obtém texto do título do menu
   * @returns {Promise<string>}
   */
  async getMenuTitle() {
    return await this.getElementText($(this.menuTitle));
  }

  /**
   * Obtém quantidade de abas disponíveis
   * @returns {Promise<number>}
   */
  async getTabCount() {
    try {
      const tabs = [
        $(this.homeTab),
        $(this.webViewTab),
        $(this.formsTab),
        $(this.swipeTab),
      ];

      let count = 0;
      for (const tab of tabs) {
        if (await this.isElementVisible(tab)) {
          count++;
        }
      }

      return count;
    } catch (error) {
      return 0;
    }
  }

  // ===================================
  // Debug
  // ===================================

  /**
   * Log estado atual do menu
   */
  async logMenuState() {
    log('=== Menu State ===', 'info');

    try {
      const isLoggedIn = await this.isLoggedIn();
      const tabCount = await this.getTabCount();
      const menuTitle = await this.getMenuTitle();

      log(`Logged In: ${isLoggedIn}`, 'info');
      log(`Tab Count: ${tabCount}`, 'info');
      log(`Menu Title: ${menuTitle}`, 'info');
      log(`Tabs Visible:`, 'info');

      const tabs = ['home', 'webview', 'forms', 'swipe'];
      for (const tab of tabs) {
        const isActive = await this.isTabActive(tab);
        log(`  ${tab}: ${isActive ? 'ACTIVE' : 'inactive'}`, 'info');
      }
    } catch (error) {
      log(`Erro ao obter estado: ${error.message}`, 'error');
    }
  }
}

module.exports = MenuPage;
