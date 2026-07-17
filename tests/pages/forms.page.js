/**
 * FormsPage - Page Object para tela de Formulários
 * Responsável por interações com formulários de teste
 */

const BasePage = require('./base.page');
const { PLATFORM } = require('../helpers/constants');
const { log } = require('../helpers/utils');

class FormsPage extends BasePage {
  // ===================================
  // Elementos - Selectors
  // ===================================

  /**
   * Selector para campo de texto (text field)
   * @returns {string}
   */
  get textField() {
    return this.getPlatformSelector({
      android: '//android.widget.EditText[@text="Text field"]',
      ios: "//XCUIElementTypeTextField[@name='text-input']",
      default: '//android.widget.EditText[1]',
    });
  }

  /**
   * Selector para campo de texto que permite edição
   * @returns {string}
   */
  get textInput() {
    return this.getPlatformSelector({
      android: '//android.widget.EditText[1]',
      ios: "//XCUIElementTypeTextField[@name='text-input']",
      default: '//android.widget.EditText[1]',
    });
  }

  /**
   * Selector para dropdown/selector
   * @returns {string}
   */
  get dropdown() {
    return this.getPlatformSelector({
      android: '//android.widget.Spinner',
      ios: "//XCUIElementTypePickerWheel",
      default: '//android.widget.Spinner',
    });
  }

  /**
   * Selector para botão de active/inactive
   * @returns {string}
   */
  get activeButton() {
    return this.getPlatformSelector({
      android: '//android.widget.Button[@text="button-Active"]',
      ios: "//XCUIElementTypeButton[@name='button-Active']",
      default: '//android.widget.Button[@text="button-Active"]',
    });
  }

  /**
   * Selector para botão de submit
   * @returns {string}
   */
  get submitButton() {
    return this.getPlatformSelector({
      android: '//android.widget.Button[@text="Submit"]',
      ios: "//XCUIElementTypeButton[@name='button-SUBMIT']",
      default: '//android.widget.Button[@text="Submit"]',
    });
  }

  /**
   * Selector para título da tela Forms
   * @returns {string}
   */
  get screenTitle() {
    return this.getPlatformSelector({
      android: '//android.view.View[@text="Forms"]',
      ios: "//XCUIElementTypeStaticText[@name='Forms']",
      default: '//android.view.View[@text="Forms"]',
    });
  }

  // ===================================
  // Ações Principais
  // ===================================

  /**
   * Preenche campo de texto
   * @param {string} text - Texto para preencher
   */
  async fillTextField(text) {
    log(`Preenchendo campo de texto com: "${text}"`, 'info');
    await this.fillInput($(this.textInput), text);
  }

  /**
   * Seleciona opção no dropdown
   * @param {string} option - Texto da opção
   */
  async selectDropdownOption(option) {
    log(`Selecionando opção no dropdown: ${option}`, 'info');

    try {
      await this.clickElement($(this.dropdown));
      await this.wait(1000);

      const optionSelector = this.getPlatformSelector({
        android: `//android.widget.TextView[@text="${option}"]`,
        ios: `//XCUIElementTypeStaticText[@name="${option}"]`,
        default: `//*[contains(@text, "${option}")]`,
      });

      await this.clickElement($(optionSelector));
    } catch (error) {
      throw new Error(`Erro ao selecionar opção: ${error.message}`);
    }
  }

  /**
   * Clica no botão Active/Inactive
   */
  async clickActiveButton() {
    log(`Clicando no botão Active/Inactive`, 'info');
    await this.clickElement($(this.activeButton));
  }

  /**
   * Clica no botão Submit
   */
  async clickSubmit() {
    log(`Clicando no botão Submit`, 'info');
    await this.clickElement($(this.submitButton));
  }

  // ===================================
  // Fluxos Completos
  // ===================================

  /**
   * Preenche formulário completo
   * @param {object} formData - Dados do formulário
   */
  async fillCompleteForm(formData) {
    log(`Preenchendo formulário completo`, 'info');

    if (formData.text) {
      await this.fillTextField(formData.text);
    }

    if (formData.dropdown) {
      await this.selectDropdownOption(formData.dropdown);
    }

    if (formData.clickActive) {
      await this.clickActiveButton();
    }

    await this.hideKeyboard();
  }

