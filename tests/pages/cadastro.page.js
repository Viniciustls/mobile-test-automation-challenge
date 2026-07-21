class CadastroPage {

  get emailInput() {
    return $('//android.widget.EditText[@content-desc="input-email"]');
  }

  get passwordInput() {
    return $('//android.widget.EditText[@content-desc="input-password"]');
  }

  get confirmPasswordInput() {
    return $('//android.widget.EditText[@content-desc="input-repeat-password"]');
  }

  get signUpButton() {
    return $('//android.view.ViewGroup[@content-desc="button-SIGN UP"]');
  }

  get successAlertTitle() {
    return $('//android.widget.TextView[contains(@text,"Signed Up")]');
  }

  get successAlertOkButton() {
    return $('//android.widget.Button[@text="OK"]');
  }

  get passwordMismatchMessage() {
    return $('//android.widget.TextView[contains(@text,"Please enter the same password")]');
  }

  get shortPasswordMessage() {
    return $('//android.widget.TextView[contains(@text,"Please enter at least 8 characters")]');
  }

  get invalidEmailMessage() {
    return $('//android.widget.TextView[contains(@text,"Please enter a valid email address")]');
  }


  async fillEmail(email) {
    await this.emailInput.waitForDisplayed();
    await this.emailInput.setValue(email);
  }


  async fillPassword(password) {
    await this.passwordInput.waitForDisplayed();
    await this.passwordInput.setValue(password);
  }


  async fillConfirmPassword(password) {
    await this.confirmPasswordInput.waitForDisplayed();
    await this.confirmPasswordInput.setValue(password);
  }


  async clickSignUp() {
    await this.signUpButton.waitForDisplayed();
    await this.signUpButton.click();
  }


  async register(email, password, confirmPassword) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.fillConfirmPassword(confirmPassword);
    await this.clickSignUp();
  }


  async acceptSuccessAlert() {
    await this.successAlertOkButton.waitForDisplayed();
    await this.successAlertOkButton.click();
  }


  async getPasswordMismatchMessage() {
    await this.passwordMismatchMessage.waitForDisplayed();

    return await this.passwordMismatchMessage.getText();
  }


  async getShortPasswordMessage() {
    await this.shortPasswordMessage.waitForDisplayed();

    return await this.shortPasswordMessage.getText();
  }


  async isSuccessAlertDisplayed() {
    return await this.successAlertTitle.isDisplayed();
  }


  async isOnSignupPage() {
    return await this.emailInput.isDisplayed();
  }

}


module.exports = new CadastroPage();