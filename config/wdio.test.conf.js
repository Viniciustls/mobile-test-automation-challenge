/**
 * Configuração simplificada para teste
 */

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
    '/home/vinicius/Documents/Projects/Desafios/mobile-test-automation-challenge/tests/specs/simple-demo.spec.js',
  ],

  // ===================================
  // Reporters
  // ===================================
  reporters: ['spec'],

  // ===================================
  // Services
  // ===================================
  services: [],

  // ===================================
  // Capabilities
  // ===================================
  capabilities: [{
    browserName: 'chrome',
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
