const LoginPage = require('../pages/login.page');

describe('Login de usuário', () => {

  beforeEach(async () => {
    await $('//android.widget.Button[@content-desc="Login"]')
      .click();

    await expect(LoginPage.emailInput)
      .toBeDisplayed();
  });

  const email = 'test@example.com';
  const senha = 'password123';
  const senhaCurta = '1234567';
  const invalidEmail = 'teste';

  it('deve realizar login com sucesso usando dados válidos', async () => {
    await LoginPage.login(
      email,
      senha
    );

    await expect(LoginPage.successAlertTitle)
      .toBeDisplayed();

    await LoginPage.acceptSuccessAlert();
  });

  it('deve exibir erro ao realizar login com email inválido', async () => {
    await LoginPage.login(
      invalidEmail,
      senha
    );

    await expect(LoginPage.invalidEmailMessage)
      .toBeDisplayed();

    await expect(LoginPage.invalidEmailMessage)
      .toHaveText(
        'Please enter a valid email address'
      );
  });

  it('deve exibir erro ao realizar login com senha menor que 8 caracteres', async () => {
    await LoginPage.login(
      email,
      senhaCurta
    );

    await expect(LoginPage.shortPasswordMessage)
      .toBeDisplayed();

    await expect(LoginPage.shortPasswordMessage)
      .toHaveText(
        'Please enter at least 8 characters'
      );
  });
});