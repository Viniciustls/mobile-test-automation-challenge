/**
 * Constantes utilizadas nos testes
 * Centraliza strings, timeouts e valores reutilizáveis
 */

// ===================================
// Timeouts (em milissegundos)
// ===================================
exports.TIMEOUTS = {
  SHORT: 5000,      // 5 segundos
  MEDIUM: 10000,    // 10 segundos
  LONG: 30000,      // 30 segundos
  VERY_LONG: 60000, // 60 segundos
};

// ===================================
// Mensagens do App (baseado no native-demo-app)
// ===================================
exports.MESSAGES = {
  // Login
  LOGIN_SUCCESS: 'You are logged in',
  LOGIN_ERROR: 'Invalid username or password',
  LOGIN_EMPTY_FIELDS: 'Please enter all fields',

  // Cadastro
  REGISTER_SUCCESS: 'You have successfully registered',
  REGISTER_EMAIL_EXISTS: 'Email already exists',
  REGISTER_PASSWORD_MISMATCH: 'Passwords do not match',
  REGISTER_EMPTY_FIELDS: 'Please complete all fields',

  // Formulário
  FORM_SUBMIT_SUCCESS: 'Form submitted successfully',
  FORM_REQUIRED_FIELD: 'This field is required',
  FORM_INVALID_EMAIL: 'Please enter a valid email',

  // Navegação
  MENU_TITLE: 'WebDriverIO Demo App',
};

// ===================================
// Selectors comuns (xpath strategies)
// ===================================
exports.SELECTORS = {
  // Strategies
  BY_ID: 'id',
  BY_XPATH: 'xpath',
  BY_ACCESSIBILITY_ID: 'accessibility id',
  BY_CLASS: 'class name',
  BY_NAME: 'name',

  // Android-specific
  ANDROID_VIEW_TAG: 'android.view.View',
  ANDROID_TEXT_FIELD: 'android.widget.EditText',
  ANDROID_BUTTON: 'android.widget.Button',

  // iOS-specific
  IOS_TEXT_FIELD: 'XCUIElementTypeTextField',
  IOS_BUTTON: 'XCUIElementTypeButton',
};

// ===================================
// Dados de teste
// ===================================
exports.USUARIOS = {
  VALIDO: {
    email: 'teste@example.com',
    senha: '123456',
    nome: 'Test User',
  },
  INVALIDO: {
    email: 'invalido@email.com',
    senha: 'senha_errada',
  },
  NOVO: {
    email: 'novo.usuario@example.com',
    senha: 'nova123',
    confirmarSenha: 'nova123',
    nome: 'Novo Usuario',
  },
};

// ===================================
// Configurações de ambiente
// ===================================
exports.PLATFORM = {
  ANDROID: 'Android',
  IOS: 'iOS',
};

// ===================================
// Nomes de arquivos/pastas
// ===================================
exports.PATHS = {
  SCREENSHOTS: 'screenshots',
  ALLURE_RESULTS: 'allure-results',
  LOGS: 'logs',
};

// ===================================
// Status de teste
// ===================================
exports.TEST_STATUS = {
  PASSED: 'passed',
  FAILED: 'failed',
  SKIPPED: 'skipped',
};

// ===================================
// Regex patterns úteis
// ===================================
exports.PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
};

// ===================================
// Cores para console output
// ===================================
exports.COLORS = {
  RESET: '\x1b[0m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
};

// ===================================
// Helper para colored console output
// =================================//
exports.logColor = (message, color = exports.COLORS.RESET) => {
  console.log(`${color}${message}${exports.COLORS.RESET}`);
};
