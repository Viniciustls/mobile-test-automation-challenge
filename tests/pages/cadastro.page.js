const BasePage = require('./base.page');
const { MESSAGES, PLATFORM } = require('../helpers/constants');
const { log } = require('../helpers/utils');

class CadastroPage extends BasePage {

  get emailInput() {
    return this.getPlatformSelector({
      android: '//android.widget.EditText[@content-desc="input-email"]',
      ios: "//XCUIElementTypeTextField[@name='input-email']",
      default: '//android.widget.EditText[@content-desc="input-email"]',
    });
  }

  get passwordInput() {
    return this.getPlatformSelector({
      android: '//android.widget.EditText[@content-desc="input-password"]',
      ios: "//XCUIElementTypeSecureTextField[@name='input-password']",
      default: '//android.widget.EditText[@content-desc="input-password"]',
    });
  }

  get confirmPasswordInput() {
    return this.getPlatformSelector({
      android: '//android.widget.EditText[@content-desc="input-repeat-password"]',
      ios: "//XCUIElementTypeSecureTextField[@name='input-repeat-password']",
      default: '//android.widget.EditText[@content-desc="input-repeat-password"]',
    });
  }

  get passwordMismatchMessage() {
    return this.getPlatformSelector({
      android: '//android.widget.EditText[@content-desc="input-repeat-password"]/following-sibling::android.widget.TextView[@text="Please enter the same password"]',
      ios: "//XCUIElementTypeTextField[@name='input-repeat-password']/following-sibling::XCUIElementTypeStaticText[@name='Please enter the same password']",
      default: '//android.widget.EditText[@content-desc="input-repeat-password"]/following-sibling::*[@text="Please enter the same password"]',
    });
  }

  get confirmButton() {
    return this.getPlatformSelector({
      android: '//android.view.ViewGroup[@content-desc="button-SIGN UP"]',
      ios: "//XCUIElementTypeButton[@name='button-SIGN UP']",
      default: '//android.view.ViewGroup[@content-desc="button-SIGN UP"]',
    });
  }

  get screenTitle() {
    return this.getPlatformSelector({
      android: '//android.widget.TextView[@text="Login / Sign up Form"]',
      ios: "//XCUIElementTypeStaticText[@name='Login / Sign up Form']",
      default: '//android.widget.TextView[@text="Login / Sign up Form"]',
    });
  }

  get successAlertTitle() {
    return this.getPlatformSelector({
      android: '//android.widget.TextView[contains(@text, "Signed Up") or contains(@text, "successfully signed up")]',
      ios: "//XCUIElementTypeStaticText[contains(@name, 'Signed Up')]",
      default: '//android.widget.TextView[contains(@text, "Signed Up")]',
    });
  }

  get successAlertOkButton() {
    return this.getPlatformSelector({
      android: '//android.widget.Button[@text="OK" or @text="Ok"]',
      ios: "//XCUIElementTypeButton[@label='OK' or @name='OK']",
      default: '//android.widget.Button[@text="OK"]',
    });
  }

  async fillEmail(email) {
    await this.fillInput($(this.emailInput), email);
  }

  async fillPassword(password) {
    await this.fillInput($(this.passwordInput), password);
  }

  async fillConfirmPassword(confirmPassword) {
    await this.fillInput($(this.confirmPasswordInput), confirmPassword);
  }

  async clickSignUp() {
    await this.clickElement($(this.confirmButton));
  }

  async performRegistration(email, password, confirmPassword) {
    log(`Realizando cadastro`, 'info');

    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.fillConfirmPassword(confirmPassword);

    await this.hideKeyboard();
    await this.clickSignUp();
  }

  async performRegistrationWithEmptyFields() {
    log(`Tentando cadastro com campos vazios`, 'info');
    await this.clickSignUp();
  }

  async performRegistrationWithShortPassword(email, shortPassword, confirmPassword) {
    log(`Tentando cadastro com senha menor que 8 caracteres`, 'info');

    await this.fillEmail(email);
    await this.fillPassword(shortPassword);
    await this.fillConfirmPassword(confirmPassword);

    await this.hideKeyboard();
    await this.clickSignUp();
  }

  async performRegistrationWithMismatchedPasswords(email, password, differentPassword) {
    log(`Tentando cadastro com senhas diferentes`, 'info');

    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.fillConfirmPassword(differentPassword);

    await this.hideKeyboard();
    await this.clickSignUp();
  }

  async acceptSuccessAlert() {
    log(`Fechando alerta de cadastro realizado`, 'info');

    try {
      const okButton = $(this.successAlertOkButton);

      await this.wait(2000);
      await this.waitForElementVisible(okButton, 5000);
      await this.clickElement(okButton);

      await this.wait(2000);

      const title = $(this.successAlertTitle);
      if (await this.isElementVisible(title)) {
        await this.clickElement(okButton);
        await this.wait(1000);
      }

      log(`Cadastro realizado com sucesso`, 'success');
    } catch (error) {
      log(`Erro ao fechar alerta: ${error.message}`, 'warning');
      throw error;
    }
  }

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

