const BasePage = require('./base.page');
const { MESSAGES, PLATFORM } = require('../helpers/constants');
const { log } = require('../helpers/utils');

class LoginPage extends BasePage {
  get emailInput() {
    return this.getPlatformSelector({
      android: '//android.widget.EditText[@resource-id="inputEmail"]',
      ios: "//XCUIElementTypeTextField[@name='input-email']",
      default: '//android.widget.EditText[@resource-id="inputEmail"]',
    });
  }

  get passwordInput() {
    return this.getPlatformSelector({
      android: '//android.widget.EditText[@resource-id="inputPassword"]',
      ios: "//XCUIElementTypeSecureTextField[@name='input-password']",
      default: '//android.widget.EditText[@resource-id="inputPassword"]',
    });
  }

  get loginButton() {
    return this.getPlatformSelector({
      android: '//android.widget.Button[@text="Login"]',
      ios: "//XCUIElementTypeButton[@name='button-LOGIN']",
      default: '//android.widget.Button[@text="Login"]',
    });
  }

  get signUpButton() {
    return this.getPlatformSelector({
      android: '//android.widget.TextView[@text="Sign up"]',
      ios: "//XCUIElementTypeButton[@name='button-SIGN UP']",
      default: '//android.widget.TextView[@text="Sign up"]',
    });
  }

  get screenTitle() {
    return this.getPlatformSelector({
      android: '//android.view.View[@text="Login"]',
      ios: "//XCUIElementTypeStaticText[@name='Login']",
      default: '//android.view.View[@text="Login"]',
    });
  }

  async fillEmail(email) {
    log(`Preenchendo email: ${email}`, 'info');
    await this.fillInput($(this.emailInput), email);
  }

  async fillPassword(password) {
    log(`Preenchendo senha`, 'info');
    await this.fillInput($(this.passwordInput), password);
  }

  async clickLogin() {
    log(`Clicando no botão Login`, 'info');
    await this.clickElement($(this.loginButton));
  }

  async clickSignUp() {
    log(`Clicando no botão Sign Up`, 'info');
    await this.clickElement($(this.signUpButton));
  }

  async performLogin(email, password) {
    log(`Realizando login com email: ${email}`, 'info');
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
    await this.hideKeyboard();
  }

  async performLoginWithEmptyFields() {
    log(`Tentando login com campos vazios`, 'info');
    await this.clickLogin();
  }

  async performLoginWithEmptyPassword(email) {
    log(`Tentando login apenas com email`, 'info');
    await this.fillEmail(email);
    await this.clickLogin();
  }

  async performLoginWithEmptyEmail(password) {
    log(`Tentando login apenas com senha`, 'info');
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async navigateToSignUp() {
    log(`Navegando para tela de cadastro`, 'info');
    await this.clickSignUp();
  }

  async isOnLoginPage() {
    try {
      const title = $(this.screenTitle);
      await this.waitForElementVisible(title);
      return await this.isElementVisible(title);
    } catch (error) {
      return false;
    }
  }

  async isLoginSuccess() {
    try {
      await this.wait(2000);

      const currentActivity = await driver.getCurrentActivity().catch(() => '');

      if (currentActivity.includes('login') || await this.isOnLoginPage()) {
        return false;
      }

      return true;
    } catch (error) {
      log(`Erro ao verificar sucesso do login: ${error.message}`, 'error');
      return false;
    }
  }

  async hasLoginError(expectedMessage = MESSAGES.LOGIN_ERROR) {
    try {
      await this.wait(2000); 

      // Verificar mensagem de erro
      // Selector varia por platform
      const errorSelector = this.getPlatformSelector({
        android: `//android.view.View[@text="${expectedMessage}"]`,
        ios: `//XCUIElementTypeStaticText[@name="${expectedMessage}"]`,
        default: `//*[contains(@text, "${expectedMessage}")]`,
      });

      const errorElement = $(errorSelector);
      return await this.isElementVisible(errorElement);
    } catch (error) {
      log(`Erro ao verificar mensagem de erro: ${error.message}`, 'error');
      return false;
    }
  }

  async getErrorMessage() {
    try {
      // Selector genérico para mensagens de erro
      const errorSelector = this.getPlatformSelector({
        android: '//android.view.View[contains(@text, "Invalid") or contains(@text, "Please")]',
        ios: '//XCUIElementTypeStaticText[contains(@name, "Invalid") or contains(@name, "Please")]',
        default: '//*[contains(@text, "Invalid") or contains(@text, "Please")]',
      });

      const errorElement = $(errorSelector);

      if (await this.isElementVisible(errorElement)) {
        return await this.getElementText(errorElement);
      }

      return '';
    } catch (error) {
      log(`Erro ao obter mensagem de erro: ${error.message}`, 'error');
      return '';
    }
  }

  async clearForm() {
    log(`Limpando campos do formulário`, 'info');

    try {
      const emailField = $(this.emailInput);
      const passwordField = $(this.passwordInput);

      if (await this.isElementVisible(emailField)) {
        await emailField.clearValue();
      }

      if (await this.isElementVisible(passwordField)) {
        await passwordField.clearValue();
      }
    } catch (error) {
      log(`Erro ao limpar formulário: ${error.message}`, 'warning');
    }
  }

  async areFieldsClean() {
    try {
      const emailField = $(this.emailInput);
      const passwordField = $(this.passwordInput);

      const emailValue = await this.getElementValue(emailField);
      const passwordValue = await this.getElementValue(passwordField);

      return emailValue === '' && passwordValue === '';
    } catch (error) {
      return false;
    }
  }

  async getEmailValue() {
    return await this.getElementValue($(this.emailInput));
  }

  async getPasswordValue() {
    return await this.getElementValue($(this.passwordInput));
  }

  async isLoginButtonEnabled() {
    return await $(this.loginButton).isEnabled();
  }

  async isSignUpButtonVisible() {
    return await this.isElementVisible($(this.signUpButton));
  }

  async logFormState() {
    log('=== Login Form State ===', 'info');

    try {
      const emailValue = await this.getEmailValue();
      const passwordValue = await this.getPasswordValue();
      const loginEnabled = await this.isLoginButtonEnabled();

      log(`Email: ${emailValue}`, 'info');
      log(`Password: ${passwordValue ? '***' : ''}`, 'info');
      log(`Login Button Enabled: ${loginEnabled}`, 'info');
    } catch (error) {
      log(`Erro ao obter estado: ${error.message}`, 'error');
    }
  }
}

module.exports = LoginPage;
