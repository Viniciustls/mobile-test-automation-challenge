const { autoScreenshotHook, cleanupOldScreenshots } = require('./helpers/screenshot-helper');

before(async function () {
  this.timeout(60000);

  console.log('\n🚀 Iniciando execução dos testes...\n');

  if (global.allure) {
    global.allure.addEnvironment('Platform', process.env.PLATFORM || 'Android');
    global.allure.addEnvironment('Device', process.env.DEVICE_NAME || 'Android_Emulator');
  }
});

beforeEach(function () {
  console.log(`\n▶️ Executando: ${this.currentTest.title}`);
});

afterEach(async function (test) {
  await autoScreenshotHook(test);

  if (test.state === 'passed') {
    console.log(`✅ PASSOU: ${test.title}`);
  }

  if (test.state === 'failed') {
    console.log(`❌ FALHOU: ${test.title}`);
  }
});

after(async function () {
  cleanupOldScreenshots(50);

  console.log('\n🏁 Execução dos testes finalizada.\n');
});