  async hasPasswordMismatchError() {
    try {
      await this.wait(2000);

      const mismatchSelectors = [
        '//android.widget.TextView[@text="Please enter the same password"]',
        '//android.widget.TextView[contains(@text, "Please enter the same password")]',
        '//android.view.View[@text="Please enter the same password"]',
        '//android.view.View[contains(@text, "Please enter the same password")]',
        '//android.widget.EditText[@content-desc="input-repeat-password"]/following-sibling::android.widget.TextView[contains(@text, "same password")]',
        '//*[contains(@text, "Please enter the same password")]',
        '//android.widget.TextView[contains(@text, "same password")]',
      ];

      for (const selector of mismatchSelectors) {
        try {
          const element = $(selector);
          if (await this.isElementVisible(element)) {
            log(`Validação exibida: Please enter the same password`, 'info');
            return true;
          }
        } catch (e) {
          continue;
        }
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  async getPasswordMismatchErrorMessage() {
    try {
      await this.wait(2000);

      const mismatchSelectors = [
        '//android.widget.TextView[@text="Please enter the same password"]',
        '//android.widget.TextView[contains(@text, "Please enter the same password")]',
        '//android.view.View[@text="Please enter the same password"]',
        '//android.widget.TextView[contains(@text, "same password")]',
      ];

      for (const selector of mismatchSelectors) {
        try {
          const element = $(selector);
          if (await this.isElementVisible(element)) {
            return await this.getElementText(element);
          }
        } catch (e) {
          continue;
        }
      }

      return '';
    } catch (error) {
      return '';
    }
  }

  async hasShortPasswordError() {
    try {
      await this.wait(2000);

      const errorSelectors = [
        '//android.widget.TextView[@text="please enter at least 8 characters"]',
        '//android.widget.TextView[contains(@text, "please enter at least 8 characters")]',
        '//android.view.View[@text="please enter at least 8 characters"]',
        '//android.view.View[contains(@text, "please enter at least 8 characters")]',
        '//android.widget.EditText[@resource-id="RNE__Input__text-input"]/following-sibling::android.widget.TextView[contains(@text, "8 characters")]',
        '//*[contains(@text, "please enter at least 8 characters")]',
      ];

      for (const selector of errorSelectors) {
        try {
          const element = $(selector);
          if (await this.isElementVisible(element)) {
            log(`Validação exibida: Please enter at least 8 characters`, 'info');
            return true;
          }
        } catch (e) {
          continue;
        }
      }

      return false;
    } catch (error) {
      return false;
    }
  }

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

  async getErrorMessage() {
    try {
      const errorSelectors = [
        { message: 'please enter at least 8 characters', selector: '//android.widget.TextView[@text="please enter at least 8 characters"]' },
        { message: '8 characters', selector: '//android.widget.TextView[contains(@text, "8 characters")]' },
        { message: 'Passwords do not match', selector: '//android.view.View[contains(@text, "Passwords do not match")]' },
        { message: 'complete all fields', selector: '//android.view.View[contains(@text, "complete all fields")]' },
        { message: 'valid email', selector: '//android.view.View[contains(@text, "valid email")]' },
        { message: 'Email already exists', selector: '//android.view.View[contains(@text, "Email already exists")]' },
      ];

      for (const { message, selector } of errorSelectors) {
        try {
          const errorElement = $(selector);
          if (await this.isElementVisible(errorElement)) {
            return await errorElement.getText();
          }
        } catch (e) {
          continue;
        }
      }

      return '';
    } catch (error) {
      return '';
    }
  }


  async clearForm() {
    try {
      const emailField = $(this.emailInput);
      const passwordField = $(this.passwordInput);
      const confirmPasswordField = $(this.confirmPasswordInput);

      const fields = [emailField, passwordField, confirmPasswordField];

      for (const field of fields) {
        if (await this.isElementVisible(field)) {
          await field.clearValue();
        }
      }
    } catch (error) {
      // Silencioso: não logar erro de limpeza
    }
  }

  async areFieldsClean() {
    try {
      const emailValue = await this.getElementValue($(this.emailInput));
      const passwordValue = await this.getElementValue($(this.passwordInput));
      const confirmValue = await this.getElementValue($(this.confirmPasswordInput));

      return emailValue === '' && passwordValue === '' && confirmValue === '';
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

  async getConfirmPasswordValue() {
    return await this.getElementValue($(this.confirmPasswordInput));
  }

  async isConfirmButtonEnabled() {
    return await $(this.confirmButton).isEnabled();
  }

  async logFormState() {
    log('=== Estado do Formulário de Cadastro ===', 'info');

    try {
      const emailValue = await this.getEmailValue();
      const passwordValue = await this.getPasswordValue();
      const confirmValue = await this.getConfirmPasswordValue();
      const confirmEnabled = await this.isConfirmButtonEnabled();

      log(`Email: ${emailValue}`, 'info');
      log(`Senha preenchida: ${passwordValue ? 'Sim' : 'Não'}`, 'info');
      log(`Confirmação preenchida: ${confirmValue ? 'Sim' : 'Não'}`, 'info');
      log(`Botão Sign Up habilitado: ${confirmEnabled ? 'Sim' : 'Não'}`, 'info');
    } catch (error) {
      // Silencioso em produção
    }
  }

  async debugAllTextViews() {
    try {
      log('=== TextViews Visíveis (Debug) ===', 'info');
      const allTextViews = await $$('android.widget.TextView');

      for (const textView of allTextViews) {
        try {
          const text = await textView.getText();
          if (text && text.trim() !== '') {
            const visible = await textView.isDisplayed();
            log(`- "${text}"`, 'info');
          }
        } catch (e) {
          continue;
        }
      }
    } catch (error) {
      // Silencioso em produção
    }
  }
}

module.exports = CadastroPage;
