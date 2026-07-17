/**
 * CadastroPage - Page Object para tela de Cadastro
 * Responsável por todas as interações com a tela de cadastro/registro
 */

const BasePage = require('./base.page');
const { MESSAGES, PLATFORM } = require('../helpers/constants');
const { log } = require('../helpers/utils');

class CadastroPage extends BasePage {
  // ===================================
  // Elementos - Selectors
  // ===================================

  /**
   * Selector para campo de email
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
   * Selector para campo de senha
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
   * Selector para campo de confirmar senha
   * @returns {string}
   */
  get confirmPasswordInput() {
    return this.getPlatformSelector({
      android: '//android.widget.EditText[3]',
      ios: "//XCUIElementTypeSecureTextField[@name='input-repeat-password']",
      default: '//android.widget.EditText[3]',
    });
  }

  /**
   * Selector para campo de nome
   * @returns {string}
   */
  get nameInput() {
    return this.getPlatformSelector({
      android: '//android.widget.EditText[4]',
      ios: "//XCUIElementTypeTextField[@name='input-name']",
      default: '//android.widget.EditText[4]',
    });
  }

  /**
   * Selector para botão de confirmar cadastro
   * @returns {string}
   */
  get confirmButton() {
    return this.getPlatformSelector({
      android: '//android.widget.Button[@text="Confirm"]',
      ios: "//XCUIElementTypeButton[@name='button-CONFIRM']",
      default: '//android.widget.Button[@text="Confirm"]',
    });
  }

  /**
   * Selector para botão voltar
   * @returns {string}
   */
  get backButton() {
    return this.getPlatformSelector({
      android: '//android.widget.Button[@content-desc="Go back"]',
      ios: "//XCUIElementTypeButton[@name='Go back']",
      default: '//android.widget.Button[@content-desc="Go back"]',
    });
  }

