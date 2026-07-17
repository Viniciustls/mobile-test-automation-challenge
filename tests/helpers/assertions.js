/**
 * Custom Assertions para testes mobile
 * Estende o Chai com assertions específicos para automação mobile
 */

const { expect } = require('chai');

// ===================================
// Element Assertions
// ===================================

/**
 * Assertion customizado para verificar se elemento está visível
 * @param {WebdriverIO.Element} element - Elemento WebdriverIO
 * @param {string} message - Mensagem opcional
 */
expect.assertions.addMethod('visible', async function (message) {
  const element = this._obj;

  try {
    const isDisplayed = await element.isDisplayed();

    this.assert(
      isDisplayed,
      `expected element to be visible${message ? `: ${message}` : ''}`,
      `expected element NOT to be visible${message ? `: ${message}` : ''}`
    );
  } catch (error) {
    throw new Error(`Error checking visibility: ${error.message}`);
  }
});

/**
 * Assertion customizado para verificar se elemento existe
 * @param {WebdriverIO.Element} element - Elemento WebdriverIO
 * @param {string} message - Mensagem opcional
 */
expect.assertions.addMethod('existing', async function (message) {
  const element = this._obj;

  try {
    const isExisting = await element.isExisting();

    this.assert(
      isExisting,
      `expected element to exist${message ? `: ${message}` : ''}`,
      `expected element NOT to exist${message ? `: ${message}` : ''}`
    );
  } catch (error) {
    throw new Error(`Error checking existence: ${error.message}`);
  }
});

/**
 * Assertion customizado para verificar se elemento está habilitado
 * @param {WebdriverIO.Element} element - Elemento WebdriverIO
 * @param {string} message - Mensagem opcional
 */
expect.assertions.addMethod('enabled', async function (message) {
  const element = this._obj;

  try {
    const isEnabled = await element.isEnabled();

    this.assert(
      isEnabled,
      `expected element to be enabled${message ? `: ${message}` : ''}`,
      `expected element NOT to be enabled${message ? `: ${message}` : ''}`
    );
  } catch (error) {
    throw new Error(`Error checking enabled state: ${error.message}`);
  }
});

// ===================================
// Text Assertions
// ===================================

/**
 * Assertion customizado para verificar se elemento contém texto (case-insensitive)
 * @param {WebdriverIO.Element} element - Elemento WebdriverIO
 * @param {string} text - Texto esperado
 * @param {string} message - Mensagem opcional
 */
expect.assertions.addMethod('textContaining', async function (text, message) {
  const element = this._obj;

  try {
    const elementText = await element.getText();
    const contains = elementText.toLowerCase().includes(text.toLowerCase());

    this.assert(
      contains,
      `expected element to contain text "${text}" but found "${elementText}"${message ? `: ${message}` : ''}`,
      `expected element NOT to contain text "${text}"${message ? `: ${message}` : ''}`
    );
  } catch (error) {
    throw new Error(`Error checking text: ${error.message}`);
  }
});

/**
 * Assertion customizado para verificar se elemento tem texto exato
 * @param {WebdriverIO.Element} element - Elemento WebdriverIO
 * @param {string} text - Texto esperado
 * @param {string} message - Mensagem opcional
 */
expect.assertions.addMethod('textEqual', async function (text, message) {
  const element = this._obj;

  try {
    const elementText = await element.getText();
    const isEqual = elementText.trim() === text.trim();

    this.assert(
      isEqual,
      `expected element text to be "${text}" but found "${elementText}"${message ? `: ${message}` : ''}`,
      `expected element text NOT to be "${text}"${message ? `: ${message}` : ''}`
    );
  } catch (error) {
    throw new Error(`Error checking text equality: ${error.message}`);
  }
});

// ===================================
// Value Assertions
// ===================================

/**
 * Assertion customizado para verificar valor de input
 * @param {WebdriverIO.Element} element - Elemento WebdriverIO
 * @param {string} value - Valor esperado
 * @param {string} message - Mensagem opcional
 */
expect.assertions.addMethod('valueEqual', async function (value, message) {
  const element = this._obj;

  try {
    const elementValue = await element.getValue();
    const isEqual = elementValue === value;

    this.assert(
      isEqual,
      `expected element value to be "${value}" but found "${elementValue}"${message ? `: ${message}` : ''}`,
      `expected element value NOT to be "${value}"${message ? `: ${message}` : ''}`
    );
  } catch (error) {
    throw new Error(`Error checking value: ${error.message}`);
  }
});

