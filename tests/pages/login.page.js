class LoginPage {

  get emailInput() {
    return $('//android.widget.EditText[@content-desc="input-email"]');
  }

  get passwordInput() {
    return $('//android.widget.EditText[@content-desc="input-password"]');
  }

  get loginButton() {
    return $('//android.view.ViewGroup[@content-desc="button-LOGIN"]');
  }

  get signUpButton() {
    return $('//android.widget.TextView[@text="Sign up"]');
  }

  get screenTitle() {
    return $('//android.view.View[@text="Login"]');
  }

  get invalidEmailMessage() {
    return $('//android.widget.TextView[@text="Please enter a valid email address"]');
  }

  get shortPasswordMessage() {
    return $('//android.widget.TextView[@text="Please enter at least 8 characters"]');
  }

  get successAlertTitle() {
    return $('//android.widget.TextView[contains(@text, "Success") or contains(@text, "successful")]');
  }

  get successOkButton() {
    return $('//android.widget.Button[@text="OK"]');
  }

  async acceptSuccessAlert() {
    await this.successOkButton.waitForDisplayed({ timeout: 5000 });
    await this.successOkButton.click();
  }

  async fillEmail(email) {
    await this.emailInput.waitForDisplayed();
    await this.emailInput.setValue(email);
  }

  async fillPassword(password) {
    await this.passwordInput.waitForDisplayed();
    await this.passwordInput.setValue(password);
  }

  async clickLogin() {
    await this.loginButton.waitForDisplayed();
    await this.loginButton.click();
  }

  async clickSignUp() {
    await this.signUpButton.waitForDisplayed();
    await this.signUpButton.click();
  }

  async login(email, password) {
    await this.fillEmail(email);
    await this.fillPassword(password);

    await this.clickLogin();
  }

  async navigateToSignUp() {
    await this.clickSignUp();
  }
}

module.exports = new LoginPage();