const { join } = require('path');
const fs = require('fs');

const SCREENSHOT_DIR = join(process.cwd(), 'screenshots');

const captureScreenshot = async (testName) => {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-');

  const filename = `${testName}-ERROR-${timestamp}.png`;
  const screenshotPath = join(SCREENSHOT_DIR, filename);

  await browser.saveScreenshot(screenshotPath);

  return screenshotPath;
};

const attachScreenshotToAllure = (screenshotPath, testName) => {
  if (!fs.existsSync(screenshotPath)) {
    return;
  }

  const screenshot = fs.readFileSync(screenshotPath);

  global.allure?.addAttachment(
    `Screenshot - ${testName}`,
    'image/png',
    screenshot
  );
};

const autoScreenshotHook = async (test) => {
  if (test.state !== 'failed') {
    return;
  }

  try {
    const testName = test.fullTitle()
      .replace(/[^a-zA-Z0-9-_]/g, '_');

    const screenshotPath = await captureScreenshot(testName);

    attachScreenshotToAllure(
      screenshotPath,
      testName
    );

    if (test.err) {
      global.allure?.addAttachment(
        'Error Message',
        'text/plain',
        `${test.err.message}\n\n${test.err.stack}`
      );
    }

  } catch (error) {
    console.error(
      'Erro ao capturar screenshot:',
      error.message
    );
  }
};

const cleanupOldScreenshots = (limit = 50) => {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    return;
  }

  const files = fs.readdirSync(SCREENSHOT_DIR)
    .filter(file => file.endsWith('.png'))
    .map(file => ({
      file,
      time: fs.statSync(join(SCREENSHOT_DIR, file)).mtime
    }))
    .sort((a, b) => b.time - a.time);

  files.slice(limit).forEach(item => {
    fs.unlinkSync(join(SCREENSHOT_DIR, item.file));
  });
};

module.exports = {
  autoScreenshotHook,
  cleanupOldScreenshots,
};