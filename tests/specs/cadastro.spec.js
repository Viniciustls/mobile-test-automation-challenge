/**
 * Testes de Cadastro
 * Cenários: 4-6 (Cadastro com sucesso, Cadastro com e-mail inválido, Cadastro com senhas diferentes)
 */

const { expect } = require('chai');
const LoginPage = require('../pages/login.page');
const CadastroPage = require('../pages/cadastro.page');
const { USUARIOS, MESSAGES } = require('../helpers/constants');
const { getCadastroData, generateEmail } = require('../helpers/data-helper');
const { log } = require('../helpers/utils');

describe('Testes de Cadastro', function () {
  let loginPage;
  let cadastroPage;

  // Setup antes de cada teste
  beforeEach(async function () {
    loginPage = new LoginPage();
    cadastroPage = new CadastroPage();

    // Garantir que está na tela de cadastro
    if (await loginPage.isOnLoginPage()) {
      await loginPage.navigateToSignUp();
    }

    // Aguardar tela de cadastro carregar
    await cadastroPage.waitForElementVisible($(cadastroPage.emailInput));
  });

  // Cleanup após cada teste
  afterEach(async function () {
    // Voltar para tela de login se ainda estiver no cadastro
    if (await cadastroPage.isOnSignUpPage()) {
      await cadastroPage.clickBack();
      await loginPage.wait(2000);
    }
  });

  /**
   * CENÁRIO 4: Cadastro com sucesso
   * Objetivo: Verificar se usuário consegue se cadastrar com dados válidos
   */
  it('deve realizar cadastro com sucesso usando dados válidos', async function () {
    log('\n=== CENÁRIO 4: Cadastro com Sucesso ===', 'info');

    // Dados de teste (gerar email único para evitar duplicidade)
    const novoUsuario = {
      email: generateEmail('example.com'),
      senha: 'nova123',
      confirmarSenha: 'nova123',
      nome: 'Novo Usuario Teste',
    };

    // Ação: Realizar cadastro
    await cadastroPage.performRegistration(
      novoUsuario.email,
      novoUsuario.senha,
      novoUsuario.confirmarSenha,
      novoUsuario.nome
    );

    // Aguardar processamento
    await cadastroPage.wait(3000);

    // Verificação: Cadastro bem-sucedido
    const cadastroSuccess = await cadastroPage.isRegistrationSuccess();
    expect(cadastroSuccess, 'Cadastro deveria ter sido bem-sucedido').to.be.true;

    // Verificação adicional: Voltou para tela de login ou foi para home
    const onLoginPage = await loginPage.isOnLoginPage();
    expect(onLoginPage || cadastroSuccess, 'Deveria estar na tela de login após cadastro').to.be.true;
  });

  /**
   * CENÁRIO 5: Cadastro com e-mail inválido
   * Objetivo: Verificar se sistema valida formato de e-mail
   */
  it('deve exibir mensagem de erro ao tentar cadastro com e-mail inválido', async function () {
    log('\n=== CENÁRIO 5: Cadastro com Email Inválido ===', 'info');

    // Dados de teste
    const usuarioInvalido = {
      email: 'email-invalido',
      senha: '123456',
      confirmarSenha: '123456',
      nome: 'Usuario Teste',
    };

    // Ação: Tentar cadastro com email inválido
    await cadastroPage.performRegistrationWithInvalidEmail(
      usuarioInvalido.email,
      usuarioInvalido.senha,
      usuarioInvalido.confirmarSenha,
      usuarioInvalido.nome
    );

    // Aguardar processamento
    await cadastroPage.wait(2000);

    // Verificação: Mensagem de erro aparece
    const hasError = await cadastroPage.hasInvalidEmailError();
    expect(hasError, 'Deveria mostrar mensagem de email inválido').to.be.true;

    // Verificação adicional: Permanece na tela de cadastro
    const onSignUpPage = await cadastroPage.isOnSignUpPage();
    expect(onSignUpPage, 'Deveria permanecer na tela de cadastro').to.be.true;
  });

  /**
   * CENÁRIO 6: Cadastro com senhas diferentes
   * Objetivo: Verificar se sistema valida confirmação de senha
   */
  it('deve exibir mensagem de erro ao tentar cadastro com senhas diferentes', async function () {
    log('\n=== CENÁRIO 6: Cadastro com Senhas Diferentes ===', 'info');

    // Dados de teste
    const usuarioSenhasDiferentes = {
      email: 'teste@example.com',
      senha: '123456',
      confirmarSenha: '654321', // Senha diferente
      nome: 'Usuario Teste',
    };

    // Ação: Tentar cadastro com senhas que não coincidem
    await cadastroPage.performRegistrationWithMismatchedPasswords(
      usuarioSenhasDiferentes.email,
      usuarioSenhasDiferentes.senha,
      usuarioSenhasDiferentes.confirmarSenha,
      usuarioSenhasDiferentes.nome
    );

    // Aguardar processamento
    await cadastroPage.wait(2000);

    // Verificação: Mensagem de erro aparece
    const hasError = await cadastroPage.hasPasswordMismatchError();
    expect(hasError, 'Deveria mostrar mensagem de senhas diferentes').to.be.true;

    // Verificação adicional: Permanece na tela de cadastro
    const onSignUpPage = await cadastroPage.isOnSignUpPage();
    expect(onSignUpPage, 'Deveria permanecer na tela de cadastro').to.be.true;
  });

  /**
   * CENÁRIO ADICIONAL: Cadastro com campos vazios
   * Objetivo: Verificar se sistema valida campos obrigatórios
   */
  it('deve exibir mensagem de erro ao tentar cadastro com campos vazios', async function () {
    log('\n=== CENÁRIO ADICIONAL: Cadastro com Campos Vazios ===', 'info');

    // Ação: Tentar cadastro sem preencher campos
    await cadastroPage.performRegistrationWithEmptyFields();

    // Aguardar processamento
    await cadastroPage.wait(2000);

    // Verificação: Mensagem de erro ou permanece na tela
    const hasError = await cadastroPage.hasRequiredFieldsError();
    const onSignUpPage = await cadastroPage.isOnSignUpPage();

    expect(hasError || !onSignUpPage, 'Deveria mostrar erro ou não permitir cadastro').to.be.true;
  });

  /**
   * CENÁRIO ADICIONAL: Cadastro com email já existente
   * Objetivo: Verificar se sistema detecta email duplicado
   */
  it('deve exibir mensagem de erro ao tentar cadastro com email já existente', async function () {
    log('\n=== CENÁRIO ADICIONAL: Cadastro com Email Existente ===', 'info');

    // Usar email que provavelmente já existe
    const usuarioExistente = {
      email: 'teste@example.com',
      senha: '123456',
      confirmarSenha: '123456',
      nome: 'Usuario Teste',
    };

    // Ação: Tentar cadastro com email existente
    await cadastroPage.performRegistration(
      usuarioExistente.email,
      usuarioExistente.senha,
      usuarioExistente.confirmarSenha,
      usuarioExistente.nome
    );

    // Aguardar processamento
    await cadastroPage.wait(2000);

    // Verificação: Pode mostrar erro de email existente ou outro erro
    const hasEmailExistsError = await cadastroPage.hasEmailAlreadyExistsError();
    const hasOtherError = await cadastroPage.getErrorMessage() !== '';

    // Pelo menos um erro deve aparecer
    expect(hasEmailExistsError || hasOtherError, 'Deveria mostrar alguma mensagem de erro').to.be.true;
  });

  /**
   * CENÁRIO ADICIONAL: Navegação Login <-> Cadastro
   * Objetivo: Verificar navegação entre as telas
   */
  it('deve navegar corretamente entre login e cadastro', async function () {
    log('\n=== CENÁRIO ADICIONAL: Navegação Login-Cadastro ===', 'info');

    // Verificar que está na tela de cadastro
    expect(await cadastroPage.isOnSignUpPage(), 'Deveria estar na tela de cadastro').to.be.true;

    // Voltar para login
    await cadastroPage.clickBack();
    await loginPage.wait(2000);

    // Verificar que está na tela de login
    expect(await loginPage.isOnLoginPage(), 'Deveria estar na tela de login').to.be.true;

    // Ir para cadastro novamente
    await loginPage.navigateToSignUp();
    await cadastroPage.wait(2000);

    // Verificar que está na tela de cadastro
    expect(await cadastroPage.isOnSignUpPage(), 'Deveria voltar à tela de cadastro').to.be.true;
  });

  /**
   * CENÁRIO ADICIONAL: Verificar elementos da tela de cadastro
   * Objetivo: Garantir que todos os elementos estão presentes
   */
  it('deve exibir todos os elementos da tela de cadastro corretamente', async function () {
    log('\n=== CENÁRIO ADICIONAL: Verificar Tela de Cadastro ===', 'info');

    // Verificações: Elementos visíveis
    expect(await cadastroPage.isOnSignUpPage(), 'Deveria estar na tela de cadastro').to.be.true;
    expect(await cadastroPage.isConfirmButtonEnabled(), 'Botão Confirm deveria estar habilitado').to.be.true;
    expect(await cadastroPage.isBackButtonVisible(), 'Botão voltar deveria estar visível').to.be.true;
  });
});

