/**
 * Helper para captura automática de screenshots
 * Integra com Allure Report para anexar evidências nas falhas
 */

const { join } = require('path');
const fs = require('fs');
const { logColor, COLORS, PATHS } = require('./constants');

// ===================================
// Screenshot Capture
// ===================================

/**
 * Captura screenshot e salva no diretório de screenshots
 * @param {string} testName - Nome do teste
 * @param {boolean} isError - Se é uma captura de erro
 * @returns {Promise<string>} - Caminho do screenshot
 */
const captureScreenshot = async (testName, isError = false) => {
  try {
    // Garantir que diretório existe
    const screenshotDir = PATHS.SCREENSHOTS;
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    // Gerar nome de arquivo único
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const status = isError ? 'ERROR' : 'SUCCESS';
    const filename = `${testName}-${status}-${timestamp}.png`;
    const screenshotPath = join(screenshotDir, filename);

    // Capturar screenshot
    await browser.saveScreenshot(screenshotPath);

    // Log
    if (isError) {
      logColor(`📸 Screenshot de erro salvo: ${filename}`, COLORS.RED);
    } else {
      logColor(`📸 Screenshot salvo: ${filename}`, COLORS.CYAN);
    }

    return screenshotPath;
  } catch (error) {
    console.error('Erro ao capturar screenshot:', error);
    throw error;
  }
};

// ===================================
// Screenshot para Allure Report
// ===================================

/**
 * Anexa screenshot ao relatório Allure
 * @param {string} screenshotPath - Caminho do screenshot
 * @param {string} testName - Nome do teste
 */
const attachScreenshotToAllure = (screenshotPath, testName) => {
  try {
    if (fs.existsSync(screenshotPath)) {
      const screenshot = fs.readFileSync(screenshotPath);
      // Allure adiciona automaticamente do allure-results/
      // O nome do arquivo é usado como título do anexo
      global.allure?.addAttachment(`Screenshot - ${testName}`, 'image/png', screenshot.toString('base64'));
    }
  } catch (error) {
    console.error('Erro ao anexar screenshot ao Allure:', error);
  }
};

// ===================================
// Mocha Hook Integration
// ===================================

/**
 * Hook para captura automática de screenshots em falhas
 * Deve ser usado no afterEach do Mocha
 * @param {object} test - Objeto do teste Mocha
 * @returns {Promise<void>}
 */
const autoScreenshotHook = async (test) => {
  try {
    // Capturar screenshot apenas em falhas
    if (test.state === 'failed') {
      const testName = test.fullTitle || test.title || 'unknown';
      const screenshotPath = await captureScreenshot(testName, true);

      // Anexar ao Allure
      attachScreenshotToAllure(screenshotPath, testName);

      // Anexar informações do erro
      const error = test.err;
      if (error) {
        global.allure?.addAttachment(
          'Error Message',
          'text/plain',
          `${error.message}\n\nStack:\n${error.stack}`
        );
      }
    }
  } catch (error) {
    console.error('Erro no hook de screenshot automático:', error);
  }
};

// ===================================
// Page/Screen Screenshots
// ===================================

/**
 * Captura screenshot de uma tela/page específica
 * @param {string} pageName - Nome da page/tela
 * @param {string} action - Ação realizada (ex: 'before-click', 'after-fill-form')
 * @returns {Promise<string>} - Caminho do screenshot
 */
const capturePageScreenshot = async (pageName, action) => {
  const testName = `${pageName}-${action}`;
  return await captureScreenshot(testName, false);
};

// ===================================
// Batch Screenshot Capture
// ===================================

/**
 * Captura múltiplos screenshots em sequência
 * @param {Array<string>} testNames - Array de nomes de testes
 * @returns {Promise<Array<string>>} - Array de caminhos dos screenshots
 */
const captureBatchScreenshots = async (testNames) => {
  const paths = [];
  for (const name of testNames) {
    const path = await captureScreenshot(name, false);
    paths.push(path);
  }
  return paths;
};

// ===================================
// Cleanup
// ===================================

/**
 * Limpa screenshots antigos (mantém apenas os últimos N)
 * @param {number} keep - Quantidade de screenshots a manter
 */
const cleanupOldScreenshots = (keep = 50) => {
  try {
    const screenshotDir = PATHS.SCREENSHOTS;
    if (!fs.existsSync(screenshotDir)) return;

    const files = fs.readdirSync(screenshotDir)
      .filter(file => file.endsWith('.png'))
      .map(file => ({
        name: file,
        path: join(screenshotDir, file),
        time: fs.statSync(join(screenshotDir, file)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time); // Mais recentes primeiro

    // Remover arquivos antigos
    if (files.length > keep) {
      const toDelete = files.slice(keep);
      toDelete.forEach(file => {
        fs.unlinkSync(file.path);
        logColor(`🗑️ Arquivo antigo removido: ${file.name}`, COLORS.YELLOW);
      });
    }
  } catch (error) {
    console.error('Erro ao limpar screenshots antigos:', error);
  }
};

// ===================================
// Utility Functions
// ===================================

/**
 * Gera nome de arquivo para screenshot
 * @param {string} testName - Nome do teste
 * @param {boolean} isError - Se é erro
 * @returns {string} - Nome do arquivo
 */
const generateScreenshotFilename = (testName, isError = false) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const status = isError ? 'ERROR' : 'SUCCESS';
  // Limpar nome do teste (remover caracteres inválidos)
  const cleanName = testName.replace(/[^a-zA-Z0-9-_]/g, '_');
  return `${cleanName}-${status}-${timestamp}.png`;
};

/**
 * Obtém metadados do screenshot
 * @param {string} screenshotPath - Caminho do screenshot
 * @returns {object} - Metadados
 */
const getScreenshotMetadata = (screenshotPath) => {
  try {
    const stats = fs.statSync(screenshotPath);
    return {
      path: screenshotPath,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
    };
  } catch (error) {
    console.error('Erro ao obter metadados:', error);
    return null;
  }
};

// ===================================
// Exports
// ===================================
module.exports = {
  // Captura
  captureScreenshot,
  capturePageScreenshot,
  captureBatchScreenshots,

  // Allure
  attachScreenshotToAllure,

  // Hooks
  autoScreenshotHook,

  // Cleanup
  cleanupOldScreenshots,

  // Utilities
  generateScreenshotFilename,
  getScreenshotMetadata,
};