  /**
   * Submete formulário
   * @param {object} formData - Dados para preencher (opcional)
   */
  async submitForm(formData = null) {
    if (formData) {
      await this.fillCompleteForm(formData);
    }

    await this.clickSubmit();
  }

  /**
   * Preenche e submete formulário
   * @param {object} formData - Dados do formulário
   */
  async fillAndSubmitForm(formData) {
    log(`Preenchendo e submetendo formulário`, 'info');
    await this.fillCompleteForm(formData);
    await this.clickSubmit();
  }

  /**
   * Tenta submeter formulário vazio
   */
  async submitEmptyForm() {
    log(`Tentando submeter formulário vazio`, 'info');
    await this.clickSubmit();
  }

  // ===================================
  // Validações
  // ===================================

  /**
   * Verifica se está na tela Forms
   * @returns {Promise<boolean>}
   */
  async isOnFormsPage() {
    try {
      const title = $(this.screenTitle);
      await this.waitForElementVisible(title);
      return await this.isElementVisible(title);
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica se formulário foi submetido com sucesso
   * @returns {Promise<boolean>}
   */
  async isFormSubmitted() {
    try {
      await this.wait(3000); // Aguardar processamento

      // Verificar mensagem de sucesso ou confirmação
      const successSelector = this.getPlatformSelector({
        android: '//android.view.View[contains(@text, "submitted") or contains(@text, "success")]',
        ios: '//XCUIElementTypeStaticText[contains(@name, "submitted") or contains(@name, "success")]',
        default: '//*[contains(@text, "submitted") or contains(@text, "success")]',
      });

      const successElement = $(successSelector);
      return await this.isElementVisible(successElement);
    } catch (error) {
      log(`Erro ao verificar submissão: ${error.message}`, 'error');
      return false;
    }
  }

  /**
   * Verifica se há mensagem de campo obrigatório
   * @returns {Promise<boolean>}
   */
  async hasRequiredFieldError() {
    try {
      await this.wait(2000);

      const errorSelector = this.getPlatformSelector({
        android: '//android.view.View[contains(@text, "required") or contains(@text, "Required")]',
        ios: '//XCUIElementTypeStaticText[contains(@name, "required") or contains(@name, "Required")]',
        default: '//*[contains(@text, "required") or contains(@text, "Required")]',
      });

      const errorElement = $(errorSelector);
      return await this.isElementVisible(errorElement);
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtém valor atual do campo de texto
   * @returns {Promise<string>}
   */
  async getTextFieldValue() {
    return await this.getElementValue($(this.textInput));
  }

  /**
   * Obtém opção selecionada no dropdown
   * @returns {Promise<string>}
   */
  async getDropdownValue() {
    try {
      if (await this.isAndroid()) {
        const dropdownElement = $(this.dropdown);
        return await dropdownElement.getText();
      } else {
        // iOS
        const dropdownElement = $(this.dropdown);
        return await dropdownElement.getAttribute('name');
      }
    } catch (error) {
      log(`Erro ao obter valor do dropdown: ${error.message}`, 'error');
      return '';
    }
  }

  // ===================================
  // Interação com Elementos Específicos
  // ===================================

  /**
   * Verifica se campo de texto está habilitado
   * @returns {Promise<boolean>}
   */
  async isTextFieldEnabled() {
    return await $(this.textInput).isEnabled();
  }

  /**
   * Verifica se dropdown está habilitado
   * @returns {Promise<boolean>}
   */
  async isDropdownEnabled() {
    return await $(this.dropdown).isEnabled();
  }

  /**
   * Verifica se botão Submit está habilitado
   * @returns {Promise<boolean>}
   */
  async isSubmitButtonEnabled() {
    return await $(this.submitButton).isEnabled();
  }

  /**
   * Obtém texto do botão Active/Inactive
   * @returns {Promise<string>}
   */
  async getActiveButtonText() {
    return await this.getElementText($(this.activeButton));
  }

  /**
   * Verifica se botão está em estado Active
   * @returns {Promise<boolean>}
   */
  async isButtonActive() {
    try {
      const buttonText = await this.getActiveButtonText();
      return buttonText.toLowerCase().includes('active');
    } catch (error) {
      return false;
    }
  }

  // ===================================
  // Limpeza e Reset
  // ===================================

  /**
   * Limpa campo de texto
   */
  async clearTextField() {
    log(`Limpando campo de texto`, 'info');

    try {
      const textField = $(this.textInput);
      if (await this.isElementVisible(textField)) {
        await textField.clearValue();
      }
    } catch (error) {
      log(`Erro ao limpar campo: ${error.message}`, 'warning');
    }
  }

  /**
   * Limpa formulário completo
   */
  async clearForm() {
    log(`Limpando formulário`, 'info');
    await this.clearTextField();
  }

  /**
   * Verifica se formulário está limpo
   * @returns {Promise<boolean>}
   */
  async isFormClean() {
    try {
      const textValue = await this.getTextFieldValue();
      return textValue === '';
    } catch (error) {
      return false;
    }
  }

  // ===================================
  // Validações Avançadas
  // ===================================

  /**
   * Valida formulário com dados específicos
   * @param {object} expectedData - Dados esperados
   * @returns {Promise<boolean>}
   */
  async validateFormData(expectedData) {
    try {
      if (expectedData.text) {
        const actualText = await this.getTextFieldValue();
        if (!actualText.includes(expectedData.text)) {
          log(`Texto incorreto. Esperava: "${expectedData.text}", Obtido: "${actualText}"`, 'warning');
          return false;
        }
      }

      if (expectedData.dropdown) {
        const actualDropdown = await this.getDropdownValue();
        if (!actualDropdown.includes(expectedData.dropdown)) {
          log(`Dropdown incorreto. Esperava: "${expectedData.dropdown}", Obtido: "${actualDropdown}"`, 'warning');
          return false;
        }
      }

      return true;
    } catch (error) {
      log(`Erro ao validar dados: ${error.message}`, 'error');
      return false;
    }
  }

  /**
   * Aguarda validação de formulário
   * @param {string} expectedMessage - Mensagem esperada
   * @returns {Promise<boolean>}
   */
  async waitForValidation(expectedMessage) {
    try {
      await this.wait(3000);

      const messageSelector = this.getPlatformSelector({
        android: `//android.view.View[@text="${expectedMessage}"]`,
        ios: `//XCUIElementTypeStaticText[@name="${expectedMessage}"]`,
        default: `//*[contains(@text, "${expectedMessage}")]`,
      });

      const messageElement = $(messageSelector);
      return await this.isElementVisible(messageElement);
    } catch (error) {
      return false;
    }
  }

  // ===================================
  // Debug e Informações
  // ===================================

  /**
   * Log estado atual do formulário
   */
  async logFormState() {
    log('=== Forms Page State ===', 'info');

    try {
      const textValue = await this.getTextFieldValue();
      const dropdownValue = await this.getDropdownValue();
      const activeButtonText = await this.getActiveButtonText();
      const submitEnabled = await this.isSubmitButtonEnabled();

      log(`Text Field: ${textValue}`, 'info');
      log(`Dropdown: ${dropdownValue}`, 'info');
      log(`Active Button: ${activeButtonText}`, 'info');
      log(`Submit Enabled: ${submitEnabled}`, 'info');
    } catch (error) {
      log(`Erro ao obter estado: ${error.message}`, 'error');
    }
  }

  /**
   * Testa todos os elementos da tela
   * @returns {Promise<object>} - Status de cada elemento
   */
  async testAllElements() {
    log(`Testando todos os elementos da tela Forms`, 'info');

    const elements = {
      textField: () => this.isTextFieldEnabled(),
      dropdown: () => this.isDropdownEnabled(),
      activeButton: () => this.isButtonActive(),
      submitButton: () => this.isSubmitButtonEnabled(),
    };

    const results = {};

    for (const [name, testFn] of Object.entries(elements)) {
      try {
        results[name] = {
          present: true,
          status: await testFn(),
        };
      } catch (error) {
        results[name] = {
          present: false,
          error: error.message,
        };
      }
    }

    return results;
  }
}

module.exports = FormsPage;
