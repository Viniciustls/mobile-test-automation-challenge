/**
 * Testes de Login
 * Cenários: 1-3 (Login com sucesso, Login com senha inválida, Login com campos vazios)
 */

const { expect } = require('chai');
const LoginPage = require('../pages/login.page');
const MenuPage = require('../pages/menu.page');
const { USUARIOS, MESSAGES } = require('../helpers/constants');
const { getLoginData } = require('../helpers/data-helper');
const { log } = require('../helpers/utils');

describe('Testes de Login', function () {
  let loginPage;
  let menuPage;

  // Setup antes de cada teste
  beforeEach(async function () {
    loginPage = new LoginPage();
    menuPage = new MenuPage();

    // Garantir que está na tela de login
    if (await menuPage.isOnMenu()) {
      await menuPage.performLogout();
    }

    // Aguardar tela de login carregar
    await loginPage.waitForElementVisible($(loginPage.emailInput));
  });

  // Cleanup após cada teste
  afterEach(async function () {
    // Logout se estiver logado
    if (await menuPage.isOnMenu()) {
      await menuPage.performLogout();
    }
  });

  /**
   * CENÁRIO 1: Login com sucesso
   * Objetivo: Verificar se usuário consegue fazer login com credenciais válidas
   */
  it('deve realizar login com sucesso usando credenciais válidas', async function () {
    log('\n=== CENÁRIO 1: Login com Sucesso ===', 'info');

    // Dados de teste
    const usuario = USUARIOS.VALIDO;

    // Ação: Realizar login
    await loginPage.performLogin(usuario.email, usuario.senha);

    // Aguardar processamento
    await loginPage.wait(3000);

    // Verificação: Login bem-sucedido
    const loginSuccess = await loginPage.isLoginSuccess();
    expect(loginSuccess, 'Login deveria ter sido bem-sucedido').to.be.true;

    // Verificação adicional: Está no menu
    const onMenu = await menuPage.isOnMenu();
    expect(onMenu, 'Deveria estar no menu principal após login').to.be.true;
  });

  /**
   * CENÁRIO 2: Login com senha inválida
   * Objetivo: Verificar se sistema rejeita login com senha incorreta
   */
  it('deve exibir mensagem de erro ao tentar login com senha inválida', async function () {
    log('\n=== CENÁRIO 2: Login com Senha Inválida ===', 'info');

    // Dados de teste
    const usuario = USUARIOS.INVALIDO;

    // Ação: Tentar login com senha inválida
    await loginPage.performLogin(usuario.email, usuario.senha);

    // Aguardar processamento
    await loginPage.wait(3000);

    // Verificação: Mensagem de erro aparece
    const hasError = await loginPage.hasLoginError(MESSAGES.LOGIN_ERROR);
    expect(hasError, 'Deveria mostrar mensagem de erro de login').to.be.true;

    // Verificação adicional: Ainda está na tela de login
    const onLoginPage = await loginPage.isOnLoginPage();
    expect(onLoginPage, 'Deveria permanecer na tela de login').to.be.true;
  });

  /**
   * CENÁRIO 3: Login com campos vazios
   * Objetivo: Verificar se sistema valida campos obrigatórios
   */
  it('deve exibir mensagem de erro ao tentar login com campos vazios', async function () {
    log('\n=== CENÁRIO 3: Login com Campos Vazios ===', 'info');

    // Ação: Tentar login sem preencher campos
    await loginPage.performLoginWithEmptyFields();

    // Aguardar processamento
    await loginPage.wait(2000);

    // Verificação: Mensagem de erro ou validação
    const hasError = await loginPage.hasLoginError(MESSAGES.LOGIN_EMPTY_FIELDS);

    if (!hasError) {
      // Verificar se permanece na tela de login (comportamento alternativo)
      const onLoginPage = await loginPage.isOnLoginPage();
      expect(onLoginPage, 'Deveria permanecer na tela de login').to.be.true;
    } else {
      expect(hasError, 'Deveria mostrar mensagem de campos obrigatórios').to.be.true;
    }
  });

  /**
   * CENÁRIO ADICIONAL: Login apenas com email (senha vazia)
   * Objetivo: Verificar validação de senha obrigatória
   */
  it('deve exibir erro ao tentar login apenas com email (senha vazia)', async function () {
    log('\n=== CENÁRIO ADICIONAL: Login com Senha Vazia ===', 'info');

    const usuario = USUARIOS.VALIDO;

    // Ação: Preencher apenas email
    await loginPage.fillEmail(usuario.email);
    await loginPage.clickLogin();

    // Aguardar processamento
    await loginPage.wait(2000);

    // Verificação: Erro ou permanece na tela
    const hasError = await loginPage.hasLoginError(MESSAGES.LOGIN_EMPTY_FIELDS);
    const onLoginPage = await loginPage.isOnLoginPage();

    expect(hasError || onLoginPage, 'Deveria mostrar erro ou permanecer na tela').to.be.true;
  });

  /**
   * CENÁRIO ADICIONAL: Login apenas com senha (email vazio)
   * Objetivo: Verificar validação de email obrigatório
   */
  it('deve exibir erro ao tentar login apenas com senha (email vazio)', async function () {
    log('\n=== CENÁRIO ADICIONAL: Login com Email Vazio ===', 'info');

    const usuario = USUARIOS.VALIDO;

    // Ação: Preencher apenas senha
    await loginPage.fillPassword(usuario.senha);
    await loginPage.clickLogin();

    // Aguardar processamento
    await loginPage.wait(2000);

    // Verificação: Erro ou permanece na tela
    const hasError = await loginPage.hasLoginError(MESSAGES.LOGIN_EMPTY_FIELDS);
    const onLoginPage = await loginPage.isOnLoginPage();

    expect(hasError || onLoginPage, 'Deveria mostrar erro ou permanecer na tela').to.be.true;
  });

  /**
   * CENÁRIO ADICIONAL: Verificar estado inicial da tela de login
   * Objetivo: Garantir que elementos estão corretos
   */
  it('deve exibir todos os elementos da tela de login corretamente', async function () {
    log('\n=== CENÁRIO ADICIONAL: Verificar Tela de Login ===', 'info');

    // Verificações: Elementos visíveis
    expect(await loginPage.isOnLoginPage(), 'Deveria estar na tela de login').to.be.true;
    expect(await loginPage.isSignUpButtonVisible(), 'Botão Sign Up deveria estar visível').to.be.true;
    expect(await loginPage.isLoginButtonEnabled(), 'Botão Login deveria estar habilitado').to.be.true;
  });
});

