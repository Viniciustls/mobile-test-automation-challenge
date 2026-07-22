const LoginPage = require('../pages/login.page');
const testData = require('../data/test-data.json');

describe('Login de usuário', () => {

  beforeEach(async () => {
    await LoginPage.navigateToLogin();

    await expect(LoginPage.emailInput)
      .toBeDisplayed();
  });

  it('deve realizar login com sucesso usando dados válidos', async () => {
    const data = testData.login.valido;

    await LoginPage.login(
      data.email,
      data.senha
    );

    await expect(LoginPage.successAlertTitle)
      .toBeDisplayed();

    await LoginPage.acceptSuccessAlert();
  });

  it('deve exibir erro ao realizar login com email inválido', async () => {
    const data = testData.login.emailInvalido;

    await LoginPage.login(
      data.email,
      data.senha
    );

    await expect(LoginPage.invalidEmailMessage)
      .toBeDisplayed();

    await expect(LoginPage.invalidEmailMessage)
      .toHaveText(
        data.mensagem
      );
  });

  it('deve exibir erro ao realizar login com senha menor que 8 caracteres', async () => {
    const data = testData.login.senhaCurta;

    await LoginPage.login(
      data.email,
      data.senha
    );

    await expect(LoginPage.shortPasswordMessage)
      .toBeDisplayed();

    await expect(LoginPage.shortPasswordMessage)
      .toHaveText(
        data.mensagem
      );
  });
});