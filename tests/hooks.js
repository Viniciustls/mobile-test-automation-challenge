const { autoScreenshotHook } = require('./helpers/screenshot-helper');
const { logColor, COLORS } = require('./helpers/constants');

before(async function () {
  // CUIDADO: Não acessar driver aqui - sessão ainda não existe!
  // A sessão só será criada pelo WebdriverIO antes do primeiro teste

  logColor('\n═══════════════════════════════════════════════════════════════', COLORS.CYAN);
  logColor(`🚀 INICIANDO SUITE DE TESTES`, COLORS.CYAN);
  logColor(`⏰ Started: ${new Date().toLocaleString()}`, COLORS.CYAN);
  logColor(`═══════════════════════════════════════════════════════════════\n`, COLORS.CYAN);

  // Aumentar timeout para setup inicial
  this.timeout(60000);
});

beforeEach(async function () {
  // Este hook executa ANTES de CADA teste
  // A sessão do driver JÁ existe neste ponto
  const testTitle = this.currentTest.title;

  logColor(`\n▶️  Iniciando: ${testTitle}`, COLORS.BLUE);

  // Reset do app state entre testes
  // Isso garante que cada teste começa do estado inicial
  try {
    // Se disponível, usar o comando reset do app
    // Nota: Isso depende da configuração 'noReset' nas capabilities
    // Se noReset: false, o Appium já limpa o app automaticamente

    // CUIDADO: Não acessar driver.capabilities aqui - pode causar problemas
    // Apenas executar ações necessárias
  } catch (error) {
    console.error('Erro ao resetar app state:', error);
  }
});

afterEach(async function (test) {
  // Este hook executa APÓS CADA teste
  const testTitle = test.title;
  const testState = test.state;

  // Capturar screenshot automaticamente em caso de falha
  await autoScreenshotHook(test);

  // Log do resultado
  if (testState === 'passed') {
    logColor(`✅ PASSOU: ${testTitle}`, COLORS.GREEN);
  } else if (testState === 'failed') {
    logColor(`❌ FALHOU: ${testTitle}`, COLORS.RED);
  } else if (testState === 'pending') {
    logColor(`⏭️  PULADO: ${testTitle}`, COLORS.YELLOW);
  } else {
    logColor(`❓ DESCONHECIDO: ${testTitle} (${testState})`, COLORS.MAGENTA);
  }
});

after(async function () {
  // Este hook executa APÓS TODOS os testes da suite
  logColor('\n═══════════════════════════════════════════════════════════════', COLORS.CYAN);
  logColor(`🏁 FINALIZANDO SUITE DE TESTES`, COLORS.CYAN);
  logColor(`⏰ Finished: ${new Date().toLocaleString()}`, COLORS.CYAN);
  logColor(`═══════════════════════════════════════════════════════════════\n`, COLORS.CYAN);

  // Limpeza final
  // Fechar conexões, limpar recursos, etc
  // Nota: O WebdriverIO já encerra a sessão automaticamente
});


beforeSuite(async function () {
  // Executa antes de cada suite de testes (describe block)
  // Útil para setup específico da suite

  // CUIDADO: Driver pode não estar disponível ainda
});

afterSuite(async function () {
  // Executa após cada suite de testes (describe block)
  // Útil para cleanup específico da suite
});


process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Não throw para permitir que o teste falhe normalmente
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  // Não throw para permitir que o teste falhe normalmente
});

if (typeof global !== 'undefined' && global.allure) {
  global.allure.addEnvironment('Platform', process.env.PLATFORM || 'unknown');
  global.allure.addEnvironment('Device', process.env.DEVICE_NAME || 'unknown');
  global.allure.addEnvironment('App Version', process.env.APP_VERSION || 'unknown');
}

const DEFAULT_TEST_TIMEOUT = 60000; // 60 segundos

beforeEach(function () {
  // Aplica timeout padrão se não foi definido
  if (this.timeout() === 20000) { // Mocha default
    this.timeout(DEFAULT_TEST_TIMEOUT);
  }
});

const DEBUG_MODE = process.env.DEBUG === 'true';

if (DEBUG_MODE) {
  logColor('🐛 DEBUG MODE habilitado', COLORS.YELLOW);

  // Em debug mode, não fecha o app após falhas
  after(async function () {
    logColor('🔍 Sessão mantida aberta para debug', COLORS.YELLOW);
    logColor('Pressione Ctrl+C para encerrar', COLORS.YELLOW);
  });
}

const RETRY_ON_FAILURE = process.env.RETRY === 'true';
const MAX_RETRIES = parseInt(process.env.MAX_RETRIES || '2');

if (RETRY_ON_FAILURE) {
  logColor(`🔄 Retries habilitado (máx: ${MAX_RETRIES})`, COLORS.YELLOW);

  // Aplicar retries aos testes
  this.retries(MAX_RETRIES);
}

afterEach(async function (test) {
  const duration = test.duration;
  const testTitle = test.title;

  // Alerta se teste ficou muito lento
  if (duration > 30000) { // 30 segundos
    logColor(`⚠️  Teste lento detectado: ${testTitle} (${Math.round(duration / 1000)}s)`, COLORS.YELLOW);
  }
});

after(async function () {
  // Limpar screenshots antigos (manter apenas últimos 50)
  try {
    const { cleanupOldScreenshots } = require('./helpers/screenshot-helper');
    cleanupOldScreenshots(50);
  } catch (error) {
    console.error('Erro ao limpar screenshots antigos:', error);
  }
});