  /**
   * Selector para título da tela
   * @returns {string}
   */
  get screenTitle() {
    return this.getPlatformSelector({
      android: '//android.view.View[@text="Sign Up"]',
      ios: "//XCUIElementTypeStaticText[@name='Sign Up']",
      default: '//android.view.View[@text="Sign Up"]',
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
   * Preenche campo de confirmar senha
   * @param {string} confirmPassword - Confirmação de senha
   */
  async fillConfirmPassword(confirmPassword) {
    log(`Preenchendo confirmação de senha`, 'info');
    await this.fillInput($(this.confirmPasswordInput), confirmPassword);
  }

  /**
   * Preenche campo de nome
   * @param {string} name - Nome para preencher
   */
  async fillName(name) {
    log(`Preenchendo nome: ${name}`, 'info');
    await this.fillInput($(this.nameInput), name);
  }

  /**
   * Clica no botão de confirmar cadastro
   */
  async clickConfirm() {
    log(`Clicando no botão Confirm`, 'info');
    await this.clickElement($(this.confirmButton));
  }

  /**
   * Clica no botão voltar
   */
  async clickBack() {
    log(`Clicando no botão voltar`, 'info');
    await this.clickElement($(this.backButton));
  }

  // ===================================
  // Fluxos Completos
  // ===================================

  /**
   * Realiza cadastro completo
   * @param {string} email - Email
   * @param {string} password - Senha
   * @param {string} confirmPassword - Confirmação de senha
   * @param {string} name - Nome
   */
  async performRegistration(email, password, confirmPassword, name) {
    log(`Realizando cadastro para: ${email}`, 'info');

    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.fillConfirmPassword(confirmPassword);
    await this.fillName(name);

    await this.hideKeyboard();
    await this.clickConfirm();
  }

  /**
   * Realiza cadastro com dados vazios
   */
  async performRegistrationWithEmptyFields() {
    log(`Tentando cadastro com campos vazios`, 'info');
    await this.clickConfirm();
  }

  /**
   * Realiza cadastro com senhas que não coincidem
   * @param {string} email - Email
   * @param {string} password - Senha
   * @param {string} differentPassword - Senha diferente
   * @param {string} name - Nome
   */
  async performRegistrationWithMismatchedPasswords(email, password, differentPassword, name) {
    log(`Tentando cadastro com senhas diferentes`, 'info');

    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.fillConfirmPassword(differentPassword);
    await this.fillName(name);

    await this.hideKeyboard();
    await this.clickConfirm();
  }

  /**
   * Realiza cadastro com email inválido
   * @param {string} invalidEmail - Email inválido
   * @param {string} password - Senha
   * @param {string} confirmPassword - Confirmação de senha
   * @param {string} name - Nome
   */
  async performRegistrationWithInvalidEmail(invalidEmail, password, confirmPassword, name) {
    log(`Tentando cadastro com email inválido: ${invalidEmail}`, 'info');

    await this.fillEmail(invalidEmail);
    await this.fillPassword(password);
    await this.fillConfirmPassword(confirmPassword);
    await this.fillName(name);

    await this.hideKeyboard();
    await this.clickConfirm();
  }

  // ===================================
  // Validações
  // ===================================

  /**
   * Verifica se está na tela de cadastro
   * @returns {Promise<boolean>}
   */
  async isOnSignUpPage() {
    try {
      const title = $(this.screenTitle);
      await this.waitForElementVisible(title);
      return await this.isElementVisible(title);
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica se cadastro foi bem-sucedido
   * @returns {Promise<boolean>}
   */
  async isRegistrationSuccess() {
    try {
      await this.wait(3000); // Aguardar processamento

      // Verificar se está em uma tela diferente (voltou para login ou home)
      const currentActivity = await driver.getCurrentActivity().catch(() => '');

      // Se não estiver mais na tela de cadastro, sucesso
      if (!await this.isOnSignUpPage()) {
        return true;
      }

      return false;
    } catch (error) {
      log(`Erro ao verificar sucesso do cadastro: ${error.message}`, 'error');
      return false;
    }
  }

  /**
   * Verifica se aparece mensagem de erro de email já existe
   * @returns {Promise<boolean>}
   */
  async hasEmailAlreadyExistsError() {
    try {
      await this.wait(2000);

      const errorSelector = this.getPlatformSelector({
        android: '//android.view.View[contains(@text, "Email already exists")]',
        ios: '//XCUIElementTypeStaticText[contains(@name, "Email already exists")]',
        default: '//*[contains(@text, "Email already exists")]',
      });

      const errorElement = $(errorSelector);
      return await this.isElementVisible(errorElement);
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica se aparece mensagem de senhas não coincidem
   * @returns {Promise<boolean>}
   */
  async hasPasswordMismatchError() {
    try {
      await this.wait(2000);

      const errorSelector = this.getPlatformSelector({
        android: '//android.view.View[contains(@text, "Passwords do not match")]',
        ios: '//XCUIElementTypeStaticText[contains(@name, "Passwords do not match")]',
        default: '//*[contains(@text, "Passwords do not match")]',
      });

      const errorElement = $(errorSelector);
      return await this.isElementVisible(errorElement);
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica se aparece mensagem de campos obrigatórios
   * @returns {Promise<boolean>}
   */
  async hasRequiredFieldsError() {
    try {
      await this.wait(2000);

      const errorSelector = this.getPlatformSelector({
        android: '//android.view.View[contains(@text, "complete all fields")]',
        ios: '//XCUIElementTypeStaticText[contains(@name, "complete all fields")]',
        default: '//*[contains(@text, "complete all fields")]',
      });

      const errorElement = $(errorSelector);
      return await this.isElementVisible(errorElement);
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica se aparece mensagem de email inválido
   * @returns {Promise<boolean>}
   */
  async hasInvalidEmailError() {
    try {
      await this.wait(2000);

      const errorSelector = this.getPlatformSelector({
        android: '//android.view.View[contains(@text, "valid email")]',
        ios: '//XCUIElementTypeStaticText[contains(@name, "valid email")]',
        default: '//*[contains(@text, "valid email")]',
      });

      const errorElement = $(errorSelector);
      return await this.isElementVisible(errorElement);
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtém mensagem de erro atual
   * @returns {Promise<string>}
   */
  async getErrorMessage() {
    try {
      const errorSelectors = [
        'Email already exists',
        'Passwords do not match',
        'complete all fields',
        'valid email',
      ];

      for (const message of errorSelectors) {
        const errorSelector = this.getPlatformSelector({
          android: `//android.view.View[contains(@text, "${message}")]`,
          ios: `//XCUIElementTypeStaticText[contains(@name, "${message}")]`,
          default: `//*[contains(@text, "${message}")]`,
        });

        const errorElement = $(errorSelector);

        if (await this.isElementVisible(errorElement)) {
          return await this.getElementText(errorElement);
        }
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
      const confirmPasswordField = $(this.confirmPasswordInput);
      const nameField = $(this.nameInput);

      const fields = [emailField, passwordField, confirmPasswordField, nameField];

      for (const field of fields) {
        if (await this.isElementVisible(field)) {
          await field.clearValue();
        }
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
      const emailValue = await this.getElementValue($(this.emailInput));
      const passwordValue = await this.getElementValue($(this.passwordInput));
      const confirmValue = await this.getElementValue($(this.confirmPasswordInput));
      const nameValue = await this.getElementValue($(this.nameInput));

      return emailValue === '' && passwordValue === '' &&
             confirmValue === '' && nameValue === '';
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
   * Obtém valor atual do campo confirmar senha
   * @returns {Promise<string>}
   */
  async getConfirmPasswordValue() {
    return await this.getElementValue($(this.confirmPasswordInput));
  }

  /**
   * Obtém valor atual do campo nome
   * @returns {Promise<string>}
   */
  async getNameValue() {
    return await this.getElementValue($(this.nameInput));
  }

  /**
   * Verifica se botão confirmar está habilitado
   * @returns {Promise<boolean>}
   */
  async isConfirmButtonEnabled() {
    return await $(this.confirmButton).isEnabled();
  }

  /**
   * Verifica se botão voltar está visível
   * @returns {Promise<boolean>}
   */
  async isBackButtonVisible() {
    return await this.isElementVisible($(this.backButton));
  }

  // ===================================
  // Debug
  // ===================================

  /**
   * Log estado atual do formulário
   */
  async logFormState() {
    log('=== Cadastro Form State ===', 'info');

    try {
      const emailValue = await this.getEmailValue();
      const passwordValue = await this.getPasswordValue();
      const confirmValue = await this.getConfirmPasswordValue();
      const nameValue = await this.getNameValue();
      const confirmEnabled = await this.isConfirmButtonEnabled();

      log(`Email: ${emailValue}`, 'info');
      log(`Password: ${passwordValue ? '***' : ''}`, 'info');
      log(`Confirm Password: ${confirmValue ? '***' : ''}`, 'info');
      log(`Name: ${nameValue}`, 'info');
      log(`Confirm Button Enabled: ${confirmEnabled}`, 'info');
    } catch (error) {
      log(`Erro ao obter estado: ${error.message}`, 'error');
    }
  }
}

module.exports = CadastroPage;
