const SwipePage = require('../pages/navigation.page');

describe('Navegação com swipe', () => {

  beforeEach(async () => {
    await SwipePage.navigateToSwipe();
  });

  it('deve acessar a tela Swipe', async () => {
    await expect(SwipePage.carousel)
      .toBeDisplayed();
  });

  it('deve arrastar o card para a direita', async () => {
    await SwipePage.swipeRight();

    await expect(SwipePage.secondCard)
      .toBeDisplayed();
  });

  it('deve voltar arrastando para a esquerda', async () => {
    await expect(SwipePage.secondCard)
      .toBeDisplayed();

    await SwipePage.swipeLeft();

    await expect(SwipePage.firstCard)
      .toBeDisplayed();
  });
});
