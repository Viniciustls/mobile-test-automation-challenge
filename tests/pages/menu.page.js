const BasePage = require('./base.page');
const { log } = require('../helpers/utils');

class MenuPage extends BasePage {
  get menuTitle() {
    return this.getPlatformSelector({
      android: '//android.view.View[@text="WebView"]',
      ios: "//XCUIElementTypeStaticText[@name='WebView']",
      default: '//android.view.View[@text="WebView"]',
    });
  }

  get homeTab() {
    return this.getPlatformSelector({
      android: '//android.widget.Button[@content-desc="Home"]',
      ios: "//XCUIElementTypeButton[@name='Home']",
      default: '//android.widget.Button[@content-desc="Home"]',
    });
  }

  get loginTab() {
    return this.getPlatformSelector({
      android: '//android.widget.Button[@content-desc="Login"]',
      ios: "//XCUIElementTypeButton[@name='Login']",
      default: '//android.widget.Button[@content-desc="Login"]',
    });
  }

  get webViewTab() {
    return this.getPlatformSelector({
      android: '//android.widget.Button[@content-desc="WebView"]',
      ios: "//XCUIElementTypeButton[@name='WebView']",
      default: '//android.widget.Button[@content-desc="WebView"]',
    });
  }

  get formsTab() {
    return this.getPlatformSelector({
      android: '//android.widget.Button[@content-desc="Forms"]',
      ios: "//XCUIElementTypeButton[@name='Forms']",
      default: '//android.widget.Button[@content-desc="Forms"]',
    });
  }

  get swipeTab() {
    return this.getPlatformSelector({
      android: '//android.widget.Button[@content-desc="Swipe"]',
      ios: "//XCUIElementTypeButton[@name='Swipe']",
      default: '//android.widget.Button[@content-desc="Swipe"]',
    });
  }

  get logoutButton() {
    return this.getPlatformSelector({
      android: '//android.widget.Button[@text="Logout"]',
      ios: "//XCUIElementTypeButton[@name='Logout']",
      default: '//android.widget.Button[@text="Logout"]',
    });
  }

  get loginButton() {
    return this.getPlatformSelector({
      android: '//android.widget.Button[@text="Login"]',
      ios: "//XCUIElementTypeButton[@name='Login']",
      default: '//android.widget.Button[@text="Login"]',
    });
  }

  async clickHomeTab() {
    log(`Clicando na aba Home`, 'info');
    await this.clickElement($(this.homeTab));
  }

  async clickLoginTab() {
    log(`Clicando na aba Login`, 'info');
    await this.clickElement($(this.loginTab));
  }

  async clickWebViewTab() {
    log(`Clicando na aba WebView`, 'info');
    await this.clickElement($(this.webViewTab));
  }

  async clickFormsTab() {
    log(`Clicando na aba Forms`, 'info');
    await this.clickElement($(this.formsTab));
  }

  async clickSwipeTab() {
    log(`Clicando na aba Swipe`, 'info');
    await this.clickElement($(this.swipeTab));
  }

  async navigateToTab(tabName) {
    log(`Navegando para aba: ${tabName}`, 'info');

    const tabs = {
      home: () => this.clickHomeTab(),
      login: () => this.clickLoginTab(),
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

  async isOnMenu() {
    try {
      const title = $(this.menuTitle);
      await this.waitForElementVisible(title);
      return await this.isElementVisible(title);
    } catch (error) {
      return false;
    }
  }

  async isLoggedIn() {
    try {
      return await this.isElementVisible($(this.logoutButton));
    } catch (error) {
      return false;
    }
  }

  async isNotLoggedIn() {
    try {
      return await this.isElementVisible($(this.loginButton));
    } catch (error) {
      return false;
    }
  }

  async isTabActive(tabName) {
    try {
      const tabs = {
        home: this.homeTab,
        login: this.loginTab,
        webview: this.webViewTab,
        forms: this.formsTab,
        swipe: this.swipeTab,
      };

      const tabElement = $(tabs[tabName]);

      if (!await this.isElementVisible(tabElement)) {
        return false;
      }

      const selected = await tabElement.getAttribute('selected');

      return selected === 'true' || selected === true;
    } catch (error) {
      return false;
    }
  }

  async areAllTabsVisible() {
    try {
      const tabs = [
        $(this.homeTab),
        $(this.loginTab),
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

  async performLogout() {
    log(`Realizando logout`, 'info');

    if (await this.isLoggedIn()) {
      await this.clickElement($(this.logoutButton));
      await this.wait(2000);
    }
  }

  async navigateToLogin() {
    log(`Navegando para tela de login`, 'info');

    await this.clickLoginTab();

    if (await this.isLoggedIn()) {
      await this.performLogout();
    }
  }

  async navigateThroughAllTabs() {
    log(`Navegando por todas as abas`, 'info');

    const tabs = ['home', 'login', 'webview', 'forms', 'swipe'];

    for (const tab of tabs) {
      await this.navigateToTab(tab);
      await this.wait(1000);
    }
  }

  async getMenuTitle() {
    return await this.getElementText($(this.menuTitle));
  }

  async getTabCount() {
    try {
      const tabs = [
        $(this.homeTab),
        $(this.loginTab),
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
}

module.exports = MenuPage;