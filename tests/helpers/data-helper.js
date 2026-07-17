/**
 * Helper para Data-Driven Testing
 * Facilita carregar e usar dados do JSON nos testes
 */

const fs = require('fs');
const path = require('path');

// ===================================
// Carregar Dados
// ===================================

/**
 * Carrega dados de teste do arquivo JSON
 * @param {string} dataFile - Nome do arquivo (sem extensão)
 * @returns {object} - Objeto com dados
 */
const loadData = (dataFile = 'test-data') => {
  try {
    const dataPath = path.join(__dirname, '..', 'data', `${dataFile}.json`);
    const rawData = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Erro ao carregar dados do arquivo ${dataFile}:`, error);
    return {};
  }
};

/**
 * Salva dados em arquivo JSON
 * @param {string} dataFile - Nome do arquivo (sem extensão)
 * @param {object} data - Dados para salvar
 */
const saveData = (dataFile, data) => {
  try {
    const dataPath = path.join(__dirname, '..', 'data', `${dataFile}.json`);
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(dataPath, jsonData, 'utf8');
  } catch (error) {
    console.error(`Erro ao salvar dados no arquivo ${dataFile}:`, error);
  }
};

// ===================================
// Dados Específicos
// ===================================

/**
 * Obtém dados de teste de login
 * @returns {Array<object>} - Array com cenários de login
 */
const getLoginData = () => {
  const data = loadData();
  return data.login || [];
};

/**
 * Obtém dados de teste de cadastro
 * @returns {Array<object>} - Array com cenários de cadastro
 */
const getCadastroData = () => {
  const data = loadData();
  return data.cadastro || [];
};

/**
 * Obtém dados de teste de formulário
 * @returns {Array<object>} - Array com cenários de formulário
 */
const getFormData = () => {
  const data = loadData();
  return data.formulario || [];
};

/**
 * Obtém dados de teste de navegação
 * @returns {Array<object>} - Array com cenários de navegação
 */
const getNavigationData = () => {
  const data = loadData();
  return data.navegacao || [];
};

/**
 * Obtém dados de teste de mensagens de erro
 * @returns {Array<object>} - Array com cenários de erro
 */
const getErrorMessagesData = () => {
  const data = loadData();
  return data.mensagens_erro || [];
};

// ===================================
// Filtros e Buscas
// ===================================

/**
 * Filtra cenários por tag/categoria
 * @param {Array<object>} scenarios - Array de cenários
 * @param {string} tag - Tag para filtrar
 * @returns {Array<object>} - Cenários filtrados
 */
const filterByTag = (scenarios, tag) => {
  return scenarios.filter(scenario =>
    scenario.cenario.includes(tag) || scenario.descricao.includes(tag)
  );
};

/**
 * Busca cenário específico por nome
 * @param {Array<object>} scenarios - Array de cenários
 * @param {string} name - Nome do cenário
 * @returns {object|null} - Cenário encontrado ou null
 */
const findScenarioByName = (scenarios, name) => {
  return scenarios.find(scenario => scenario.cenario === name) || null;
};

/**
 * Filtra cenários que devem resultar em sucesso
 * @param {Array<object>} scenarios - Array de cenários
 * @returns {Array<object>} - Cenários de sucesso
 */
const getSuccessScenarios = (scenarios) => {
  return scenarios.filter(scenario => scenario.esperado.sucesso === true);
};

/**
 * Filtra cenários que devem resultar em falha
 * @param {Array<object>} scenarios - Array de cenários
 * @returns {Array<object>} - Cenários de falha
 */
const getFailureScenarios = (scenarios) => {
  return scenarios.filter(scenario => scenario.esperado.sucesso === false);
};

// ===================================
// Helper para Mocha
// ===================================

/**
 * Gera testes dinâmicos baseados em dados
 * @param {string} describeTitle - Título do describe
 * @param {Array<object>} scenarios - Array de cenários
 * @param {Function} testFn - Função de teste (recebe scenario como parâmetro)
 */
const generateTests = (describeTitle, scenarios, testFn) => {
  describe(describeTitle, function () {
    scenarios.forEach(scenario => {
      const testTitle = scenario.descricao || scenario.cenario;

      it(testTitle, async function () {
        await testFn(scenario);
      });
    });
  });
};

// ===================================
// Validacao de Dados
// ===================================

/**
 * Valida se um cenário tem todos os campos obrigatórios
 * @param {object} scenario - Cenário para validar
 * @param {Array<string>} requiredFields - Campos obrigatórios
 * @returns {boolean} - True se válido
 */
const validateScenario = (scenario, requiredFields) => {
  return requiredFields.every(field => {
    return field in scenario && scenario[field] !== undefined && scenario[field] !== null;
  });
};

/**
 * Valida se há cenários duplicados
 * @param {Array<object>} scenarios - Array de cenários
 * @returns {Array<object>} - Cenários duplicados
 */
const findDuplicateScenarios = (scenarios) => {
  const names = scenarios.map(s => s.cenario);
  const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
  return scenarios.filter(s => duplicates.includes(s.cenario));
};

// ===================================
// Estatísticas
// ===================================

/**
 * Retorna estatísticas dos dados de teste
 * @param {string} category - Categoria (login, cadastro, etc)
 * @returns {object} - Estatísticas
 */
const getDataStats = (category) => {
  const data = loadData();
  const scenarios = data[category] || [];

  return {
    total: scenarios.length,
    success: scenarios.filter(s => s.esperado?.sucesso === true).length,
    failure: scenarios.filter(s => s.esperado?.sucesso === false).length,
    scenarios: scenarios.map(s => s.cenario),
  };
};

// ===================================
// Export/Import
// ===================================

/**
 * Exporta cenários para CSV
 * @param {Array<object>} scenarios - Array de cenários
 * @param {string} filename - Nome do arquivo CSV
 */
const exportToCSV = (scenarios, filename) => {
  // Flatten scenario object
  const flatten = (obj, prefix = '') => {
    return Object.keys(obj).reduce((acc, key) => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        return { ...acc, ...flatten(obj[key], newKey) };
      }
      return { ...acc, [newKey]: obj[key] };
    }, {});
  };

  const flattened = scenarios.map(s => flatten(s));
  const fields = new Set();
  flattened.forEach(obj => Object.keys(obj).forEach(k => fields.add(k)));

  const csv = [
    Array.from(fields).join(','),
    ...flattened.map(obj =>
      Array.from(fields).map(field => obj[field] || '').join(',')
    )
  ].join('\n');

  fs.writeFileSync(filename, csv, 'utf8');
};

// ===================================
// Mock Data Generators
// ===================================

/**
 * Gera email aleatório
 * @param {string} domain - Domínio (opcional)
 * @returns {string}
 */
const generateEmail = (domain = 'example.com') => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `test.${timestamp}.${random}@${domain}`;
};

/**
 * Gera telefone aleatório
 * @returns {string}
 */
const generatePhone = () => {
  return `11${9 + Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;
};

/**
 * Gera CEP aleatório
 * @returns {string}
 */
const generateCEP = () => {
  return Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
};

// ===================================
// Exports
// ===================================
module.exports = {
  // Carregar
  loadData,
  saveData,

  // Dados específicos
  getLoginData,
  getCadastroData,
  getFormData,
  getNavigationData,
  getErrorMessagesData,

  // Filtros
  filterByTag,
  findScenarioByName,
  getSuccessScenarios,
  getFailureScenarios,

  // Mocha helper
  generateTests,

  // Validação
  validateScenario,
  findDuplicateScenarios,

  // Estatísticas
  getDataStats,

  // Export/Import
  exportToCSV,

  // Generators
  generateEmail,
  generatePhone,
  generateCEP,
};
