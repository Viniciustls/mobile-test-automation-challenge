/**
 * NavigationPage - Page Object para navegação entre telas
 * Responsável por gerenciar transições e verificações de navegação
 */

const BasePage = require('./base.page');
const { PLATFORM } = require('../helpers/constants');
const { log } = require('../helpers/utils');

class NavigationPage extends BasePage {
  // ===================================
  // Construtor
  // ===================================

  constructor() {
    super();
    this.pageHistory = [];
  }

  // ===================================
  // Detectar Tela Atual
  // ===================================

  /**
   * Detecta em qual tela está baseado em elementos únicos
   * @returns {Promise<string>} - Nome da tela atual
   */
  async getCurrentScreen() {
    try {
      // Verificar tela de Login
      const loginTitle = this.getPlatformSelector({
        android: '//android.view.View[@text="Login"]',
        ios: "//XCUIElementTypeStaticText[@name='Login']",
        default: '//android.view.View[@text="Login"]',
      });

      if (await this.isElementVisible($(loginTitle))) {
        return 'login';
      }

      // Verificar tela de Sign Up
      const signUpTitle = this.getPlatformSelector({
        android: '//android.view.View[@text="Sign Up"]',
        ios: "//XCUIElementTypeStaticText[@name='Sign Up']',
        default: '//android.view.View[@text="Sign Up"]',
      });

      if (await this.isElementVisible($(signUpTitle))) {
        return 'signup';
      }

      // Verificar tela Menu (WebView)
      const menuTitle = this.getPlatformSelector({
        android: '//android.view.View[@text="WebView"]',
        ios: "//XCUIElementTypeStaticText[@name='WebView']",
        default: '//android.view.View[@text="WebView"]',
      });

      if (await this.isElementVisible($(menuTitle))) {
        return 'menu';
      }

      // Verificar tela Forms
      const formsTitle = this.getPlatformSelector({
        android: '//android.view.View[@text="Forms"]',
        ios: "//XCUIElementTypeStaticText[@name='Forms']",
        default: '//android.view.View[@text="Forms"]',
      });

      if (await this.isElementVisible($(formsTitle))) {
        return 'forms';
      }

      // Verificar tela Swipe
      const swipeTitle = this.getPlatformSelector({
        android: '//android.view.View[@text="Swipe"]',
        ios: "//XCUIElementTypeStaticText[@name='Swipe']',
        default: '//android.view.View[@text="Swipe"]',
      });

      if (await this.isElementVisible($(swipeTitle))) {
        return 'swipe';
      }

      // Verificar tela Home
      const homeTitle = this.getPlatformSelector({
        android: '//android.view.View[@text="Home"]',
        ios: "//XCUIElementTypeStaticText[@name='Home']",
        default: '//android.view.View[@text="Home"]',
      });

      if (await this.isElementVisible($(homeTitle))) {
        return 'home';
      }

      return 'unknown';
    } catch (error) {
      log(`Erro ao detectar tela: ${error.message}`, 'error');
      return 'error';
    }
  }

  // ===================================
  // Navegação com Verificação
  // ===================================

  /**
   * Navega e verifica se chegou na tela correta
   * @param {string} targetScreen - Tela destino
   * @param {Function} navigationAction - Ação de navegação
   * @returns {Promise<boolean>}
   */
  async navigateAndVerify(targetScreen, navigationAction) {
    try {
      const beforeScreen = await this.getCurrentScreen();
      log(`Navegando de ${beforeScreen} para ${targetScreen}`, 'info');

      await navigationAction();
      await this.wait(2000); // Aguardar transição

      const afterScreen = await this.getCurrentScreen();
      const success = afterScreen === targetScreen;

      if (success) {
        log(`Navegação bem-sucedida: ${beforeScreen} -> ${afterScreen}`, 'success');
      } else {
        log(`Navegação falhou: esperava ${targetScreen}, chegou em ${afterScreen}`, 'warning');
      }

      this.pageHistory.push({ from: beforeScreen, to: afterScreen, success });

      return success;
    } catch (error) {
      log(`Erro na navegação: ${error.message}`, 'error');
      return false;
    }
  }

  /**
   * Verifica se consegue navegar de uma tela para outra
   * @param {string} fromScreen - Tela origem
   * @param {string} toScreen - Tela destino
   * @returns {Promise<boolean>}
   */
  async canNavigate(fromScreen, toScreen) {
    try {
      const current = await this.getCurrentScreen();

      if (current !== fromScreen) {
        log(`Não está na tela ${fromScreen}, está em ${current}`, 'warning');
        return false;
      }

      // Implementar lógica específica para cada transição
      const navigationMap = {
        'login->signup': async () => {
          const signUpButton = this.getPlatformSelector({
            android: '//android.widget.Button[@text="Sign up"]',
            ios: "//XCUIElementTypeButton[@name='button-SIGN UP']",
            default: '//android.widget.Button[@text="Sign up"]',
          });
          await this.clickElement($(signUpButton));
        },
        'signup->login': async () => {
          const backButton = this.getPlatformSelector({
            android: '//android.widget.Button[@content-desc="Go back"]',
            ios: "//XCUIElementTypeButton[@name='Go back']",
            default: '//android.widget.Button[@content-desc="Go back"]',
          });
          await this.clickElement($(backButton));
        },
        'menu->forms': async () => {
          const formsTab = this.getPlatformSelector({
            android: '//android.widget.Button[@content-desc="Forms"]',
            ios: "//XCUIElementTypeButton[@name='Forms']",
            default: '//android.widget.Button[@content-desc="Forms"]',
          });
          await this.clickElement($(formsTab));
        },
        'menu->swipe': async () => {
          const swipeTab = this.getPlatformSelector({
            android: '//android.widget.Button[@content-desc="Swipe"]',
            ios: "//XCUIElementTypeButton[@name='Swipe']",
            default: '//android.widget.Button[@content-desc="Swipe"]',
          });
          await this.clickElement($(swipeTab));
        },
      };

      const key = `${fromScreen}->${toScreen}`;
      if (navigationMap[key]) {
        return await this.navigateAndVerify(toScreen, navigationMap[key]);
      }

      log(`Transição ${key} não implementada`, 'warning');
      return false;
    } catch (error) {
      log(`Erro ao verificar navegação: ${error.message}`, 'error');
      return false;
    }
  }