// ===================================
// Attribute Assertions
// ===================================

/**
 * Assertion customizado para verificar atributo de elemento
 * @param {WebdriverIO.Element} element - Elemento WebdriverIO
 * @param {string} attribute - Nome do atributo
 * @param {string} value - Valor esperado
 * @param {string} message - Mensagem opcional
 */
expect.assertions.addMethod('attribute', async function (attribute, value, message) {
  const element = this._obj;

  try {
    const attrValue = await element.getAttribute(attribute);

    this.assert(
      attrValue === value,
      `expected attribute "${attribute}" to be "${value}" but found "${attrValue}"${message ? `: ${message}` : ''}`,
      `expected attribute "${attribute}" NOT to be "${value}"${message ? `: ${message}` : ''}`
    );
  } catch (error) {
    throw new Error(`Error checking attribute: ${error.message}`);
  }
});

// ===================================
// Count/Quantity Assertions
// ===================================

/**
 * Assertion customizado para verificar quantidade de elementos
 * @param {Array<WebdriverIO.Element>} elements - Array de elementos
 * @param {number} count - Quantidade esperada
 * @param {string} message - Mensagem opcional
 */
expect.assertions.addMethod('count', async function (count, message) {
  const elements = this._obj;

  try {
    const actualCount = elements.length;

    this.assert(
      actualCount === count,
      `expected ${count} elements but found ${actualCount}${message ? `: ${message}` : ''}`,
      `expected NOT ${count} elements${message ? `: ${message}` : ''}`
    );
  } catch (error) {
    throw new Error(`Error checking element count: ${error.message}`);
  }
});

// ===================================
// Platform-specific Assertions
// ===================================

/**
 * Assertion customizado para verificar se estamos na plataforma Android
 * @param {string} message - Mensagem opcional
 */
expect.assertions.addMethod('android', async function (message) {
  try {
    const platform = await driver.capabilities.platformName;
    const isAndroid = platform === 'Android';

    this.assert(
      isAndroid,
      `expected platform to be Android but found ${platform}${message ? `: ${message}` : ''}`,
      `expected platform NOT to be Android${message ? `: ${message}` : ''}`
    );
  } catch (error) {
    throw new Error(`Error checking platform: ${error.message}`);
  }
});

/**
 * Assertion customizado para verificar se estamos na plataforma iOS
 * @param {string} message - Mensagem opcional
 */
expect.assertions.addMethod('ios', async function (message) {
  try {
    const platform = await driver.capabilities.platformName;
    const isIOS = platform === 'iOS';

    this.assert(
      isIOS,
      `expected platform to be iOS but found ${platform}${message ? `: ${message}` : ''}`,
      `expected platform NOT to be iOS${message ? `: ${message}` : ''}`
    );
  } catch (error) {
    throw new Error(`Error checking platform: ${error.message}`);
  }
});

// ===================================
// Helper Functions
// ===================================

/**
 * Aguarda e assertion combinados
 * @param {WebdriverIO.Element} element - Elemento WebdriverIO
 * @param {number} timeout - Timeout em ms
 */
const waitForVisible = async (element, timeout = 10000) => {
  await element.waitForDisplayed({ timeout });
};

/**
 * Verifica visibilidade com mensagem customizada
 * @param {WebdriverIO.Element} element - Elemento WebdriverIO
 * @param {string} description - Descrição do elemento
 */
const expectVisible = async (element, description = 'element') => {
  await expect(element, `${description} should be visible`).to.be.visible;
};

/**
 * Verifica existência com mensagem customizada
 * @param {WebdriverIO.Element} element - Elemento WebdriverIO
 * @param {string} description - Descrição do elemento
 */
const expectExisting = async (element, description = 'element') => {
  await expect(element, `${description} should exist`).to.be.existing;
};

/**
 * Verifica texto com mensagem customizada
 * @param {WebdriverIO.Element} element - Elemento WebdriverIO
 * @param {string} text - Texto esperado
 * @param {string} description - Descrição do elemento
 */
const expectText = async (element, text, description = 'element') => {
  await expect(element, `${description} should contain text`).to.textContaining(text);
};

// ===================================
// Exports
// ===================================
module.exports = {
  expect,

  // Helpers
  waitForVisible,
  expectVisible,
  expectExisting,
  expectText,
};
