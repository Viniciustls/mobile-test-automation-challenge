const { expect } = require('chai');
const LoginPage = require('../pages/login.page');
const CadastroPage = require('../pages/cadastro.page');
const { generateEmail } = require('../helpers/data-helper');
const { log } = require('../helpers/utils');

describe('Testes de Cadastro (Sign Up)', function () {
  let loginPage;
  let cadastroPage;

  beforeEach(async function () {
    loginPage = new LoginPage();
    cadastroPage = new CadastroPage();

    const loginTab = $('//android.widget.Button[@content-desc="Login"]');
    await loginTab.waitForDisplayed({ timeout: 10000 });
    await loginTab.click();

    await loginPage.navigateToSignUp();
    await cadastroPage.waitForElementVisible($(cadastroPage.emailInput));
  });

  it('deve realizar cadastro com sucesso - email válido e senha com 8+ caracteres', async function () {
    log('\n=== CENÁRIO 1: Cadastro com Sucesso ===', 'info');

    const email = generateEmail('testexample.com');
    const password = 'password123';
    const confirmPassword = 'password123';

    await cadastroPage.performRegistration(email, password, confirmPassword);
    await cadastroPage.wait(3000);

    const cadastroSuccess = await cadastroPage.isRegistrationSuccess();
    expect(cadastroSuccess, 'Cadastro deveria ter sido bem-sucedido').to.be.true;

    await cadastroPage.acceptSuccessAlert();
  });

  it('deve exibir erro ao tentar cadastro com senha menor que 8 caracteres', async function () {
    log('\n=== CENÁRIO 2: Validação Senha < 8 Caracteres ===', 'info');

    const email = generateEmail('testexample.com');
    const shortPassword = '1234567';
    const confirmPassword = '1234567';

    await cadastroPage.performRegistrationWithShortPassword(email, shortPassword, confirmPassword);
    await cadastroPage.wait(3000);

    const hasError = await cadastroPage.hasShortPasswordError();
    const hasAnyError = await cadastroPage.getErrorMessage() !== '';

    expect(hasError || hasAnyError, 'Deveria mostrar mensagem de erro para senha curta').to.be.true;

    const onSignUpPage = await cadastroPage.isOnSignUpPage();
    expect(onSignUpPage, 'Deveria permanecer na tela de cadastro').to.be.true;
  });

  it('deve exibir erro ao tentar cadastro com confirmação de senha diferente', async function () {
    log('\n=== CENÁRIO 3: Confirmação de Senha Diferente ===', 'info');

    const email = generateEmail('testexample.com');
    const password = 'password123';
    const differentPassword = 'password456';

    await cadastroPage.performRegistrationWithMismatchedPasswords(email, password, differentPassword);
    await cadastroPage.wait(3000);

    const hasError = await cadastroPage.hasPasswordMismatchError();
    const errorMessage = await cadastroPage.getPasswordMismatchErrorMessage();

    expect(hasError, 'Deveria mostrar mensagem de senhas diferentes').to.be.true;
    expect(errorMessage, 'Deveria mostrar mensagem "Please enter the same password"').to.equal('Please enter the same password');

    const onSignUpPage = await cadastroPage.isOnSignUpPage();
    expect(onSignUpPage, 'Deveria permanecer na tela de cadastro').to.be.true;
  });
});
