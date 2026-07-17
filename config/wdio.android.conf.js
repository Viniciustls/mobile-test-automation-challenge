/**
 * Configuração WebdriverIO para Android
 * Extende a configuração compartilhada e adiciona especificidades Android
 */

const { join } = require('path');

const sharedConfig = require('./wdio.shared.conf');

const APP_PATH = process.env.ANDROID_APP_PATH ||
  join(process.cwd(), 'apps', 'android', 'Android-NativeDemoApp-0.4.0.apk');


exports.config = {
  ...sharedConfig.config,


  // ===================================
  // Specs
  // ===================================
  specs: [
    join(process.cwd(), 'tests/specs/smoke.spec.js'),
  ],


  // ===================================
  // Capabilities Android
  // ===================================
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
    }
  ],


  // ===================================
  // Appium Service
  // ===================================
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


  // ===================================
  // Logs
  // ===================================
  outputDir: join(
    process.cwd(),
    'logs',
    'android'
  ),


  // ===================================
  // Android timeouts
  // ===================================
  waitforTimeout: 20000,

  connectionRetryTimeout: 90000,

  connectionRetryCount: 3,


  // ===================================
  // Mocha
  // ===================================
  mochaOpts: {
    ...sharedConfig.config.mochaOpts,
    timeout: 90000,
  },
};