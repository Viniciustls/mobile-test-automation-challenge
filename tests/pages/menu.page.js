class MenuPage {

  get menuTitle() {
    return $('//android.view.View[@text="WebView"]');
  }

  get homeTab() {
    return $('//android.widget.Button[@content-desc="Home"]');
  }

  get loginTab() {
    return $('//android.widget.Button[@content-desc="Login"]');
  }

  get webViewTab() {
    return $('//android.widget.Button[@content-desc="WebView"]');
  }

  get formsTab() {
    return $('//android.widget.Button[@content-desc="Forms"]');
  }

  get swipeTab() {
    return $('//android.widget.Button[@content-desc="Swipe"]');
  }


  async openLogin() {
    await this.loginTab.click();
  }


  async openForms() {
    await this.formsTab.click();
  }


  async openSwipe() {
    await this.swipeTab.click();
  }

}

module.exports = new MenuPage();