# Mobile Test Automation Challenge

Projeto de automação de testes mobile usando WebdriverIO, Appium, Mocha e Chai para o aplicativo native-demo-app do WebdriverIO.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Execução Local](#execução-local)
- [Execução Android](#execução-android)
- [Execução iOS](#execução-ios)
- [Geração do Relatório Allure](#geração-do-relatório-allure)
- [Testes Implementados](#testes-implementados)
- [Page Object Model](#page-object-model)
- [Data-Driven Testing](#data-driven-testing)
- [CI/CD](#cicd)
- [Troubleshooting](#troubleshooting)
- [Contribuição](#contribuição)

## 🎯 Visão Geral

Este projeto implementa uma solução completa de automação mobile com 10 cenários de teste cobrindo as principais funcionalidades do aplicativo:

- ✅ Login/Cadastro
- ✅ Navegação entre telas
- ✅ Preenchimento de formulários
- ✅ Validação de mensagens de erro

O projeto segue as melhores práticas de automação, incluindo Page Object Model, Data-Driven Testing e relatórios detalhados com Allure.

## 🛠 Tecnologias

- **Linguagem:** JavaScript (ES6+)
- **Framework:** WebdriverIO v8
- **Biblioteca:** Appium v2
- **Test Runner:** Mocha
- **Assertions:** Chai
- **Relatórios:** Allure Report
- **CI/CD:** GitLab CI/CD
- **Padrão:** Page Object Model (POM)

## 📁 Estrutura do Projeto

```
mobile-test-automation-challenge/
├── config/
│   ├── wdio.shared.conf.js    # Configuração compartilhada
│   ├── wdio.android.conf.js    # Configuração Android
│   └── wdio.ios.conf.js        # Configuração iOS
│
├── tests/
│   ├── specs/                  # Arquivos de teste
│   │   ├── login.spec.js
│   │   ├── cadastro.spec.js
│   │   ├── navegacao.spec.js
│   │   └── formulario.spec.js
│   │
│   ├── pages/                  # Page Objects (POM)
│   │   ├── base.page.js
│   │   ├── login.page.js
│   │   ├── cadastro.page.js
│   │   ├── menu.page.js
│   │   ├── forms.page.js
│   │   └── navigation.page.js
│   │
│   ├── helpers/                # Funções auxiliares
│   │   ├── constants.js
│   │   ├── utils.js
│   │   ├── assertions.js
│   │   ├── screenshot-helper.js
│   │   └── data-helper.js
│   │
│   ├── data/                   # Dados para testes
│   │   └── test-data.json
│   │
│   └── hooks.js                # Hooks globais Mocha
│
├── screenshots/                # Evidências de falhas
├── allure-results/             # Resultados Allure
├── allure-report/              # Relatório HTML
├── logs/                       # Logs de execução
│
├── .gitlab-ci.yml              # Pipeline GitLab
├── package.json
├── README.md
├── SETUP.md
└── ARQUITETURA.md
```

## 📦 Pré-requisitos

### Gerais
- **Node.js** v18 ou superior
- **npm** ou **yarn**

### Para Android
- **Java** v11 ou superior
- **Android SDK** (API 29+)
- **Emulador Android** ou dispositivo real

### Para iOS (apenas Mac)
- **Xcode** v13 ou superior
- **iOS Simulator** (iPhone 14+)
- **CocoaPods**

### Para CI/CD
- **GitLab Runner** configurado
- **Docker** (para containers)

## 🚀 Instalação

### 1. Clonar o Repositório

```bash
git clone <seu-repositorio>
cd mobile-test-automation-challenge
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Instalar Appium

```bash
npm install -g appium
appium driver install uiautomator2  # Android
appium driver install xcuitest      # iOS
```

### 4. Instalar Allure

```bash
npm install -g allure-commandline
```

## ⚙️ Configuração do Ambiente

### Android

1. **Configurar Android SDK**

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

2. **Criar e Iniciar Emulador**

```bash
# Via Android Studio: Tools > AVD Manager > Create
# Ou via CLI:
emulator -avd <nome-do-emulador> &
```

3. **Verificar Conexão**

```bash
adb devices
```

### iOS (Apenas Mac)

1. **Instalar Xcode**

```bash
# Via Mac App Store
sudo xcodebuild -license accept
```

2. **Iniciar Simulador**

```bash
xcrun simctl boot "iPhone 14"
```

3. **Verificar Dispositivos**

```bash
xcrun simctl list devices booted
```

### Download do App de Teste

```bash
# Criar diretórios
mkdir -p apps/android apps/ios

# Baixar Android APK
curl -L https://github.com/webdriverio/native-demo-app/releases/download/v1.0.6/android-natives-demo-1.0.6.apk \
  -o apps/android/Android-NativeDemoApp.apk
```

## 🏃 Execução Local

### Comandos Básicos

```bash
# Instalar dependências
npm install

# Executar testes Android
npm run test:android

# Executar testes iOS
npm run test:ios

# Gerar relatório Allure
npm run allure:report

# Abrir relatório no browser
npm run allure:open
```

## 📱 Execução Android

### Comandos

```bash
# Executar todos os testes
npm run test:android

# Testes específicos
npm run test:android -- --spec login.spec.js

# Com filtro (grep)
npm run test:android -- --grep "login com sucesso"

# Excluir testes
npm run test:android -- --grep "^((?!login).)*$"

# Smoke tests
npm run test:android -- --grep "@smoke"
```

### Pré-requisitos

- Emulador Android rodando ou dispositivo conectado
- Appium servidor iniciado
- APK disponível em `apps/android/`

### Verificação

```bash
# Verificar dispositivos conectados
adb devices

# Verificar Appium
curl http://localhost:4723/wd/hub/status
```

##  Execução iOS

### Comandos

```bash
# Executar todos os testes
npm run test:ios

# Testes específicos
npm run test:ios -- --spec cadastro.spec.js

# Com filtro
npm run test:ios -- --grep "cadastro"
```

### Pré-requisitos

- iOS Simulator rodando
- Xcode instalado
- App .app disponível em `apps/ios/`

### Verificação

```bash
# Verificar simuladores
xcrun simctl list devices booted
```

## 📊 Geração do Relatório Allure

### 1. Executar Testes

```bash
npm run test:android
```

### 2. Gerar Relatório

```bash
npm run allure:report
```

### 3. Abrir Relatório

```bash
npm run allure:open

# Ou manualmente
cd allure-report
python3 -m http.server 8080
# Abrir: http://localhost:8080
```

### Conteúdo do Relatório

- ✅ Resumo dos testes executados
- ✅ Screenshots das falhas
- ✅ Logs de execução
- ✅ Informações do ambiente
- ✅ Timeline de execução
- ✅ Histórico de execuções

## ✅ Testes Implementados

### 1. Login com Sucesso
Verifica se usuário consegue fazer login com credenciais válidas.

**Arquivo:** `tests/specs/login.spec.js`

### 2. Login com Senha Inválida
Verifica se sistema rejeita login com senha incorreta.

**Arquivo:** `tests/specs/login.spec.js`

### 3. Login com Campos Vazios
Verifica se sistema valida campos obrigatórios de login.

**Arquivo:** `tests/specs/login.spec.js`

### 4. Cadastro com Sucesso
Verifica se usuário consegue se cadastrar com dados válidos.

**Arquivo:** `tests/specs/cadastro.spec.js`

### 5. Cadastro com E-mail Inválido
Verifica se sistema valida formato de e-mail.

**Arquivo:** `tests/specs/cadastro.spec.js`

### 6. Cadastro com Senhas Diferentes
Verifica se sistema valida confirmação de senha.

**Arquivo:** `tests/specs/cadastro.spec.js`

### 7. Navegação Entre Telas
Verifica se usuário consegue navegar entre diferentes telas.

**Arquivo:** `tests/specs/navegacao.spec.js`

### 8. Navegação pelo Menu Inferior
Verifica se todas as abas do menu são acessíveis.

**Arquivo:** `tests/specs/navegacao.spec.js`

### 9. Preenchimento de Formulário
Verifica se usuário consegue preencher formulários corretamente.

**Arquivo:** `tests/specs/formulario.spec.js`

### 10. Validação de Mensagens de Erro
Verifica se sistema mostra mensagens de erro apropriadas.

**Arquivo:** `tests/specs/formulario.spec.js`

## 🎨 Page Object Model

O projeto implementa o padrão Page Object Model para melhor organização e manutenção.

### Estrutura

```
tests/pages/
├── base.page.js          # Classe base com métodos comuns
├── login.page.js         # Tela de Login
├── cadastro.page.js      # Tela de Cadastro
├── menu.page.js          # Menu Principal
├── forms.page.js         # Formulários
└── navigation.page.js    # Navegação
```

### Exemplo de Uso

```javascript
const LoginPage = require('../pages/login.page');

const loginPage = new LoginPage();

// Realizar login
await loginPage.performLogin('email@example.com', 'senha123');

// Verificar sucesso
const success = await loginPage.isLoginSuccess();
```

### Benefícios

- ✅ Separação de responsabilidades
- ✅ Reutilização de código
- ✅ Manutenção facilitada
- ✅ Testes mais legíveis

## 📊 Data-Driven Testing

Os testes suportam execução data-driven usando arquivos JSON.

### Estrutura dos Dados

```json
{
  "login": [
    {
      "cenario": "login-sucesso",
      "email": "teste@example.com",
      "senha": "123456",
      "esperado": { "sucesso": true }
    }
  ]
}
```

### Execução Data-Driven

Os testes carregam automaticamente dados de `tests/data/test-data.json`:

```javascript
const { getLoginData } = require('../helpers/data-helper');

const scenarios = getLoginData();

scenarios.forEach(scenario => {
  it(`cenário ${scenario.cenario}`, async () => {
    // Executa teste com dados do cenário
  });
});
```

## 🚀 CI/CD

### GitLab CI/CD

O projeto inclui pipeline completo configurado em `.gitlab-ci.yml`.

#### Stages

1. **test**: Executa testes Android e iOS em paralelo
2. **report**: Gera relatório Allure combinado
3. **deploy**: Publica relatório no GitLab Pages

#### Estrutura

```yaml
stages:
  - test
  - report
  - deploy

test_android:
  stage: test
  script: npm run test:android

test_ios:
  stage: test
  script: npm run test:ios

generate_report:
  stage: report
  script: npm run allure:report
```

#### Execução

```bash
# Pipeline executa automaticamente em:
# - Commits para main
# - Merge requests

# Execução manual:
# GitLab > CI/CD > Pipelines > Run Pipeline
```

#### Artefatos

- **Screenshots**: 7 dias
- **Logs**: 7 dias
- **Relatório**: 30 dias

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Emulador não inicia

```bash
# Solução: Reiniciar ADB
adb kill-server
adb start-server
```

#### 2. Appium não conecta

```bash
# Verificar Appium
curl http://localhost:4723/wd/hub/status

# Reiniciar
pkill -f appium
appium &
```

#### 3. Testes falham com "element not found"

```bash
# Solução: Verificar selectors
# Android vs iOS usam selectors diferentes
# Logs em tests/helpers/screenshot-helper.js
```

#### 4. WebDriverAgent não compila (iOS)

```bash
# Solução: Primeira execução demora (10+ min)
# Ou assinar código com development team
```

### Debug Mode

```bash
# Habilitar debug
DEBUG=true npm run test:android

# Logs detalhados
APPIUM_DEBUG=true npm run test:android
```

### Logs

```bash
# Ver logs
cat logs/android-*.log

# Ver screenshots
ls -la screenshots/
```
