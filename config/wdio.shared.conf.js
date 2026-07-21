exports.config = {
  framework: 'mocha',

  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
    retries: 0,
  },

  reporters: [
    [
      'spec',
      {
        displaySpecDuration: true,
        displaySuiteNumber: true,
      },
    ],
    [
      'allure',
      {
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: false,
        disableWebdriverScreenshotsReporting: false,
        useCucumberStepReporter: false,
      },
    ],
  ],

  services: [],

  before: async function () {
    console.log('\n🚀 Iniciando execução dos testes...');
  },

  after: async function () {
    console.log('\n✅ Execução dos testes finalizada.\n');
  },

  waitforTimeout: 20000,
  waitforInterval: 500,

  logLevel: 'info',

  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,

  watch: false,
};