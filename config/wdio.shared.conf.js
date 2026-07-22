exports.config = {

  framework: 'mocha',

  mochaOpts: {
    ui: 'bdd',
    timeout: 90000,
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
      },
    ],
  ],

  waitforTimeout: 20000,

  waitforInterval: 500,

  logLevel: 'info',

  connectionRetryTimeout: 90000,

  connectionRetryCount: 3,

  watch: false,
};