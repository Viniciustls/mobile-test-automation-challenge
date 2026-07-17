/**
 * Configuração WebdriverIO para iOS
 * Extende a configuração compartilhada e adiciona especificidades iOS
 */

const { join } = require('path');

// Importar configuração compartilhada
const sharedConfig = require('./wdio.shared.conf');

// Caminho para o .app do native-demo-app (iOS Simulator)
const APP_PATH = process.env.IOS_APP_PATH ||
  join(process.cwd(), 'apps', 'ios', 'NativeDemoApp.app');

exports.config = {
  ...sharedConfig.config,

  // ===================================
  // Capabilities - iOS
  // ===================================
  capabilities: [{
    platformName: 'iOS',

    // 'automationName' para iOS
    automationName: 'XCUITest',

    // Device/App
    deviceName: 'iPhone 14',            // Modelo do simulator
    platformVersion: '16.2',            // Versão iOS
    app: APP_PATH,

    // O Appium instalará o app automaticamente se não estiver instalado
    autoAcceptAlerts: true,             // Aceita alerts automaticamente
    autoDismissAlerts: false,
    noReset: false,                     // Reset do app entre testes
    fullReset: false,                    // Não reinstala o app a cada teste

    // Orientation
    orientation: 'PORTRAIT',

    // Configurações de session
    newCommandTimeout: 240,              // Segundos sem comandos antes de encerrar sessão

    // XCUITest specific
    wdaLaunchTimeout: 120000,            // Timeout para launch do WDA
    wdaConnectionTimeout: 240000,       // Timeout para conexão WDA

    // Performance
    maxTypingFrequency: 60,              // Frequência máxima de digitação
    isElementEnabledThreshold: 1000,    // Threshold para check de enabled state

    // Simulator specific
    simulatorStartupTimeout: 120000,     // Timeout para boot do simulator

    // Outras opções úteis
    clearSystemFiles: true,             // Limpa arquivos temporários
    resetOnSuspend: false,              // Não reseta quando app é suspenso
  }],

  // ===================================
  // Serviços iOS-specific
  // ===================================
  services: [
    ['appium', {
      // Comandos do Appium para iOS
      args: {
        // Base path do servidor Appium
        basePath: '/wd/hub',

        // Porta (padrão 4723)
        port: 4723,

        // Log level do Appium
        logLevel: 'info',
      },
    }],
  ],

  // ===================================
  // Paths e Output
  // ===================================
  outputDir: join(process.cwd(), 'logs', 'ios'),

  // ===================================
  // Configurações Específicas iOS
  // ===================================

  // Comportamento de waits
  waitForActionInterval: 500,

  // Timeout para iOS
  mochaOpts: {
    ...sharedConfig.config.mochaOpts,
    timeout: 90000,                     // 90s para iOS (simulator pode ser lento)
  },
};

/**
 * NOTAS SOBRE CONFIGURAÇÃO iOS:
 *
 * 1. APP_PATH:
 *    - O .app deve estar compilado para iOS Simulator
 *    - Set env var IOS_APP_PATH para usar app customizado
 *
 * 2. DEVICE_NAME:
 *    - 'iPhone 14' deve corresponder a um simulator disponível
 *    - Use `xcrun simctl list devices` para listar simulators disponíveis
 *
 * 3. PLATFORM_VERSION:
 *    - Deve corresponder a versão do iOS Simulator instalado
 *    - Pode ser ajustado via env var: PLATFORM_VERSION
 *
 * 4. AUTO_ACCEPT_ALERTS:
 *    - Aceita alerts do iOS automaticamente
 *    - Útil para permissões (location, notifications, etc)
 *
 * 5. WDA LAUNCH TIMEOUT:
 *    - WebDriverAgent (WDA) precisa ser compilado na primeira vez
 *    - Primeira execução pode levar vários minutos
 *    - Execuções subsequentes são muito mais rápidas
 *
 * 6. SIMULATOR STARTUP:
 *    - O simulator precisa estar instalado
 *    - Appium iniciará o simulator automaticamente se necessário
 */

/**
 * PRINCIPAIS DIFERENÇAS ANDROID vs iOS:
 *
 * | Aspecto | Android | iOS |
 * |---------|---------|-----|
 * | automationName | UiAutomator2 | XCUITest |
 * | Alert handling | autoGrantPermissions | autoAcceptAlerts |
 * | Element lookup | resource-id, xpath | name, label, xpath |
 * | Keyboard | unicodeKeyboard: true | nativo (padrão funciona) |
 * | Driver backend | Appium UiAutomator2 | Appium XCUITest |
 * | Performance | Geralmente mais lento | Geralmente mais rápido |
 * | Setup inicial | Mais simples | WDA precisa compilar (primeira vez) |
 */
