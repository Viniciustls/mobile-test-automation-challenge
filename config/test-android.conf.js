/**
 * Configuração Android simplificada para teste
 */

const { join } = require('path');

exports.config = {
  // ===================================
  // Framework
  // ===================================
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },

  // ===================================
  // Specs
  // ===================================
  specs: [
    './tests/specs/simple-demo.spec.js',
  ],

  // ===================================
  // Reporters
  // ===================================
  reporters: ['spec'],

  // ===================================
  // Services
  // ===================================
  services: [
    ['appium', {
      args: {
        basePath: '/wd/hub',
        port: 4723,
      },
    }],
  ],

  // ===================================
  // Capabilities
  // ===================================
  capabilities: [{
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Android_Emulator',
    'appium:app': join(process.cwd(), 'apps', 'android', 'Android-NativeDemoApp.apk'),
  }],

  // ===================================
  //Timeouts
  // ===================================
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,

  // ===================================
  // Logs
  // ===================================
  logLevel: 'info',
  logDir: 'logs',
};
