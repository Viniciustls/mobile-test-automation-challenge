/**
 * BasePage - Page Object base com métodos comuns
 * Todos os Page Objects devem herdar desta classe
 *
 * Princípios:
 * - Contém métodos genéricos usados por múltiplas páginas
 * - Fornece uma interface consistente para interação com elementos
 * - Reduz duplicação de código
 */

const { expect } = require('chai');
const { TIMEOUTS, PLATFORM } = require('../helpers/constants');
const { isAndroid, isIOS, waitForVisible, waitForClickable, log } = require('../helpers/utils');

class BasePage {
  // ===================================
  // Platform Detection
  // ===================================

  /**
   * Verifica se a plataforma é Android
   * @returns {Promise<boolean>}
   */
  async isAndroid() {
    return await isAndroid();
  }

  /**
   * Verifica se a plataforma é iOS
   * @returns {Promise<boolean>}
   */
  async isIOS() {
    return await isIOS();
  }

  // ===================================
  // Element Interactions - Básicas
  // ===================================

  /**
   * Clica em um elemento com wait
   * @param {WebdriverIO.Element} element - Elemento para clicar
   * @param {number} timeout - Timeout opcional
   */
  async clickElement(element, timeout = TIMEOUTS.MEDIUM) {
    try {
      log(`Clicando no elemento...`, 'info');
      await waitForClickable(element, timeout);
      await element.click();
    } catch (error) {
      throw new Error(`Erro ao clicar no elemento: ${error.message}`);
    }
  }

  /**
   * Preenche campo de texto
   * @param {WebdriverIO.Element} element - Campo de texto
   * @param {string} value - Valor para preencher
   * @param {boolean} clearFirst - Limpar campo antes (padrão: true)
   */
  async fillInput(element, value, clearFirst = true) {
    try {
      log(`Preenchendo campo com valor: "${value}"`, 'info');
      await waitForVisible(element);

      if (clearFirst) {
        await element.clearValue();
      }

      await element.setValue(value);
    } catch (error) {
      throw new Error(`Erro ao preencher campo: ${error.message}`);
    }
  }

  /**
   * Obtém texto de um elemento
   * @param {WebdriverIO.Element} element - Elemento
   * @returns {Promise<string>}
   */
  async getElementText(element) {
    try {
      await waitForVisible(element);
      return await element.getText();
    } catch (error) {
      throw new Error(`Erro ao obter texto do elemento: ${error.message}`);
    }
  }

  /**
   * Obtém valor de um input
   * @param {WebdriverIO.Element} element - Elemento input
   * @returns {Promise<string>}
   */
  async getElementValue(element) {
    try {
      await waitForVisible(element);
      return await element.getValue();
    } catch (error) {
      throw new Error(`Erro ao obter valor do elemento: ${error.message}`);
    }
  }

  // ===================================
  // Element Interactions - Avançadas
  // ===================================

  /**
   * Verifica se elemento está visível
   * @param {WebdriverIO.Element} element - Elemento
   * @returns {Promise<boolean>}
   */
  async isElementVisible(element) {
    try {
      return await element.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica se elemento existe
   * @param {WebdriverIO.Element} element - Elemento
   * @returns {Promise<boolean>}
   */
  async isElementExisting(element) {
    try {
      return await element.isExisting();
    } catch (error) {
      return false;
    }
  }

  /**
   * Aguarda elemento ficar visível
   * @param {WebdriverIO.Element} element - Elemento
   * @param {number} timeout - Timeout opcional
   */
  async waitForElementVisible(element, timeout = TIMEOUTS.MEDIUM) {
    try {
      await waitForVisible(element, timeout);
    } catch (error) {
      throw new Error(`Timeout aguardando elemento ficar visível: ${error.message}`);
    }
  }

  /**
   * Aguarda elemento ficar habilitado
   * @param {WebdriverIO.Element} element - Elemento
   * @param {number} timeout - Timeout opcional
   */
  async waitForElementEnabled(element, timeout = TIMEOUTS.MEDIUM) {
    try {
      await waitForClickable(element, timeout);
    } catch (error) {
      throw new Error(`Timeout aguardando elemento ficar habilitado: ${error.message}`);
    }
  }

  /**
   * Aguarda elemento existir no DOM
   * @param {WebdriverIO.Element} element - Elemento
   * @param {number} timeout - Timeout opcional
   */
  async waitForElementExist(element, timeout = TIMEOUTS.MEDIUM) {
    try {
      await element.waitForExist({ timeout });
    } catch (error) {
      throw new Error(`Timeout aguardando elemento existir: ${error.message}`);
    }
  }

  // ===================================
  // Element Interactions - Scroll
  // ===================================

  /**
   * Scroll para elemento
   * @param {WebdriverIO.Element} element - Elemento alvo
   */
  async scrollToElement(element) {
    try {
      log(`Scrollando até elemento...`, 'info');

      if (await this.isAndroid()) {
        // Android
        await element.scrollIntoView();
      } else {
        // iOS
        const location = await element.getLocation();
        await driver.execute('mobile: scroll', {
          direction: 'down',
          toElement: element.elementId,
        });
      }
    } catch (error) {
      throw new Error(`Erro ao scrollar até elemento: ${error.message}`);
    }
  }

  /**
   * Scroll para baixo
   * @param {string} direction - 'down' ou 'up'
   */
  async scroll(direction = 'down') {
    try {
      const isAndroid = await this.isAndroid();

      if (isAndroid) {
        // Android scroll
        await driver.execute('mobile: scrollGesture', {
          direction,
        });
      } else {
        // iOS scroll
        await driver.execute('mobile: scroll', {
          direction,
        });
      }
    } catch (error) {
      throw new Error(`Erro ao scrollar: ${error.message}`);
    }
  }

  // ===================================
  // Assertions
  // ===================================

  /**
   * Verifica se elemento contém texto
   * @param {WebdriverIO.Element} element - Elemento
   * @param {string} text - Texto esperado
   */
  async assertElementContainsText(element, text) {
    const elementText = await this.getElementText(element);
    expect(elementText.toLowerCase()).to.include(text.toLowerCase());
  }

  /**
   * Verifica se elemento tem texto exato
   * @param {WebdriverIO.Element} element - Elemento
   * @param {string} text - Texto esperado
   */
  async assertElementTextEquals(element, text) {
    const elementText = await this.getElementText(element);
    expect(elementText.trim()).to.equal(text);
  }

  /**
   * Verifica se elemento está visível
   * @param {WebdriverIO.Element} element - Elemento
   */
  async assertElementVisible(element) {
    const isVisible = await this.isElementVisible(element);
    expect(isVisible, 'Elemento deveria estar visível').to.be.true;
  }

  /**
   * Verifica se elemento está habilitado
   * @param {WebdriverIO.Element} element - Elemento
   */
  async assertElementEnabled(element) {
    const isEnabled = await element.isEnabled();
    expect(isEnabled, 'Elemento deveria estar habilitado').to.be.true;
  }

  // ===================================
  // Platform-specific Selectors
  // ===================================

  /**
   * Retorna selector baseado na plataforma
   * @param {object} selectors - Objeto com selectors por platform
   * @returns {string|object} - Selector apropriado
   */
  getPlatformSelector(selectors) {
    const platform = driver.capabilities.platformName;

    if (platform === PLATFORM.ANDROID && selectors.android) {
      return selectors.android;
    }

    if (platform === PLATFORM.IOS && selectors.ios) {
      return selectors.ios;
    }

    return selectors.default || selectors.android;
  }

  // ===================================
  // Wait Helpers
  // ===================================

  /**
   * Sleep/pause simples
   * @param {number} ms - Milissegundos
   */
  async wait(ms = TIMEOUTS.SHORT) {
    await browser.pause(ms);
  }

  /**
   * Wait até que uma condição seja verdadeira
   * @param {Function} condition - Função que retorna boolean
   * @param {number} timeout - Timeout máximo
   * @param {string} message - Mensagem de erro
   */
  async waitForCondition(condition, timeout = TIMEOUTS.MEDIUM, message = 'Condition not met') {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return true;
      }
      await browser.pause(500);
    }

    throw new Error(`Timeout aguardando condição: ${message}`);
  }

