/**
 * LoginPage - Page Object para tela de Login
 * Responsável por todas as interações com a tela de login
 */

const BasePage = require('./base.page');
const { MESSAGES, PLATFORM } = require('../helpers/constants');
const { log } = require('../helpers/utils');

class LoginPage extends BasePage {
  // ===================================
  // Elementos - Selectors
  // ===================================

  /**
   * Selector platform-aware para campo de email
   * @returns {string}
   */
  get emailInput() {
    return this.getPlatformSelector({
      android: '//android.widget.EditText[1]',
      ios: "//XCUIElementTypeTextField[@name='input-email']",
      default: '//android.widget.EditText[1]',
    });
  }

  /**
   * Selector platform-aware para campo de senha
   * @returns {string}
   */
  get passwordInput() {
    return this.getPlatformSelector({
      android: '//android.widget.EditText[2]',
      ios: "//XCUIElementTypeSecureTextField[@name='input-password']",
      default: '//android.widget.EditText[2]',
    });
  }

  /**
   * Selector para botão de login
   * @returns {string}
   */
  get loginButton() {
    return this.getPlatformSelector({
      android: '//android.widget.Button[@text="Login"]',
      ios: "//XCUIElementTypeButton[@name='button-LOGIN']",
      default: '//android.widget.Button[@text="Login"]',
    });
  }

  /**
   * Selector para botão de cadastro
   * @returns {string}
   */
  get signUpButton() {
    return this.getPlatformSelector({
      android: '//android.widget.Button[@text="Sign up"]',
      ios: "//XCUIElementTypeButton[@name='button-SIGN UP']",
      default: '//android.widget.Button[@text="Sign up"]',
    });
  }

  /**
   * Selector para título da tela
   * @returns {string}
   */
  get screenTitle() {
    return this.getPlatformSelector({
      android: '//android.view.View[@text="Login"]',
      ios: "//XCUIElementTypeStaticText[@name='Login']",
      default: '//android.view.View[@text="Login"]',
    });
  }

  // ===================================
  // Ações Principais
  // ===================================

  /**
   * Preenche campo de email
   * @param {string} email - Email para preencher
   */
  async fillEmail(email) {
    log(`Preenchendo email: ${email}`, 'info');
    await this.fillInput($(this.emailInput), email);
  }

  /**
   * Preenche campo de senha
   * @param {string} password - Senha para preencher
   */
  async fillPassword(password) {
    log(`Preenchendo senha`, 'info');
    await this.fillInput($(this.passwordInput), password);
  }

  /**
   * Clica no botão de login
   */
  async clickLogin() {
    log(`Clicando no botão Login`, 'info');
    await this.clickElement($(this.loginButton));
  }

  /**
   * Clica no botão de cadastro
   */
  async clickSignUp() {
    log(`Clicando no botão Sign Up`, 'info');
    await this.clickElement($(this.signUpButton));
  }

  // ===================================
  // Fluxos Completos
  // ===================================

  /**
   * Realiza login completo
   * @param {string} email - Email
   * @param {string} password - Senha
   */
  async performLogin(email, password) {
    log(`Realizando login com email: ${email}`, 'info');
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
    await this.hideKeyboard();
  }

  /**
   * Realiza login com credenciais vazias
   */
  async performLoginWithEmptyFields() {
    log(`Tentando login com campos vazios`, 'info');
    await this.clickLogin();
  }

  /**
   * Realiza login apenas com email
   * @param {string} email - Email
   */
  async performLoginWithEmptyPassword(email) {
    log(`Tentando login apenas com email`, 'info');
    await this.fillEmail(email);
    await this.clickLogin();
  }

  /**
   * Realiza login apenas com senha
   * @param {string} password - Senha
   */
  async performLoginWithEmptyEmail(password) {
    log(`Tentando login apenas com senha`, 'info');
    await this.fillPassword(password);
    await this.clickLogin();
  }

  /**
   * Navega para tela de cadastro
   */
  async navigateToSignUp() {
    log(`Navegando para tela de cadastro`, 'info');
    await this.clickSignUp();
  }

  // ===================================
  // Validações
  // ===================================

  /**
   * Verifica se está na tela de login
   * @returns {Promise<boolean>}
   */
  async isOnLoginPage() {
    try {
      const title = $(this.screenTitle);
      await this.waitForElementVisible(title);
      return await this.isElementVisible(title);
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica se aparece mensagem de login com sucesso
   * @returns {Promise<boolean>}
   */
  async isLoginSuccess() {
    try {
      await this.wait(2000); // Aguardar transição

      // Verificar se está em uma tela diferente (home/menu)
      // Depende do comportamento do app após login
      const currentActivity = await driver.getCurrentActivity().catch(() => '');

      // Se ainda estiver na tela de login, login falhou
      if (currentActivity.includes('login') || await this.isOnLoginPage()) {
        return false;
      }

      return true;
    } catch (error) {
      log(`Erro ao verificar sucesso do login: ${error.message}`, 'error');
      return false;
    }
  }

  /**
   * Verifica se aparece mensagem de erro de login
   * @param {string} expectedMessage - Mensagem esperada
   * @returns {Promise<boolean>}
   */
  async hasLoginError(expectedMessage = MESSAGES.LOGIN_ERROR) {
    try {
      await this.wait(2000); // Aguardar mensagem aparecer

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

  /**
   * Obtém mensagem de erro atual
   * @returns {Promise<string>}
   */
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

  // ===================================
  // Limpeza e Setup
  // ===================================

  /**
   * Limpa campos do formulário
   */
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

  /**
   * Verifica se campos estão limpos
   * @returns {Promise<boolean>}
   */
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

  // ===================================
  // Elementos Específicos
  // ===================================

  /**
   * Obtém valor atual do campo email
   * @returns {Promise<string>}
   */
  async getEmailValue() {
    return await this.getElementValue($(this.emailInput));
  }

  /**
   * Obtém valor atual do campo senha
   * @returns {Promise<string>}
   */
  async getPasswordValue() {
    return await this.getElementValue($(this.passwordInput));
  }

  /**
   * Verifica se botão de login está habilitado
   * @returns {Promise<boolean>}
   */
  async isLoginButtonEnabled() {
    return await $(this.loginButton).isEnabled();
  }

  /**
   * Verifica se botão de cadastro está visível
   * @returns {Promise<boolean>}
   */
  async isSignUpButtonVisible() {
    return await this.isElementVisible($(this.signUpButton));
  }

  // ===================================
  // Debug
  // ===================================

  /**
   * Log estado atual do formulário
   */
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
