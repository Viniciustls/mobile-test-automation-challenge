/**
 * Configuração compartilhada do WebdriverIO
 * Esta configuração é herdada pelas configs específicas (Android/iOS)
 * seguindo o princípio DRY (Don't Repeat Yourself)
 */

exports.config = {
  // ===================================
  // Framework e Test Runner
  // ===================================
  framework: 'mocha',

  // Mocha configuration
  mochaOpts: {
    ui: 'bdd',              // Behavior Driven Development style
    timeout: 60000,         // 60 segundos timeout para cada teste
    retries: 0,             // Sem retries por padrão
  },

  // ===================================
  // Reporters
  // ===================================
  reporters: [
    // Console output (spec reporter)
    ['spec', {
      displaySpecDuration: true,
      displaySuiteNumber: true,
    }],

    // Allure Report (relatório HTML detalhado)
    ['allure', {
      outputDir: 'allure-results',
      disableWebdriverStepsReporting: false,
      disableWebdriverScreenshotsReporting: false,
      useCucumberStepReporter: false,
    }]
  ],

  // ===================================
  // Serviços
  // ===================================
  // Nota: serviços específicos (appium) são definidos nas configs específicas
  services: [],

  // ===================================
  // Hooks - Ciclo de vida dos testes
  // ===================================
  /**
   * Importar hooks globais
   * Hooks globais estão em tests/hooks.js
   * Isso inclui:
   * - Screenshot automático em falhas
   * - Setup/teardown
   * - Logging
   */
  before: async function () {
    // Hooks globais são carregados automaticamente pelo Mocha
    // Apenas logs adicionais podem ser colocados aqui
    console.log('\n🚀 Iniciando execução dos testes...');
  },

  /**
   * Executa após CADA teste
   * Nota: Hooks globais (afterEach) cuidam do screenshot automático
   */
  afterTest: async function (test, context, { error, result, duration, passed, retries }) {
    // Hooks globais já cuidam disso
    // Apenas log adicional se necessário
  },

  /**
   * Executa após TODOS os testes
   */
  after: async function () {
    console.log('\n✅ Execução dos testes finalizada.\n');
  },

  // ===================================
  // Configurações de Tempo
  // ===================================
  waitforTimeout: 20000,      // Timeout padrão para waits explícitos
  waitforInterval: 500,       // Intervalo de checagem em waits

  // ===================================
  // Logging
  // ===================================
  logLevel: 'info',           // 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent'
  logDir: 'logs',

  // ===================================
  // Outras Configurações
  // ===================================
  path: '/',                   // Caminho do servidor
  port: 4723,                  // Porta padrão do Appium (pode ser sobrescrito)

  // Gerenciamento de sessão
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,

  // ===================================
  // Paths
  // ===================================
  // Onde estão os arquivos de teste
  specs: [
    './tests/specs/login.spec.js',
    './tests/specs/cadastro.spec.js',
    './tests/specs/navegacao.spec.js',
    './tests/specs/formulario.spec.js',
  ],

  // ===================================
  // Logging
  // ===================================
  logLevel: 'info',           // 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent'
  logDir: 'logs',

  // ===================================
  // Outras Configurações
  // ===================================
  path: '/',                   // Caminho do servidor
  port: 4723,                  // Porta padrão do Appium (pode ser sobrescrito)

  // Gerenciamento de sessão
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,

  // ===================================
  // Capacidade de Watch Mode (opcional)
  // ===================================
  // Útil durante desenvolvimento, mas não em CI/CD
  watch: false,
};
