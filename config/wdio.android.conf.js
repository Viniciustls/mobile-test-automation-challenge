const { join } = require('path');

const APP_PATH =
  process.env.ANDROID_APP_PATH ||
  join(
    process.cwd(),
    'apps',
    'android',
    'android.wdio.native.app.v2.2.0.apk'
  );

exports.config = {
  maxInstances: 1,

  framework: 'mocha',

  mochaOpts: {
    ui: 'bdd',
    timeout: 90000,
  },

  specs: [
    join(process.cwd(), 'tests/specs/cadastro.spec.js'),
    join(process.cwd(), 'tests/specs/login.spec.js'),
    join(process.cwd(), 'tests/specs/formulario.spec.js'),
    join(process.cwd(), 'tests/specs/navegacao.spec.js'),
  ],

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

  capabilities: [
    {
      platformName: 'Android',

      'appium:automationName': 'UiAutomator2',

      'appium:deviceName': 'Android_Emulator',

      'appium:app': APP_PATH,

      'appium:autoGrantPermissions': true,

      'appium:noReset': false,

      'appium:fullReset': false,

      'appium:orientation': 'PORTRAIT',

      'appium:newCommandTimeout': 240,

      'appium:unicodeKeyboard': true,

      'appium:resetKeyboard': true,

      'appium:uiautomator2ServerInstallTimeout': 120000,

      'appium:ignoreUnimportantViews': true,

      'appium:disableWindowAnimation': true,
    },
  ],

  hostname: 'localhost',
  port: 4723,
  path: '/',
  protocol: 'http',

  outputDir: join(process.cwd(), 'logs', 'android'),
  logLevel: 'info',

  waitforTimeout: 20000,

  connectionRetryTimeout: 90000,

  connectionRetryCount: 3,
};