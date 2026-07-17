/**
 * Testes de Navegação
 * Cenários: 7-8 (Navegação entre telas, Navegação pelo menu inferior)
 */

const { expect } = require('chai');
const LoginPage = require('../pages/login.page');
const CadastroPage = require('../pages/cadastro.page');
const MenuPage = require('../pages/menu.page');
const NavigationPage = require('../pages/navigation.page');
const FormsPage = require('../pages/forms.page');
const { USUARIOS } = require('../helpers/constants');
const { getNavigationData } = require('../helpers/data-helper');
const { log } = require('../helpers/utils');

describe('Testes de Navegação', function () {
  let loginPage;
  let cadastroPage;
  let menuPage;
  let navigationPage;

  // Setup global
  before(async function () {
    loginPage = new LoginPage();
    cadastroPage = new CadastroPage();
    menuPage = new MenuPage();
    navigationPage = new NavigationPage();

    // Fazer login para ter acesso ao menu
    try {
      if (await loginPage.isOnLoginPage()) {
        await loginPage.performLogin(USUARIOS.VALIDO.email, USUARIOS.VALIDO.senha);
        await loginPage.wait(3000);
      }
    } catch (error) {
      log('Não foi possível fazer login automaticamente', 'warning');
    }
  });

  /**
   * CENÁRIO 7: Navegação entre telas
   * Objetivo: Verificar se usuário consegue navegar entre diferentes telas do app
   */
  it('deve navegar corretamente entre as telas do aplicativo', async function () {
    log('\n=== CENÁRIO 7: Navegação Entre Telas ===', 'info');

    // Começar do menu
    if (!await menuPage.isOnMenu()) {
      await loginPage.performLogin(USUARIOS.VALIDO.email, USUARIOS.VALIDO.senha);
      await loginPage.wait(3000);
    }

    // Testar navegação: Menu -> Forms
    log('Testando navegação: Menu -> Forms', 'info');
    await menuPage.clickFormsTab();
    await menuPage.wait(2000);

    const formsPage = new FormsPage();
    expect(await formsPage.isOnFormsPage(), 'Deveria estar na tela Forms').to.be.true;

    // Testar navegação: Forms -> Menu
    log('Testando navegação: Forms -> Menu', 'info');
    await menuPage.clickWebViewTab(); // Volta para WebView (menu principal)
    await menuPage.wait(2000);

    expect(await menuPage.isOnMenu(), 'Deveria voltar ao menu').to.be.true;
  });

  /**
   * CENÁRIO 8: Navegação pelo menu inferior
   * Objetivo: Verificar se todas as abas do menu inferior são acessíveis
   */
  it('deve navegar corretamente por todas as abas do menu inferior', async function () {
    log('\n=== CENÁRIO 8: Navegação Menu Inferior ===', 'info');

    // Garantir que está no menu
    if (!await menuPage.isOnMenu()) {
      await loginPage.performLogin(USUARIOS.VALIDO.email, USUARIOS.VALIDO.senha);
      await loginPage.wait(3000);
    }

    // Verificar que todas as abas estão visíveis
    const allTabsVisible = await menuPage.areAllTabsVisible();
    expect(allTabsVisible, 'Todas as abas deveriam estar visíveis').to.be.true;

    // Testar navegação por cada aba
    const tabs = ['home', 'webview', 'forms', 'swipe'];
    const results = {};

    for (const tab of tabs) {
      log(`Navegando para aba: ${tab}`, 'info');

      try {
        await menuPage.navigateToTab(tab);
        await menuPage.wait(2000);

        const isActive = await menuPage.isTabActive(tab);
        results[tab] = isActive;

        log(`Aba ${tab} ativa: ${isActive}`, 'info');
      } catch (error) {
        results[tab] = false;
        log(`Erro ao navegar para aba ${tab}: ${error.message}`, 'error');
      }
    }

    // Verificar que todas as abas foram acessadas com sucesso
    const allSuccessful = Object.values(results).every(result => result === true);
    expect(allSuccessful, 'Todas as abas deveriam estar acessíveis').to.be.true;

    // Voltar para menu principal
    await menuPage.clickWebViewTab();
    await menuPage.wait(2000);
  });

  /**
   * CENÁRIO ADICIONAL: Navegação Login <-> Cadastro
   * Objetivo: Verificar transição entre telas de autenticação
   */
  it('deve navegar corretamente entre Login e Cadastro', async function () {
    log('\n=== CENÁRIO ADICIONAL: Navegação Login-Cadastro ===', 'info');

    // Garantir que está no login
    if (await menuPage.isOnMenu()) {
      await menuPage.performLogout();
    }

    expect(await loginPage.isOnLoginPage(), 'Deveria estar na tela de login').to.be.true;

    // Navegar para cadastro
    await loginPage.navigateToSignUp();
    await loginPage.wait(2000);

    expect(await cadastroPage.isOnSignUpPage(), 'Deveria estar na tela de cadastro').to.be.true;

    // Voltar para login
    await cadastroPage.clickBack();
    await loginPage.wait(2000);

    expect(await loginPage.isOnLoginPage(), 'Deveria voltar à tela de login').to.be.true;
  });

  /**
   * CENÁRIO ADICIONAL: Navegação completa (round-trip)
   * Objetivo: Testar ida e volta entre telas
   */
  it('deve permitir navegação completa (ida e volta) entre as principais telas', async function () {
    log('\n=== CENÁRIO ADICIONAL: Navegação Round-Trip ===', 'info');

    // Garantir que está no menu
    if (!await menuPage.isOnMenu()) {
      await loginPage.performLogin(USUARIOS.VALIDO.email, USUARIOS.VALIDO.senha);
      await loginPage.wait(3000);
    }

    // Testar round-trip para cada aba
    const tabs = ['home', 'forms', 'swipe'];

    for (const tab of tabs) {
      log(`Testando round-trip para aba: ${tab}`, 'info');

      // Ir para a aba
      await menuPage.navigateToTab(tab);
      await menuPage.wait(1000);

      // Voltar para webview (menu principal)
      await menuPage.clickWebViewTab();
      await menuPage.wait(1000);

      // Verificar que voltou
      expect(await menuPage.isOnMenu(), `Deveria voltar ao menu após navegar para ${tab}`).to.be.true;
    }
  });

  /**
   * CENÁRIO ADICIONAL: Detectar tela atual
   * Objetivo: Verificar se sistema consegue identificar tela atual corretamente
   */
  it('deve identificar corretamente a tela atual', async function () {
    log('\n=== CENÁRIO ADICIONAL: Identificar Tela Atual ===', 'info');

    // Garantir que está no menu
    if (!await menuPage.isOnMenu()) {
      await loginPage.performLogin(USUARIOS.VALIDO.email, USUARIOS.VALIDO.senha);
      await loginPage.wait(3000);
    }

    // Verificar tela atual
    const currentScreen = await navigationPage.getCurrentScreen();
    expect(currentScreen, 'Deveria estar no menu').to.equal('menu');

    // Navegar para Forms
    await menuPage.clickFormsTab();
    await menuPage.wait(2000);

    // Verificar que detectou a mudança
    const newScreen = await navigationPage.getCurrentScreen();
    expect(newScreen, 'Deveria ter detectado tela Forms').to.equal('forms');

    // Voltar
    await menuPage.clickWebViewTab();
    await menuPage.wait(2000);
  });

  /**
   * CENÁRIO ADICIONAL: Histórico de navegação
   * Objetivo: Verificar se histórico de navegação é registrado corretamente
   */
  it('deve registrar histórico de navegação corretamente', async function () {
    log('\n=== CENÁRIO ADICIONAL: Histórico de Navegação ===', 'info');

    // Limpar histórico
    navigationPage.clearPageHistory();

    // Garantir que está no menu
    if (!await menuPage.isOnMenu()) {
      await loginPage.performLogin(USUARIOS.VALIDO.email, USUARIOS.VALIDO.senha);
      await loginPage.wait(3000);
    }

    // Realizar algumas navegações
    await menuPage.clickHomeTab();
    await menuPage.wait(1000);

    await menuPage.clickFormsTab();
    await menuPage.wait(1000);

    await menuPage.clickWebViewTab();
    await menuPage.wait(1000);

    // Verificar histórico
    const history = navigationPage.getPageHistory();
    expect(history.length, 'Deveria ter registrado navegações no histórico').to.be.greaterThan(0);

    log('Histórico de navegação:', 'info');
    history.forEach((nav, index) => {
      log(`  ${index + 1}. ${nav.from} -> ${nav.to} (${nav.success ? '✅' : '❌'})`, 'info');
    });
  });

  /**
   * CENÁRIO ADICIONAL: Acessibilidade das abas
   * Objetivo: Verificar que todas as abas estão acessíveis e funcionais
   */
  it('deve permitir acesso a todas as abas principais', async function () {
    log('\n=== CENÁRIO ADICIONAL: Acessibilidade das Abas ===', 'info');

    // Garantir que está no menu
    if (!await menuPage.isOnMenu()) {
      await loginPage.performLogin(USUARIOS.VALIDO.email, USUARIOS.VALIDO.senha);
      await loginPage.wait(3000);
    }

    // Testar acessibilidade
    const results = await menuPage.testAllTabsAccessibility();

    // Verificar resultados
    const tabs = ['home', 'webview', 'forms', 'swipe'];
    for (const tab of tabs) {
      expect(results[tab].accessible, `Aba ${tab} deveria estar acessível`).to.be.true;
    }

    // Voltar para menu principal
    await menuPage.clickWebViewTab();
    await menuPage.wait(2000);
  });
});

