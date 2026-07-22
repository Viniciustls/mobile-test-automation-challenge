class FormsPage {

  get formsTabButton() {
    return $('//android.widget.Button[@content-desc="Forms"]');
  }

  get inputField() {
    return $('//android.widget.EditText[@content-desc="text-input"]');
  }

  get typedText() {
    return $('//android.widget.TextView[@content-desc="input-text-result"]');
  }

  get switch() {
    return $('//android.widget.Switch[@content-desc="switch"]');
  }

  get switchText() {
    return $('//android.widget.TextView[@content-desc="switch-text"]');
  }

  get dropdown() {
    return $('//android.view.ViewGroup[@resource-id="android_touchable_wrapper"][@content-desc="Dropdown"]');
  }

  get dropdownValue() {
    return $('//android.widget.EditText[@resource-id="text_input"]');
  }

  get activeButton() {
    return $('//android.view.ViewGroup[@content-desc="button-Active"]');
  }

  get inactiveButton() {
    return $('//android.view.ViewGroup[@content-desc="button-Inactive"]');
  }

  get alertOkButton() {
    return $('//android.widget.Button[@text="OK"]');
  }

  get alertTitle() {
    return $('//android.widget.TextView[contains(@text, "Active")]');
  }

  get alertMessage() {
    return $('//android.widget.TextView[@text="This button is active"]');
  }

  get closeAlert() {
    return this.alertOkButton;
  }

  async navigateToForms() {
    await this.formsTabButton.waitForDisplayed();
    await this.formsTabButton.click();
  }

  async fillInput(text) {
    await this.inputField.waitForDisplayed();
    await this.inputField.setValue(text);
  }

  async getTypedText() {
    await this.typedText.waitForDisplayed();
    return await this.typedText.getText();
  }

  async toggleSwitch() {
    await this.switch.waitForDisplayed();
    await this.switch.click();
  }

  async getSwitchText() {
    await this.switchText.waitForDisplayed();
    return await this.switchText.getText();
  }

  async openDropdown() {
    await this.dropdown.waitForDisplayed({ timeout: 15000 });
    await this.dropdown.click();
  }

  async selectOption(option) {
    await this.openDropdown();

    const optionSelector = $(`//android.widget.CheckedTextView[@text="${option}"]`);
    await optionSelector.waitForDisplayed({ timeout: 5000 });
    await optionSelector.click();
  }

  async clickActiveButton() {
    await this.activeButton.waitForDisplayed();
    await this.activeButton.click();
  }

  async acceptAlert() {
    await this.alertOkButton.waitForDisplayed({ timeout: 5000 });
    await this.alertOkButton.click();
  }

  async fillInputAndGetTypedText(text) {
    await this.fillInput(text);
    return await this.getTypedText();
  }

  async toggleSwitchAndGetText() {
    await this.toggleSwitch();
    return await this.getSwitchText();
  }

  async clickActiveAndAcceptAlert() {
    await this.clickActiveButton();
    await this.acceptAlert();
  }

  async isSwitchOn() {
    const text = await this.getSwitchText();
    return text.includes('turn the switch OFF');
  }

  async isSwitchOff() {
    const text = await this.getSwitchText();
    return text.includes('turn the switch ON');
  }
}

module.exports = new FormsPage();
