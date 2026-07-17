/**
 * Funções utilitárias reutilizáveis nos testes
 */

const { TIMEOUTS, PLATFORM, logColor, COLORS } = require('./constants');

// ===================================
// Platform Detection
// ===================================

/**
 * Detecta se a plataforma atual é Android
 * @returns {boolean}
 */
const isAndroid = async () => {
  const platform = await driver.capabilities.platformName;
  return platform === PLATFORM.ANDROID;
};

/**
 * Detecta se a plataforma atual é iOS
 * @returns {boolean}
 */
const isIOS = async () => {
  const platform = await driver.capabilities.platformName;
  return platform === PLATFORM.IOS;
};

/**
 * Retorna a plataforma atual
 * @returns {Promise<string>}
 */
const getPlatform = async () => {
  return await driver.capabilities.platformName;
};

// ===================================
// Wait Utilities
// ===================================

/**
 * Aguarda um tempo fixo (sleep)
 * NOTA: Usar apenas quando necessário - preferir waits explícitos
 * @param {number} ms - Milissegundos para aguardar
 */
const wait = async (ms = TIMEOUTS.MEDIUM) => {
  await browser.pause(ms);
};

/**
 * Aguarda até que um elemento esteja visível
 * @param {WebdriverIO.Element} element - Elemento WebdriverIO
 * @param {number} timeout - Timeout em ms
 */
const waitForVisible = async (element, timeout = TIMEOUTS.MEDIUM) => {
  await element.waitForDisplayed({ timeout });
};

/**
 * Aguarda até que um elemento esteja clicável
 * @param {WebdriverIO.Element} element - Elemento WebdriverIO
 * @param {number} timeout - Timeout em ms
 */
const waitForClickable = async (element, timeout = TIMEOUTS.MEDIUM) => {
  await element.waitForEnabled({ timeout });
};

/**
 * Aguarda até que um elemento exista no DOM
 * @param {WebdriverIO.Element} element - Elemento WebdriverIO
 * @param {number} timeout - Timeout em ms
 */
const waitForExist = async (element, timeout = TIMEOUTS.MEDIUM) => {
  await element.waitForExist({ timeout });
};

// ===================================
// Element Utilities
// ===================================

/**
 * Verifica se um elemento está visível
 * @param {WebdriverIO.Element} element - Elemento WebdriverIO
 * @returns {Promise<boolean>}
 */
const isVisible = async (element) => {
  return await element.isDisplayed();
};

/**
 * Verifica se um elemento existe no DOM
 * @param {WebdriverIO.Element} element - Elemento WebdriverIO
 * @returns {Promise<boolean>}
 */
const isExisting = async (element) => {
  return await element.isExisting();
};

/**
 * Verifica se um elemento está habilitado
 * @param {WebdriverIO.Element} element - Elemento WebdriverIO
 * @returns {Promise<boolean>}
 */
const isEnabled = async (element) => {
  return await element.isEnabled();
};

/**
 * Scroll até um elemento
 * @param {WebdriverIO.Element} element - Elemento WebdriverIO
 */
const scrollToElement = async (element) => {
  const isAndroid = await getPlatform() === PLATFORM.ANDROID;

  if (isAndroid) {
    // Android: scroll usando UIAutomator2
    await element.scrollIntoView();
  } else {
    // iOS: scroll usando gesture
    const location = await element.getLocation();
    await driver.touchPerform([
      { action: 'press', options: { x: 100, y: 500 } },
      { action: 'moveTo', options: { x: 100, y: 200 } },
      { action: 'release' }
    ]);
  }
};

// ===================================
// Screenshot Utilities
// ===================================

/**
 * Captura screenshot com timestamp
 * @param {string} testName - Nome do teste para filename
 * @returns {Promise<string>} - Caminho do screenshot salvo
 */
const captureScreenshot = async (testName) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${testName}-${timestamp}.png`;
  const screenshotPath = `screenshots/${filename}`;

  await browser.saveScreenshot(screenshotPath);

  logColor(`📸 Screenshot salvo: ${filename}`, COLORS.CYAN);

  return screenshotPath;
};

/**
 * Captura screenshot em caso de erro
 * @param {Error} error - Objeto de erro
 * @param {string} testName - Nome do teste
 */
const captureErrorScreenshot = async (error, testName) => {
  logColor(`❌ Erro no teste "${testName}": ${error.message}`, COLORS.RED);
  await captureScreenshot(`${testName}-error`);
};

// ===================================
// String/Text Utilities
// ===================================

/**
 * Gera email aleatório
 * @param {string} domain - Domínio do email (padrão: example.com)
 * @returns {string}
 */
const generateRandomEmail = (domain = 'example.com') => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `test.${timestamp}.${random}@${domain}`;
};

/**
 * Gera string aleatória
 * @param {number} length - Tamanho da string
 * @returns {string}
 */
const generateRandomString = (length = 10) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Remove espaços extras de uma string
 * @param {string} str - String para limpar
 * @returns {string}
 */
const trimText = (str) => {
  return str.trim().replace(/\s+/g, ' ');
};

// ===================================
// Retry Logic
// ===================================

/**
 * Executa função com retry
 * @param {Function} fn - Função para executar
 * @param {number} retries - Número de retries
 * @param {number} delay - Delay entre retries em ms
 * @returns {Promise<any>}
 */
const retry = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      logColor(`Retry ${i + 1}/${retries}...`, COLORS.YELLOW);
      await wait(delay);
    }
  }
};

// ===================================
// Log Utilities
// ===================================

/**
 * Log estruturado
 * @param {string} message - Mensagem
 * @param {string} type - Tipo: info, success, warning, error
 */
const log = (message, type = 'info') => {
  const colors = {
    info: COLORS.BLUE,
    success: COLORS.GREEN,
    warning: COLORS.YELLOW,
    error: COLORS.RED,
  };

  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };

  logColor(`${icons[type] || 'ℹ️'} ${message}`, colors[type] || COLORS.RESET);
};

// ===================================
// App-specific Utilities
// ===================================

/**
 * Verifica se elemento contém texto (case-insensitive)
 * @param {WebdriverIO.Element} element - Elemento WebdriverIO
 * @param {string} text - Texto esperado
 * @returns {Promise<boolean>}
 */
const containsText = async (element, text) => {
  const elementText = await element.getText();
  return elementText.toLowerCase().includes(text.toLowerCase());
};

/**
 * Obtém texto de elemento ou string vazia se não existir
 * @param {WebdriverIO.Element} element - Elemento WebdriverIO
 * @returns {Promise<string>}
 */
const getTextSafely = async (element) => {
  try {
    return await element.getText();
  } catch (error) {
    return '';
  }
};

// ===================================
// Exports
// ===================================
module.exports = {
  // Platform
  isAndroid,
  isIOS,
  getPlatform,

  // Waits
  wait,
  waitForVisible,
  waitForClickable,
  waitForExist,

  // Element
  isVisible,
  isExisting,
  isEnabled,
  scrollToElement,

  // Screenshots
  captureScreenshot,
  captureErrorScreenshot,

  // Strings
  generateRandomEmail,
  generateRandomString,
  trimText,
  containsText,
  getTextSafely,

  // Retry
  retry,

  // Logging
  log,
};
