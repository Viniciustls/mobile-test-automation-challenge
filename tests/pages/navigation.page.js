class SwipePage {

  get swipeTabButton() {
    return $('//android.widget.Button[@content-desc="Swipe"]');
  }

  get carousel() {
    return $('//*[@resource-id="Carousel"]');
  }

  get card() {
    return $('//android.view.ViewGroup[@content-desc="card"]');
  }

  get firstCard() {
    return $('//android.widget.TextView[@text="FULLY OPEN SOURCE"]');
  }

  get secondCard() {
    return $('//android.widget.TextView[@text="GREAT COMMUNITY"]');
  }

  async navigateToSwipe() {
    await this.swipeTabButton.waitForDisplayed();
    await this.swipeTabButton.click();
  }

  async swipeRight() {
    await this.carousel.waitForDisplayed();

    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: 850, y: 1500 },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 300 },
          { type: 'pointerMove', duration: 500, x: 250, y: 1500 },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
  }

  async swipeLeft() {
    await this.carousel.waitForDisplayed();

    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: 250, y: 1500 },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 300 },
          { type: 'pointerMove', duration: 500, x: 850, y: 1500 },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
  }

  async getFirstCardText() {
    await this.firstCard.waitForDisplayed();
    return await this.firstCard.getText();
  }

  async getSecondCardText() {
    await this.secondCard.waitForDisplayed();
    return await this.secondCard.getText();
  }
}

module.exports = new SwipePage();
