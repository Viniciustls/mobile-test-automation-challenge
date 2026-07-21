const LoginPage = require('../pages/login.page');
const CadastroPage = require('../pages/cadastro.page');

describe('Cadastro de usuário', () => {

  beforeEach(async () => {
    await $('//android.widget.Button[@content-desc="Login"]')
      .click();

    await LoginPage.navigateToSignUp();

    await expect(CadastroPage.emailInput)
      .toBeDisplayed();
  });

  const email = 'test@example.com';
  const senha = 'password123';
  const confirmSenha = 'password123';
  const senhaCurta = '1234567';
  const invalidEmail = 'teste';

  it('deve realizar cadastro com sucesso usando dados válidos', async () => {
    await CadastroPage.register(
      email,
      senha,
      confirmSenha
    );

    await expect(CadastroPage.successAlertTitle)
      .toBeDisplayed();

    await CadastroPage.acceptSuccessAlert();
  });

  it('deve exibir erro ao cadastrar com senha menor que 8 caracteres', async () => {
    await CadastroPage.register(
      email,
      senhaCurta,
      senhaCurta
    );

    await expect(CadastroPage.shortPasswordMessage)
      .toBeDisplayed();

    await expect(CadastroPage.shortPasswordMessage)
      .toHaveText(
        'Please enter at least 8 characters'
      );
  });

  it('deve exibir erro ao cadastrar com confirmação de senha diferente', async () => {
    await CadastroPage.register(
      email,
      senha,
      senhaCurta
    );

    await expect(CadastroPage.passwordMismatchMessage)
      .toBeDisplayed();

    await expect(CadastroPage.passwordMismatchMessage)
      .toHaveText(
        'Please enter the same password'
      );
  });

  it('deve exibir erro ao cadastrar com email inválido', async () => {
    await CadastroPage.register(
      invalidEmail,
      senha,
      confirmSenha
    );

    await expect(CadastroPage.invalidEmailMessage)
      .toBeDisplayed();

    await expect(CadastroPage.invalidEmailMessage)
      .toHaveText(
        'Please enter a valid email address'
      );
  });
});