const { expect } = require('chai');
const { TIMEOUTS, PLATFORM } = require('../helpers/constants');
const { isAndroid, isIOS, waitForVisible, waitForClickable, log } = require('../helpers/utils');

class BasePage {
  async isAndroid() {
    return await isAndroid();
  }

  async isIOS() {
    return await isIOS();
  }

  async clickElement(element, timeout = TIMEOUTS.MEDIUM) {
    try {
      log(`Clicando no elemento...`, 'info');
      await waitForClickable(element, timeout);
      await element.click();
    } catch (error) {
      throw new Error(`Erro ao clicar no elemento: ${error.message}`);
    }
  }

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

  async getElementText(element) {
    try {
      await waitForVisible(element);
      return await element.getText();
    } catch (error) {
      throw new Error(`Erro ao obter texto do elemento: ${error.message}`);
    }
  }

  async getElementValue(element) {
    try {
      await waitForVisible(element);
      return await element.getValue();
    } catch (error) {
      throw new Error(`Erro ao obter valor do elemento: ${error.message}`);
    }
  }

  async isElementVisible(element) {
    try {
      return await element.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  async isElementExisting(element) {
    try {
      return await element.isExisting();
    } catch (error) {
      return false;
    }
  }

  async waitForElementVisible(element, timeout = TIMEOUTS.MEDIUM) {
    try {
      await waitForVisible(element, timeout);
    } catch (error) {
      throw new Error(`Timeout aguardando elemento ficar visível: ${error.message}`);
    }
  }

  async waitForElementEnabled(element, timeout = TIMEOUTS.MEDIUM) {
    try {
      await waitForClickable(element, timeout);
    } catch (error) {
      throw new Error(`Timeout aguardando elemento ficar habilitado: ${error.message}`);
    }
  }

  async waitForElementExist(element, timeout = TIMEOUTS.MEDIUM) {
    try {
      await element.waitForExist({ timeout });
    } catch (error) {
      throw new Error(`Timeout aguardando elemento existir: ${error.message}`);
    }
  }

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

  async assertElementContainsText(element, text) {
    const elementText = await this.getElementText(element);
    expect(elementText.toLowerCase()).to.include(text.toLowerCase());
  }

  async assertElementTextEquals(element, text) {
    const elementText = await this.getElementText(element);
    expect(elementText.trim()).to.equal(text);
  }

  async assertElementVisible(element) {
    const isVisible = await this.isElementVisible(element);
    expect(isVisible, 'Elemento deveria estar visível').to.be.true;
  }

  async assertElementEnabled(element) {
    const isEnabled = await element.isEnabled();
    expect(isEnabled, 'Elemento deveria estar habilitado').to.be.true;
  }

  getPlatformSelector(selectors) {
    const platform = driver.capabilities.platformName;

    let selector = null;

    if (platform === PLATFORM.ANDROID && selectors.android) {
      selector = selectors.android;
    } else if (platform === PLATFORM.IOS && selectors.ios) {
      selector = selectors.ios;
    } else {
      selector = selectors.default || selectors.android;
    }

    // Se for array, retornar o primeiro elemento
    if (Array.isArray(selector)) {
      return selector[0];
    }

    return selector;
  }

  async wait(ms = TIMEOUTS.SHORT) {
    await browser.pause(ms);
  }

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

  async goBack() {
    log(`Navegando de volta...`, 'info');
    await driver.back();
  }

  async pressEnter() {
    if (await this.isAndroid()) {
      await driver.pressKeyCode(4); // KEYCODE_BACK
    } else {
      // iOS
      await driver.execute('mobile: performEditorAction', { action: 'done' });
    }
  }

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

  async getScreenSize() {
    const { width, height } = await driver.getWindowSize();
    return { width, height };
  }

  async getScreenCenter() {
    const { width, height } = await this.getScreenSize();
    return { x: width / 2, y: height / 2 };
  }

  async captureScreenshot(filename) {
    const screenshotPath = `screenshots/${filename}`;
    await browser.saveScreenshot(screenshotPath);
    log(`Screenshot salvo: ${screenshotPath}`, 'success');
    return screenshotPath;
  }

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

  async logCurrentPage() {
    const activity = await driver.getCurrentActivity().catch(() => 'N/A');
    const pkgName = await driver.getCurrentPackage().catch(() => 'N/A');

    log(`Current Page Info:`, 'info');
    log(`  Activity: ${activity}`, 'info');
    log(`  Package: ${pkgName}`, 'info');
  }
}

module.exports = BasePage;