  // ===================================
  // Verificações de Navegação
  // ===================================

  /**
   * Verifica se tela específica está acessível
   * @param {string} screenName - Nome da tela
   * @returns {Promise<boolean>}
   */
  async isScreenAccessible(screenName) {
    try {
      const current = await this.getCurrentScreen();

      if (current === screenName) {
        return true;
      }

      // Tentar navegar até a tela
      return await this.canNavigate(current, screenName);
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica se consegue voltar para tela anterior
   * @returns {Promise<boolean>}
   */
  async canGoBack() {
    try {
      const before = await this.getCurrentScreen();
      await this.goBack();
      await this.wait(2000);
      const after = await this.getCurrentScreen();

      return before !== after && after !== 'error';
    } catch (error) {
      return false;
    }
  }

  /**
   * Testa navegação entre duas telas (ida e volta)
   * @param {string} fromScreen - Tela origem
   * @param {string} toScreen - Tela destino
   * @returns {Promise<object>} - Resultado do teste
   */
  async testRoundTrip(fromScreen, toScreen) {
    const result = {
      forward: false,
      back: false,
      success: false,
    };

    try {
      // Testar ida
      result.forward = await this.canNavigate(fromScreen, toScreen);

      if (result.forward) {
        // Testar volta
        await this.wait(1000);
        result.back = await this.canNavigate(toScreen, fromScreen);
      }

      result.success = result.forward && result.back;
    } catch (error) {
      log(`Erro no teste round-trip: ${error.message}`, 'error');
    }

    return result;
  }

  // ===================================
  // Histórico de Navegação
  // ===================================

  /**
   * Obtém histórico de navegação
   * @returns {Array<object>}
   */
  getPageHistory() {
    return this.pageHistory;
  }

  /**
   * Limpa histórico de navegação
   */
  clearPageHistory() {
    this.pageHistory = [];
  }

  /**
   * Verifica se navegação específica ocorreu
   * @param {string} fromScreen - Tela origem
   * @param {string} toScreen - Tela destino
   * @returns {boolean}
   */
  didNavigate(fromScreen, toScreen) {
    return this.pageHistory.some(
      nav => nav.from === fromScreen && nav.to === toScreen && nav.success
    );
  }

  // ===================================
  // Navegação Multi-telas
  // ===================================

  /**
   * Navega por uma lista de telas em sequência
   * @param {Array<string>} screens - Lista de telas para visitar
   * @returns {Promise<object>} - Resultado de cada navegação
   */
  async navigateThroughScreens(screens) {
    const results = {};

    for (let i = 0; i < screens.length - 1; i++) {
      const from = screens[i];
      const to = screens[i + 1];
      const key = `${from}->${to}`;

      results[key] = await this.canNavigate(from, to);

      if (!results[key]) {
        log(`Navegação falhou em ${key}, parando sequência`, 'warning');
        break;
      }

      await this.wait(1000);
    }

    return results;
  }

  /**
   * Testa todas as navegações principais do app
   * @returns {Promise<object>} - Resultado de cada teste
   */
  async testAllMainNavigations() {
    log(`Testando todas as navegações principais`, 'info');

    const navigations = [
      { from: 'login', to: 'signup' },
      { from: 'signup', to: 'login' },
      { from: 'login', to: 'menu' }, // Após login
      { from: 'menu', to: 'forms' },
      { from: 'menu', to: 'swipe' },
    ];

    const results = {};

    for (const nav of navigations) {
      const key = `${nav.from}->${nav.to}`;
      results[key] = await this.testRoundTrip(nav.from, nav.to);
    }

    return results;
  }

  // ===================================
  // Debug e Informações
  // ===================================

  /**
   * Log tela atual e opções de navegação disponíveis
   */
  async logNavigationInfo() {
    const current = await this.getCurrentScreen();
    log(`=== Navigation Info ===`, 'info');
    log(`Current Screen: ${current}`, 'info');
    log(`Page History:`, 'info');

    this.pageHistory.forEach((nav, index) => {
      log(`  ${index + 1}. ${nav.from} -> ${nav.to} (${nav.success ? '✅' : '❌'})`, 'info');
    });
  }

  /**
   * Obtém resumo de navegações testadas
   * @returns {object}
   */
  getNavigationSummary() {
    const total = this.pageHistory.length;
    const successful = this.pageHistory.filter(n => n.success).length;
    const failed = total - successful;

    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? (successful / total * 100).toFixed(2) + '%' : 'N/A',
    };
  }
}

module.exports = NavigationPage;