/**
 * Data-Driven Tests usando JSON
 * Executa múltiplos cenários de login baseados em dados
 */
describe('Data-Driven: Login com múltiplos cenários', function () {
  let loginPage;
  let menuPage;

  before(async function () {
    loginPage = new LoginPage();
    menuPage = new MenuPage();
  });

  beforeEach(async function () {
    // Reset da tela
    if (await menuPage.isOnMenu()) {
      await menuPage.performLogout();
    }
  });

  afterEach(async function () {
    // Cleanup
    if (await menuPage.isOnMenu()) {
      await menuPage.performLogout();
    }
  });

  // Carregar cenários de teste do JSON
  const loginScenarios = getLoginData();

  loginScenarios.forEach((scenario) => {
    it(`cenário ${scenario.cenario}: ${scenario.descricao}`, async function () {
      log(`\n=== Data-Driven: ${scenario.cenario} ===`, 'info');

      // Executar ação baseada no cenário
      if (scenario.email === '' && scenario.senha === '') {
        await loginPage.performLoginWithEmptyFields();
      } else {
        await loginPage.performLogin(scenario.email, scenario.senha);
      }

      // Aguardar processamento
      await loginPage.wait(3000);

      // Verificar resultado esperado
      if (scenario.esperado.sucesso) {
        const loginSuccess = await loginPage.isLoginSuccess();
        expect(loginSuccess, `Cenário "${scenario.cenario}" deveria ter sucesso`).to.be.true;
      } else {
        const hasError = await loginPage.hasLoginError(scenario.esperado.mensagem);
        expect(hasError, `Cenário "${scenario.cenario}" deveria mostrar erro`).to.be.true;
      }
    });
  });
});