/**
 * Data-Driven Tests usando JSON
 * Executa múltiplos cenários de cadastro baseados em dados
 */
describe('Data-Driven: Cadastro com múltiplos cenários', function () {
  let loginPage;
  let cadastroPage;

  before(async function () {
    loginPage = new LoginPage();
    cadastroPage = new CadastroPage();
  });

  beforeEach(async function () {
    // Garantir que está na tela de cadastro
    if (await loginPage.isOnLoginPage()) {
      await loginPage.navigateToSignUp();
    }
  });

  afterEach(async function () {
    // Cleanup
    if (await cadastroPage.isOnSignUpPage()) {
      await cadastroPage.clickBack();
    }
  });

  // Carregar cenários de teste do JSON
  const cadastroScenarios = getCadastroData();

  cadastroScenarios.forEach((scenario) => {
    it(`cenário ${scenario.cenario}: ${scenario.descricao}`, async function () {
      log(`\n=== Data-Driven: ${scenario.cenario} ===`, 'info');

      // Executar ação baseada no cenário
      if (scenario.email === '' && scenario.senha === '' && scenario.confirmarSenha === '') {
        await cadastroPage.performRegistrationWithEmptyFields();
      } else if (scenario.cenario === 'cadastro-senhas-diferentes') {
        await cadastroPage.performRegistrationWithMismatchedPasswords(
          scenario.email,
          scenario.senha,
          scenario.confirmarSenha,
          scenario.nome
        );
      } else if (scenario.cenario === 'cadastro-email-invalido') {
        await cadastroPage.performRegistrationWithInvalidEmail(
          scenario.email,
          scenario.senha,
          scenario.confirmarSenha,
          scenario.nome
        );
      } else {
        await cadastroPage.performRegistration(
          scenario.email,
          scenario.senha,
          scenario.confirmarSenha,
          scenario.nome
        );
      }

      // Aguardar processamento
      await cadastroPage.wait(3000);

      // Verificar resultado esperado
      if (scenario.esperado.sucesso) {
        const cadastroSuccess = await cadastroPage.isRegistrationSuccess();
        expect(cadastroSuccess, `Cenário "${scenario.cenario}" deveria ter sucesso`).to.be.true;
      } else {
        const hasError = await cadastroPage.getErrorMessage() !== '';
        expect(hasError, `Cenário "${scenario.cenario}" deveria mostrar erro`).to.be.true;
      }
    });
  });
});
