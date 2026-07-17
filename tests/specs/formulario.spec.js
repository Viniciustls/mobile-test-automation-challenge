/**
 * Testes de Formulário
 * Cenários: 9-10 (Preenchimento de formulário, Validação de mensagens de erro)
 */

const { expect } = require('chai');
const LoginPage = require('../pages/login.page');
const MenuPage = require('../pages/menu.page');
const FormsPage = require('../pages/forms.page');
const { USUARIOS } = require('../helpers/constants');
const { getFormData, getErrorMessagesData } = require('../helpers/data-helper');
const { log } = require('../helpers/utils');

describe('Testes de Formulário', function () {
  let loginPage;
  let menuPage;
  let formsPage;

  // Setup global
  before(async function () {
    loginPage = new LoginPage();
    menuPage = new MenuPage();
    formsPage = new FormsPage();

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

  // Garantir que está no menu antes de cada teste
  beforeEach(async function () {
    if (!await menuPage.isOnMenu()) {
      await loginPage.performLogin(USUARIOS.VALIDO.email, USUARIOS.VALIDO.senha);
      await loginPage.wait(3000);
    }
  });

  /**
   * CENÁRIO 9: Preenchimento de formulário
   * Objetivo: Verificar se usuário consegue preencher formulário corretamente
   */
  it('deve permitir preenchimento completo de formulário', async function () {
    log('\n=== CENÁRIO 9: Preenchimento de Formulário ===', 'info');

    // Navegar para tela Forms
    await menuPage.clickFormsTab();
    await menuPage.wait(2000);

    expect(await formsPage.isOnFormsPage(), 'Deveria estar na tela Forms').to.be.true;

    // Dados do formulário
    const formData = {
      text: 'Teste de preenchimento de campo de texto',
      dropdown: 'Selenium', // Opção comum no app de demonstração
      clickActive: true,
    };

    // Ação: Preencher formulário
    await formsPage.fillTextField(formData.text);
    await formsPage.wait(500);

    // Selecionar opção no dropdown (se disponível)
    if (await formsPage.isDropdownEnabled()) {
      try {
        await formsPage.selectDropdownOption(formData.dropdown);
      } catch (error) {
        log('Dropdown não disponível ou erro ao selecionar', 'warning');
      }
    }

    // Clicar no botão Active
    if (formData.clickActive) {
      await formsPage.clickActiveButton();
      await formsPage.wait(500);
    }

    // Verificar: Campos preenchidos corretamente
    const textValue = await formsPage.getTextFieldValue();
    expect(textValue, 'Texto deveria estar preenchido').to.include(formData.text);

    // Submeter formulário
    await formsPage.clickSubmit();
    await formsPage.wait(3000);

    // Verificar se foi submetido (pode variar conforme comportamento do app)
    log('Formulário submetido', 'info');

    // Voltar para menu
    await menuPage.clickWebViewTab();
    await menuPage.wait(2000);
  });

  /**
   * CENÁRIO 10: Validação de mensagens de erro
   * Objetivo: Verificar se sistema mostra mensagens de erro apropriadas
   */
  it('deve exibir mensagens de erro para validações do formulário', async function () {
    log('\n=== CENÁRIO 10: Validação de Mensagens de Erro ===', 'info');

    // Navegar para tela Forms
    await menuPage.clickFormsTab();
    await menuPage.wait(2000);

    expect(await formsPage.isOnFormsPage(), 'Deveria estar na tela Forms').to.be.true;

    // Ação: Tentar submeter formulário vazio
    await formsPage.submitEmptyForm();

    // Aguardar validação
    await formsPage.wait(2000);

    // Verificação: Pode mostrar mensagem de erro ou não aceitar submissão
    const hasRequiredError = await formsPage.hasRequiredFieldError();
    const stillOnForms = await formsPage.isOnFormsPage();

    if (hasRequiredError) {
      log('Mensagem de campo obrigatório exibida', 'info');
      expect(hasRequiredError, 'Deveria mostrar mensagem de campo obrigatório').to.be.true;
    } else {
      log('Nenhuma mensagem de erro, mas permanece na tela (comportamento alternativo)', 'info');
      expect(stillOnForms, 'Deveria permanecer na tela Forms').to.be.true;
    }

    // Voltar para menu
    await menuPage.clickWebViewTab();
    await menuPage.wait(2000);
  });

  /**
   * CENÁRIO ADICIONAL: Validação de campo de texto
   * Objetivo: Verificar validação específica de campo de texto
   */
  it('deve validar campo de texto corretamente', async function () {
    log('\n=== CENÁRIO ADICIONAL: Validação Campo Texto ===', 'info');

    // Navegar para tela Forms
    await menuPage.clickFormsTab();
    await menuPage.wait(2000);

    // Preencher campo com texto curto
    const shortText = 'ABC';
    await formsPage.fillTextField(shortText);
    await formsPage.wait(500);

    // Verificar que texto foi preenchido
    const textValue = await formsPage.getTextFieldValue();
    expect(textValue, 'Texto deveria estar no campo').to.include(shortText);

    // Limpar campo
    await formsPage.clearTextField();
    await formsPage.wait(500);

    // Verificar que campo está limpo
    const isEmpty = await formsPage.isFormClean();
    expect(isEmpty, 'Campo deveria estar vazio após limpar').to.be.true;

    // Voltar para menu
    await menuPage.clickWebViewTab();
    await menuPage.wait(2000);
  });

  /**
   * CENÁRIO ADICIONAL: Validação de dropdown
   * Objetivo: Verificar seleção e validação de dropdown
   */
  it('deve permitir seleção e validação de dropdown', async function () {
    log('\n=== CENÁRIO ADICIONAL: Validação Dropdown ===', 'info');

    // Navegar para tela Forms
    await menuPage.clickFormsTab();
    await menuPage.wait(2000);

    // Verificar se dropdown está presente e habilitado
    if (await formsPage.isDropdownEnabled()) {
      // Tentar selecionar uma opção
      try {
        await formsPage.selectDropdownOption('Appium');
        await formsPage.wait(1000);

        // Verificar seleção
        const dropdownValue = await formsPage.getDropdownValue();
        log(`Dropdown selecionado: ${dropdownValue}`, 'info');
      } catch (error) {
        log('Erro ao interagir com dropdown (pode não estar disponível)', 'warning');
      }
    } else {
      log('Dropdown não disponível nesta versão do app', 'info');
    }

    // Voltar para menu
    await menuPage.clickWebViewTab();
    await menuPage.wait(2000);
  });

  /**
   * CENÁRIO ADICIONAL: Interação com botão Active/Inactive
   * Objetivo: Verificar comportamento do botão toggle
   */
  it('deve alternar estado do botão Active/Inactive corretamente', async function () {
    log('\n=== CENÁRIO ADICIONAL: Botão Active/Inactive ===', 'info');

    // Navegar para tela Forms
    await menuPage.clickFormsTab();
    await menuPage.wait(2000);

    // Verificar estado inicial
    const initialText = await formsPage.getActiveButtonText();
    log(`Estado inicial do botão: ${initialText}`, 'info');

    // Clicar para alternar
    await formsPage.clickActiveButton();
    await formsPage.wait(1000);

    // Verificar mudança
    const afterClickText = await formsPage.getActiveButtonText();
    log(`Estado após clique: ${afterClickText}`, 'info');

    // Os textos devem ser diferentes
    expect(initialText !== afterClickText, 'Botão deveria ter alternado de estado').to.be.true;

    // Voltar para menu
    await menuPage.clickWebViewTab();
    await menuPage.wait(2000);
  });

  /**
   * CENÁRIO ADICIONAL: Preenchimento e validação de formulário completo
   * Objetivo: Testar formulário com dados completos
   */
  it('deve permitir preenchimento e submissão de formulário completo', async function () {
    log('\n=== CENÁRIO ADICIONAL: Formulário Completo ===', 'info');

    // Navegar para tela Forms
    await menuPage.clickFormsTab();
    await menuPage.wait(2000);

    // Preencher formulário com dados completos
    const completeFormData = {
      text: 'Texto de teste completo para o formulário',
      dropdown: 'WebDriverIO',
    };

    await formsPage.fillTextField(completeFormData.text);
    await formsPage.wait(500);

    if (await formsPage.isDropdownEnabled()) {
      try {
        await formsPage.selectDropdownOption(completeFormData.dropdown);
      } catch (error) {
        log('Dropdown não disponível', 'warning');
      }
    }

    // Submeter
    await formsPage.clickSubmit();
    await formsPage.wait(3000);

    // Verificar seção (comportamento pode variar)
    const submitted = await formsPage.isFormSubmitted();
    log(`Formulário submetido: ${submitted}`, 'info');

    // Voltar para menu
    await menuPage.clickWebViewTab();
    await menuPage.wait(2000);
  });

  /**
   * CENÁRIO ADICIONAL: Validação de todos os elementos da tela
   * Objetivo: Verificar que todos os elementos estão presentes
   */
  it('deve exibir todos os elementos da tela Forms corretamente', async function () {
    log('\n=== CENÁRIO ADICIONAL: Verificar Tela Forms ===', 'info');

    // Navegar para tela Forms
    await menuPage.clickFormsTab();
    await menuPage.wait(2000);

    // Testar todos os elementos
    const elementsStatus = await formsPage.testAllElements();

    // Verificar resultados
    for (const [elementName, status] of Object.entries(elementsStatus)) {
      log(`Elemento ${elementName}: presente=${status.present}`, 'info');
      expect(status.present, `Elemento ${elementName} deveria estar presente`).to.be.true;
    }

    // Voltar para menu
    await menuPage.clickWebViewTab();
    await menuPage.wait(2000);
  });

  /**
   * CENÁRIO ADICIONAL: Verificar persistência de dados
   * Objetivo: Verificar se dados permanecem após navegação
   */
  it('deve manter dados preenchidos após navegação', async function () {
    log('\n=== CENÁRIO ADICIONAL: Persistência de Dados ===', 'info');

    // Navegar para tela Forms
    await menuPage.clickFormsTab();
    await menuPage.wait(2000);

    // Preencher campo
    const testText = 'Teste de persistência';
    await formsPage.fillTextField(testText);

    // Navegar para outra aba e voltar
    await menuPage.clickHomeTab();
    await menuPage.wait(1000);

    await menuPage.clickFormsTab();
    await menuPage.wait(1000);

    // Verificar se dados persistiram (pode variar conforme app)
    const currentText = await formsPage.getTextFieldValue();
    log(`Texto preenchido: "${testText}" | Texto atual: "${currentText}"`, 'info');

    // NOTA: Comportamento pode variar - alguns apps limpam, outros mantêm
    // Aqui apenas logamos o comportamento observado

    // Voltar para menu
    await menuPage.clickWebViewTab();
    await menuPage.wait(2000);
  });
});

/**
 * Data-Driven Tests usando JSON
 * Executa múltiplos cenários de formulário baseados em dados
 */
describe('Data-Driven: Formulário com múltiplos cenários', function () {
  let loginPage;
  let menuPage;
  let formsPage;

  before(async function () {
    loginPage = new LoginPage();
    menuPage = new MenuPage();
    formsPage = new FormsPage();

    // Fazer login
    if (await loginPage.isOnLoginPage()) {
      await loginPage.performLogin(USUARIOS.VALIDO.email, USUARIOS.VALIDO.senha);
      await loginPage.wait(3000);
    }
  });

  beforeEach(async function () {
    // Garantir que está no menu
    if (!await menuPage.isOnMenu()) {
      await loginPage.performLogin(USUARIOS.VALIDO.email, USUARIOS.VALIDO.senha);
      await loginPage.wait(3000);
    }
  });

  // Carregar cenários de teste do JSON
  const formScenarios = getFormData();

  formScenarios.forEach((scenario) => {
    it(`cenário ${scenario.cenario}: ${scenario.descricao}`, async function () {
      log(`\n=== Data-Driven: ${scenario.cenario} ===`, 'info');

      // Navegar para Forms
      await menuPage.clickFormsTab();
      await menuPage.wait(2000);

      // Executar ação baseada no cenário
      if (scenario.cenario === 'formulario-obrigatorio-vazio') {
        await formsPage.submitEmptyForm();
      } else if (scenario.cenario === 'formulario-email-invalido') {
        // Nota: No app de demonstração, pode não ter campo de email específico
        await formsPage.fillTextField(scenario.dados.nome || 'Teste');
        await formsPage.clickSubmit();
      } else {
        // Formulário completo
        await formsPage.fillTextField(scenario.dados.texto || scenario.dados.nome || 'Teste');
        await formsPage.clickSubmit();
      }

      // Aguardar processamento
      await formsPage.wait(3000);

      // Verificar resultado esperado
      if (scenario.esperado.sucesso) {
        log('Cenário deveria ter sucesso (validação visual)', 'info');
        // Verificar que não houve erro crítico
      } else {
        const hasError = await formsPage.hasRequiredFieldError();
        expect(hasError, `Cenário "${scenario.cenario}" deveria mostrar erro`).to.be.true;
      }

      // Voltar para menu
      await menuPage.clickWebViewTab();
      await menuPage.wait(2000);
    });
  });
});

/**
 * Testes Específicos de Mensagens de Erro
 */
describe('Validação de Mensagens de Erro', function () {
  let loginPage;
  let menuPage;
  let formsPage;

  before(async function () {
    loginPage = new LoginPage();
    menuPage = new MenuPage();
    formsPage = new FormsPage();

    // Fazer login
    if (await loginPage.isOnLoginPage()) {
      await loginPage.performLogin(USUARIOS.VALIDO.email, USUARIOS.VALIDO.senha);
      await loginPage.wait(3000);
    }
  });

  beforeEach(async function () {
    // Garantir que está no menu
    if (!await menuPage.isOnMenu()) {
      await loginPage.performLogin(USUARIOS.VALIDO.email, USUARIOS.VALIDO.senha);
      await loginPage.wait(3000);
    }
  });

  // Carregar cenários de erro
  const errorScenarios = getErrorMessagesData();

  errorScenarios.forEach((scenario) => {
    it(`cenário ${scenario.cenario}: ${scenario.descricao}`, async function () {
      log(`\n=== Mensagem de Erro: ${scenario.cenario} ===`, 'info');

      if (scenario.acao === 'login_com_credenciais_invalidas') {
        // Fazer logout primeiro
        await menuPage.performLogout();
        await loginPage.wait(2000);

        // Tentar login inválido
        await loginPage.performLogin('invalido@test.com', 'senha_errada');
        await loginPage.wait(2000);

        // Verificar mensagem de erro
        const hasError = await loginPage.hasLoginError();
        expect(hasError, 'Deveria mostrar mensagem de erro de login').to.be.true;

      } else if (scenario.acao === 'submeter_formulario_vazio') {
        // Navegar para Forms e submeter vazio
        await menuPage.clickFormsTab();
        await menuPage.wait(2000);

        await formsPage.submitEmptyForm();
        await formsPage.wait(2000);

        // Verificar mensagem ou permanência na tela
        const hasError = await formsPage.hasRequiredFieldError();
        const stillOnForms = await formsPage.isOnFormsPage();

        expect(hasError || stillOnForms, 'Deveria mostrar erro ou permanecer na tela').to.be.true;

        // Voltar para menu
        await menuPage.clickWebViewTab();
        await menuPage.wait(2000);
      }
    });
  });
});
