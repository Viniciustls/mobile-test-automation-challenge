class LoginPage {

  get emailInput() {
    return $('//android.widget.EditText[@resource-id="inputEmail"]');
  }

  get passwordInput() {
    return $('//android.widget.EditText[@resource-id="inputPassword"]');
  }

  get loginButton() {
    return $('//android.widget.Button[@text="Login"]');
  }

  get signUpButton() {
    return $('//android.widget.TextView[@text="Sign up"]');
  }

  get screenTitle() {
    return $('//android.view.View[@text="Login"]');
  }

  get invalidEmailMessage() {
    return $('//android.view.View[contains(@text,"valid email")]');
  }

  get shortPasswordMessage() {
    return $('//android.view.View[contains(@text,"8 characters")]');
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