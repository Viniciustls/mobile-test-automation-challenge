const FormsPage = require('../pages/forms.page');

describe('Preenchimento de formulário', () => {

  beforeEach(async () => {
    await FormsPage.navigateToForms();

    await expect(FormsPage.inputField)
      .toBeDisplayed();
  });

  const texto = 'teste';

  it('deve exibir o texto digitado no campo "You have typed"', async () => {
    await FormsPage.fillInput(texto);

    await expect(FormsPage.typedText)
      .toHaveText(texto);
  });

  it('deve alterar o estado do switch', async () => {
    await expect(FormsPage.switchText)
      .toHaveText('Click to turn the switch ON');

    await FormsPage.toggleSwitch();

    await expect(FormsPage.switchText)
      .toHaveText('Click to turn the switch OFF');
  });

  it('deve selecionar uma opção no dropdown', async () => {
    await FormsPage.selectOption(
      'Appium is awesome'
    );

    await expect(FormsPage.dropdownValue)
      .toHaveText(
        'Appium is awesome'
      );
  });

  it('deve exibir um alerta ao clicar no botão ativo', async () => {
    await FormsPage.clickActiveButton();

    await expect(FormsPage.alertMessage)
      .toHaveText(
        'This button is active'
      );

    await FormsPage.acceptAlert();
  });
});