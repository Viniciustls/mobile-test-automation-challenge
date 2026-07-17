# Arquitetura do Projeto de Automação Mobile

## 📐 Estrutura Geral

```
mobile-test-automation-challenge/
├── tests/
│   ├── specs/          # Arquivos de teste (specs)
│   ├── pages/           # Page Objects (POM)
│   ├── data/            # Data-driven testing (JSON)
│   └── helpers/         # Funções auxiliares reutilizáveis
│
├── config/
│   ├── wdio.shared.conf.js    # Configuração compartilhada
│   ├── wdio.android.conf.js    # Configuração específica Android
│   └── wdio.ios.conf.js        # Configuração específica iOS
│
├── screenshots/          # Evidências de falhas
├── allure-results/       # Resultados Allure
├── allure-report/        # Relatório HTML
├── logs/                 # Logs de execução
│
├── .gitignore
├── package.json
└── README.md
```

## 🎯 Padrão Page Object Model (POM)

### Por que usar POM?
- **Separação de responsabilidades**: Lógica de teste separada da interação com UI
- **Reutilização**: Mesmos page objects podem ser usados em múltiplos testes
- **Manutenção**: Mudanças na UI afetam apenas um lugar (page object)
- **Legibilidade**: Testes ficam mais limpos e auto-explicativos

### Estrutura dos Page Objects

```
tests/pages/
├── base.page.js          # Page Object base com métodos comuns
├── login.page.js         # Page Object da tela de Login
├── cadastro.page.js      # Page Object da tela de Cadastro
├── menu.page.js          # Page Object do menu
├── forms.page.js         # Page Object de formulários
└── ...
```

**Princípios:**
- Cada tela/feature tem seu próprio Page Object
- Page Objects não possuem asserts (apenas retornam valores)
- Testes fazem os asserts usando Chai
- Page Objects herdam de BasePage para evitar duplicação

## 🧪 Especificações de Teste (Specs)

```
tests/specs/
├── login.spec.js         # Testes de login
├── cadastro.spec.js      # Testes de cadastro
├── navegacao.spec.js     # Testes de navegação
├── formulario.spec.js    # Testes de formulários
└── ...
```

**Organização:**
- Cada arquivo de spec contém testes relacionados
- Usa `describe` para agrupar testes relacionados
- Usa `it` para cada cenário de teste individual
- Nome dos testes devem ser descritivos: "deve fazer X quando Y"

## 🔧 Configuração Multi-Plataforma

### Abordagem: Configuração Compartilhada + Específica

**wdio.shared.conf.js:**
- Configurações comuns a ambos platforms
- Serviços
- Reporters
- Framework (Mocha)
- Timeout padrão

**wdio.android.conf.js:**
- Extende o shared
- Capabilities Android
- App path para Android
- Serviços Android-only

**wdio.ios.conf.js:**
- Extende o shared
- Capabilities iOS
- App path para iOS
- Serviços iOS-only

### Por que esta abordagem?
- **DRY (Don't Repeat Yourself)**: Config comum não é duplicada
- **Fácil manutenção**: Mudanças comuns afetam apenas um arquivo
- **Flexibilidade**: Cada platform pode ter suas especificidades

## 🎨 Hooks e Lifecycle

### Mocha Hooks
```javascript
describe('Suite de testes', () => {
  before(async () => {
    // Executa antes de TODOS os testes da suite
    // Ex: Setup de dados, configurações
  });

  beforeEach(async () => {
    // Executa antes de CADA teste
    // Ex: Navegar para tela inicial
  });

  afterEach(async () => {
    // Executa após CADA teste
    // Ex: Screenshot em falha, cleanup
  });

  after(async () => {
    // Executa após TODOS os testes da suite
    // Ex: Limpeza final
  });
});
```

## 📸 Estratégia de Screenshots

### Captura Automática
- **When**: No hook `afterEach` se o teste falhou
- **Where**: Diretório `screenshots/`
- **Naming**: `{nome-teste}-{timestamp}.png`
- **Integration**: Allure anexa automaticamente ao report

## 📊 Data-Driven Testing (JSON)

```
tests/data/
├── usuarios.json         # Dados para testes de login/cadastro
└── formulario.json       # Dados para preenchimento de formulários
```

### Estrutura JSON
```json
[
  {
    "cenario": "login valido",
    "email": "teste@example.com",
    "senha": "123456",
    "esperado": "sucesso"
  },
  {
    "cenario": "senha invalida",
    "email": "teste@example.com",
    "senha": "senha_errada",
    "esperado": "erro"
  }
]
```

## 🔄 Helpers (Funções Reutilizáveis)

```
tests/helpers/
├── utils.js              # Funções utilitárias
├── constants.js          # Constantes (timeouts, mensagens)
└── assertions.js         # Custom assertions
```

## 🏃‍♂️ Execução dos Testes

### Comandos NPM
```bash
npm run test:android      # Executa em Android
npm run test:ios          # Executa em iOS
npm run allure:report     # Gera relatório Allure
npm run allure:open       # Abre relatório no browser
```

### Plataforma-Aware
```bash
# Testes específicos
npm run test:android -- --spec login.spec.js

# Tags (se implementado)
npm run test:android -- --grep @smoke
```

## 🚀 Pipeline CI/CD

### GitLab CI
- Stage: Test → executa testes em paralelo (Android + iOS)
- Stage: Report → gera Allure Report
- Artifacts: Salva relatório e screenshots
- Trigger: Commit em main/merge requests

## 🎯 Princípios Arquiteturais

1. **Simplicidade**: Código limpo e fácil de entender
2. **Manutenibilidade**: Fácil de modificar quando app muda
3. **Reutilização**: Componentes compartilhados, não duplicados
4. **Escalabilidade**: Fácil adicionar novos testes
5. **Independência**: Testes não dependem uns dos outros

## 🔍 Tecnologias e Dependências

### Core
- **WebdriverIO**: Framework principal
- **Appium**: Automação mobile
- **Mocha**: Runner de testes
- **Chai**: Assertions

### Reporting & Evidências
- **Allure Reporter**: Relatórios ricos
- **Spec Reporter**: Console output

### Utils
- **wdio-wait-for**: Waits explícitos melhorados

## 📝 Próximos Passos

1. ✅ Arquitetura definida (ETAPA 1)
2. ⏳ Configurar WebdriverIO + Appium + Mocha + Allure (ETAPA 2)
3. ⏳ Implementar Page Object Model (ETAPA 3)
4. ⏳ Implementar testes obrigatórios (ETAPA 4)
5. ⏳ Configurar screenshots automáticos (ETAPA 5)
6. ⏳ Configurar GitLab CI (ETAPA 6)
7. ⏳ Escrever README (ETAPA 7)