/**
 * Data-Driven Tests usando JSON
 * Executa múltiplos cenários de navegação baseados em dados
 */
describe('Data-Driven: Navegação com múltiplos cenários', function () {
  let loginPage;
  let menuPage;
  let navigationPage;

  before(async function () {
    loginPage = new LoginPage();
    menuPage = new MenuPage();
    navigationPage = new NavigationPage();

    // Fazer login
    if (await loginPage.isOnLoginPage()) {
      await loginPage.performLogin(USUARIOS.VALIDO.email, USUARIOS.VALIDO.senha);
      await loginPage.wait(3000);
    }
  });

  // Carregar cenários de teste do JSON
  const navigationScenarios = getNavigationData();

  navigationScenarios.forEach((scenario) => {
    it(`cenário ${scenario.cenario}: ${scenario.descricao}`, async function () {
      log(`\n=== Data-Driven: ${scenario.cenario} ===`, 'info');

      if (scenario.cenario === 'navegacao-botton-tab') {
        // Testar navegação por todas as abas
        const tabs = scenario.abas;
        const results = {};

        for (const tab of tabs) {
          try {
            await menuPage.navigateToTab(tab);
            await menuPage.wait(1000);
            results[tab] = true;
          } catch (error) {
            results[tab] = false;
          }
        }

        // Verificar que todas foram acessíveis
        const allAccessible = Object.values(results).every(r => r === true);
        expect(allAccessible, 'Todas as abas deveriam estar acessíveis').to.be.true;

        // Voltar para menu principal
        await menuPage.clickWebViewTab();
        await menuPage.wait(1000);
      } else {
        // Outros cenários de navegação
        const current = await navigationPage.getCurrentScreen();
        const success = await navigationPage.canNavigate(current, scenario.destino);
        expect(success, `Deveria conseguir navegar de ${scenario.origem} para ${scenario.destino}`).to.be.true;
      }
    });
  });
});