  // ===================================
  // Navigation
  // ===================================

  /**
   * Navega de volta (back button)
   */
  async goBack() {
    log(`Navegando de volta...`, 'info');
    await driver.back();
  }

  // ===================================
  // Keyboard
  // ===================================

  /**
   * Pressiona tecla Enter
   */
  async pressEnter() {
    if (await this.isAndroid()) {
      await driver.pressKeyCode(4); // KEYCODE_BACK
    } else {
      // iOS
      await driver.execute('mobile: performEditorAction', { action: 'done' });
    }
  }

  /**
   * Fecha teclado
   */
  async hideKeyboard() {
    try {
      if (await this.isAndroid()) {
        await driver.hideKeyboard();
      } else {
        // iOS
        await driver.execute('mobile: dismissKeyboard');
      }
    } catch (error) {
      // Keyboard pode já estar fechado
      log(`Teclado já fechado ou não visível`, 'warning');
    }
  }

  // ===================================
  // Screen/Elements Info
  // ===================================

  /**
   * Obtém tamanho da tela
   * @returns {Promise<{width: number, height: number}>}
   */
  async getScreenSize() {
    const { width, height } = await driver.getWindowSize();
    return { width, height };
  }

  /**
   * Obtém centro da tela
   * @returns {Promise<{x: number, y: number}>}
   */
  async getScreenCenter() {
    const { width, height } = await this.getScreenSize();
    return { x: width / 2, y: height / 2 };
  }

  // ===================================
  // Screenshot
  // ===================================

  /**
   * Captura screenshot
   * @param {string} filename - Nome do arquivo
   */
  async captureScreenshot(filename) {
    const screenshotPath = `screenshots/${filename}`;
    await browser.saveScreenshot(screenshotPath);
    log(`Screenshot salvo: ${screenshotPath}`, 'success');
    return screenshotPath;
  }

  // ===================================
  // Debug Helpers
  // ===================================

  /**
   * Log informações do elemento
   * @param {WebdriverIO.Element} element - Elemento
   */
  async logElementInfo(element) {
    try {
      const text = await this.getElementText(element).catch(() => 'N/A');
      const visible = await this.isElementVisible(element);
      const enabled = await element.isEnabled();

      log(`Element Info:`, 'info');
      log(`  Text: ${text}`, 'info');
      log(`  Visible: ${visible}`, 'info');
      log(`  Enabled: ${enabled}`, 'info');
    } catch (error) {
      log(`Erro ao obter informações do elemento: ${error.message}`, 'error');
    }
  }

  /**
   * Log página atual
   */
  async logCurrentPage() {
    const activity = await driver.getCurrentActivity().catch(() => 'N/A');
    const pkgName = await driver.getCurrentPackage().catch(() => 'N/A');

    log(`Current Page Info:`, 'info');
    log(`  Activity: ${activity}`, 'info');
    log(`  Package: ${pkgName}`, 'info');
  }
}

module.exports = BasePage;
