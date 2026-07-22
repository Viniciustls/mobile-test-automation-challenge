const { join } = require('path');
const sharedConfig = require('./wdio.shared.conf');

const APP_PATH =
  process.env.IOS_APP_PATH ||
  join(process.cwd(), 'apps', 'ios', 'NativeDemoApp.app');

exports.config = {
  ...sharedConfig.config,

  maxInstances: 1,

  specs: [
    join(process.cwd(), 'tests/specs/cadastro.spec.js'),
    join(process.cwd(), 'tests/specs/login.spec.js'),
    join(process.cwd(), 'tests/specs/formulario.spec.js'),
    join(process.cwd(), 'tests/specs/navegacao.spec.js'),
  ],

  capabilities: [
    {
      platformName: 'iOS',

      'appium:automationName': 'XCUITest',

      'appium:deviceName': 'iPhone 14',

      'appium:platformVersion': '16.2',

      'appium:app': APP_PATH,

      'appium:autoAcceptAlerts': true,

      'appium:noReset': false,

      'appium:fullReset': false,

      'appium:orientation': 'PORTRAIT',

      'appium:newCommandTimeout': 240,

      'appium:wdaLaunchTimeout': 120000,

      'appium:wdaConnectionTimeout': 240000,

      'appium:maxTypingFrequency': 60,

      'appium:clearSystemFiles': true,

      'appium:resetOnSuspend': false,
    },
  ],

  services: [
    [
      'appium',
      {
        args: {
          port: 4723,
          logLevel: 'info',
        },
      },
    ],
  ],

  outputDir: join(process.cwd(), 'logs', 'ios'),

  waitForActionInterval: 500,

  connectionRetryTimeout: 90000,

  connectionRetryCount: 3,
};