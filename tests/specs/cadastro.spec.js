const LoginPage = require('../pages/login.page');
const CadastroPage = require('../pages/cadastro.page');
const testData = require('../data/test-data.json');

describe('Cadastro de usuário', () => {

  beforeEach(async () => {
    await LoginPage.navigateToLogin();

    await LoginPage.navigateToSignUp();

    await expect(CadastroPage.emailInput)
      .toBeDisplayed();
  });

  it('deve realizar cadastro com sucesso usando dados válidos', async () => {
    const data = testData.cadastro.valido;

    await CadastroPage.register(
      data.email,
      data.senha,
      data.confirmSenha
    );

    await expect(CadastroPage.successAlertTitle)
      .toBeDisplayed();

    await CadastroPage.acceptSuccessAlert();
  });

  it('deve exibir erro ao cadastrar com senha menor que 8 caracteres', async () => {
    const data = testData.cadastro.senhaCurta;

    await CadastroPage.register(
      data.email,
      data.senha,
      data.confirmSenha
    );

    await expect(CadastroPage.shortPasswordMessage)
      .toBeDisplayed();

    await expect(CadastroPage.shortPasswordMessage)
      .toHaveText(
        data.mensagem
      );
  });

  it('deve exibir erro ao cadastrar com confirmação de senha diferente', async () => {
    const data = testData.cadastro.senhaDiferente;

    await CadastroPage.register(
      data.email,
      data.senha,
      data.confirmSenha
    );

    await expect(CadastroPage.passwordMismatchMessage)
      .toBeDisplayed();

    await expect(CadastroPage.passwordMismatchMessage)
      .toHaveText(
        data.mensagem
      );
  });

  it('deve exibir erro ao cadastrar com email inválido', async () => {
    const data = testData.cadastro.emailInvalido;

    await CadastroPage.register(
      data.email,
      data.senha,
      data.confirmSenha
    );

    await expect(CadastroPage.invalidEmailMessage)
      .toBeDisplayed();

    await expect(CadastroPage.invalidEmailMessage)
      .toHaveText(
        data.mensagem
      );
  });
});