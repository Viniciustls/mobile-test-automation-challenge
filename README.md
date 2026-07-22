# Mobile Test Automation Challenge

Projeto de automação de testes mobile usando WebdriverIO, Appium e Mocha para o aplicativo native-demo-app do WebdriverIO.

## 📋 Descrição

Este projeto é uma solução de automação mobile que implementa **14 cenários de teste** cobrindo as principais funcionalidades do aplicativo nativo de demonstração:

- ✅ Login e validação de credenciais
- ✅ Cadastro de novos usuários
- ✅ Preenchimento de formulários
- ✅ Interação com switches e dropdowns
- ✅ Navegação com gestos de swipe

O projeto utiliza **Page Object Model** para organização e manutenção, com relatórios detalhados via **Allure Report**.

## 🛠 Tecnologias Utilizadas

- **Linguagem:** JavaScript (ES6+)
- **Framework:** WebdriverIO v8.46.6
- **Automação Mobile:** Appium v3.5.2
- **Test Runner:** Mocha
- **Assertions:** Expect WebdriverIO
- **Relatórios:** Allure Report v2.24.0
- **Padrão:** Page Object Model
- **Drivers:** UiAutomator2 (Android), XCUITest (iOS)

## 📁 Estrutura do Projeto

```
mobile-test-automation-challenge/
├── config/
│   ├── wdio.shared.conf.js      # Configuração compartilhada
│   ├── wdio.android.conf.js     # Configuração Android
│   └── wdio.ios.conf.js         # Configuração iOS
│
├── tests/
│   ├── data/                    # Dados para testes
│   │   └── test-data.json
│   ├── helpers/                 # Funções auxiliares
│   │   └── screenshot-helper.js
│   ├── pages/                   # Page Objects (POM)
│   │   ├── cadastro.page.js
│   │   ├── forms.page.js
│   │   ├── login.page.js
│   │   ├── menu.page.js
│   │   └── navigation.page.js
│   ├── specs/                   # Arquivos de teste
│   │   ├── cadastro.spec.js
│   │   ├── formulario.spec.js
│   │   ├── login.spec.js
│   │   └── navegacao.spec.js
│   └── hooks.js                 # Hooks globais Mocha
│
├── apps/
│   └── android/                 # APK Android (deve ser baixado)
│
├── .gitlab-ci.yml               # Pipeline GitLab CI/CD
├── package.json
├── README.md
├── SETUP.md                     # Guia detalhado de setup
└── ARQUITETURA.md               # Documentação de arquitetura
```

## 📦 Pré-requisitos

### Gerais
- **Node.js** v18 ou superior
- **npm** (ou yarn)

### Para Android
- **Java** v11 ou superior
- **Android SDK** (API 29+)
- **Emulador Android** rodando ou dispositivo real conectado
- **ADB** configurado

### Para iOS (apenas Mac)
- **Xcode** v13 ou superior
- **iOS Simulator** (iPhone 14+)
- **CocoaPods**

### Para Execução dos Testes
- **Appium** v2.x instalado
- **Driver UiAutomator2** (Android)
- **Driver XCUITest** (iOS)
- **Allure Commandline**

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

### 4. Baixar o App de Teste

```bash
# Criar diretório
mkdir -p apps/android

# Baixar Android APK
curl -L https://github.com/webdriverio/native-demo-app/releases/download/v1.0.6/android-natives-demo-1.0.6.apk \
  -o apps/android/android.wdio.native.app.v2.2.0.apk
```

### 5. Configurar Ambiente Android

```bash
# Variáveis de ambiente
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Iniciar emulador Android
emulator -avd <nome-do-emulador> &

# Verificar conexão
adb devices
```

## 🏃 Execução dos Testes

### Comandos Disponíveis

```bash
# Executar todos os testes Android
npm run test:android

# Executar todos os testes iOS
npm run test:ios

# Gerar relatório Allure
npm run allure:report

# Abrir relatório no browser
npm run allure:open
```

### Executar Teste Específico

```bash
# Android
npx wdio run config/wdio.android.conf.js --spec tests/specs/login.spec.js

# iOS
npx wdio run config/wdio.ios.conf.js --spec tests/specs/cadastro.spec.js
```

### Executar com Filtro

```bash
# Por nome do teste
npm run test:android -- --grep "login com sucesso"

# Por suite
npm run test:android -- --grep "Login de usuário"

# Excluir testes
npm run test:android -- --grep "^((?!cadastro).)*$"
```

## ✅ Testes Automatizados

| Fluxo | Cenários | Total |
|-------|----------|-------|
| **Login** | Login com sucesso, Email inválido, Senha curta | 3 |
| **Cadastro** | Cadastro com sucesso, Senha curta, Senhas diferentes, Email inválido | 4 |
| **Forms** | Exibir texto digitado, Alterar switch, Selecionar dropdown, Botão ativo | 4 |
| **Navegação** | Acessar tela Swipe, Arrastar para direita, Voltar arrastando | 3 |
| **TOTAL** | | **14** |

### Detalhamento dos Cenários

#### Login (3 testes)
- `deve realizar login com sucesso usando dados válidos`
- `deve exibir erro ao realizar login com email inválido`
- `deve exibir erro ao realizar login com senha menor que 8 caracteres`

#### Cadastro (4 testes)
- `deve realizar cadastro com sucesso usando dados válidos`
- `deve exibir erro ao cadastrar com senha menor que 8 caracteres`
- `deve exibir erro ao cadastrar com confirmação de senha diferente`
- `deve exibir erro ao cadastrar com email inválido`

#### Forms (4 testes)
- `deve exibir o texto digitado no campo "You have typed"`
- `deve alterar o estado do switch`
- `deve selecionar uma opção no dropdown`
- `deve exibir um alerta ao clicar no botão ativo`

#### Navegação (3 testes)
- `deve acessar a tela Swipe`
- `deve arrastar o card para a direita`
- `deve voltar arrastando para a esquerda`

## 📊 Relatórios

### Allure Report

O projeto utiliza Allure Report para geração de relatórios detalhados.

**Localização dos resultados:**
- Resultados brutos: `allure-results/`
- Relatório HTML: `allure-report/`
- Screenshots: `screenshots/`
- Logs: `logs/android/` ou `logs/ios/`

### Gerar Relatório

```bash
# 1. Executar os testes
npm run test:android

# 2. Gerar relatório
npm run allure:report

# 3. Abrir no browser
npm run allure:open
```

### Conteúdo do Relatório

- ✅ Resumo de execução (quantidade de passou/falhou)
- ✅ Screenshots automáticos em falhas
- ✅ Logs de erro detalhados
- ✅ Tempo de execução por teste
- ✅ Informações do ambiente (Platform, Device)

## 🎨 Page Object Model

O projeto implementa o padrão Page Object Model para separação de responsabilidades.

### Page Objects Implementados

- **login.page.js** - Tela de Login
- **cadastro.page.js** - Tela de Cadastro
- **forms.page.js** - Tela de Formulários
- **navigation.page.js** - Tela de Navegação/Swipe
- **menu.page.js** - Menu Principal

### Exemplo de Uso

```javascript
const LoginPage = require('../pages/login.page');

// Realizar login
await LoginPage.login('test@example.com', 'password123');

// Verificar sucesso
await expect(LoginPage.successAlertTitle).toBeDisplayed();
```

### Helpers

- **screenshot-helper.js** - Captura automática de screenshots em falhas

## 📊 Data-Driven Testing

Os testes utilizam dados externos do arquivo `tests/data/test-data.json`:

```json
{
  "login": {
    "valido": {
      "email": "test@example.com",
      "senha": "password123"
    },
    "senhaCurta": {
      "email": "test@example.com",
      "senha": "1234567",
      "mensagem": "Please enter at least 8 characters"
    }
  }
}
```

## 🚀 CI/CD

### GitLab CI/CD

O projeto inclui configuração de pipeline em `.gitlab-ci.yml`.

#### Stages Configuradas

1. **test** - Executa testes Android e iOS em paralelo
2. **report** - Gera relatório Allure combinado
3. **deploy** - Publica relatório no GitLab Pages (opcional)

#### Jobs

| Job | Stage | Descrição |
|-----|-------|-----------|
| `test_android` | test | Executa testes Android |
| `test_ios` | test | Executa testes iOS |
| `generate_report` | report | Gera relatório Allure |
| `pages` | deploy | Publica no GitLab Pages |
| `smoke_test` | test | Testes rápidos com tag @smoke |


## 🔧 Configurações

### Android (wdio.android.conf.js)

- **Automation:** UiAutomator2
- **Device:** Android_Emulator
- **App:** `apps/android/android.wdio.native.app.v2.2.0.apk`
- **Porta Appium:** 4723
- **Timeout:** 90000ms

### iOS (wdio.ios.conf.js)

- **Automation:** XCUITest
- **Device:** iPhone 14
- **iOS Version:** 16.2
- **App:** `apps/ios/NativeDemoApp.app`

### Shared (wdio.shared.conf.js)

Configurações compartilhadas entre Android e iOS:
- Framework: Mocha (BDD)
- Reporters: Spec e Allure
- WaitforTimeout: 20000ms

## ⚠️ Observações e Limitações

### Limitações Conhecidas

1. **Apps não inclusos no repositório**
   - A pasta `apps/android/` está vazia
   - O APK deve ser baixado manualmente (ver seção Instalação)
   - Para iOS, o `.app` também deve ser obtido separadamente

2. **iOS não validado**
   - A configuração iOS existe mas requer Mac
   - **Não há evidência de que os testes executaram em iOS**
   - Requer Xcode, CocoaPods e iOS Simulator

3. **Selectors específicos para Android**
   - Page Objects usam XPath com `@content-desc`
   - **Pode não funcionar em iOS sem adaptação**
   - Para iOS real, seria necessário selectors diferentes

4. **CI/CD dependente de infraestrutura**
   - Pipeline configurado mas **não validado**
   - Requer GitLab Runner com capacidade de executar emuladores
   - Emuladores em containers Docker são complexos de configurar
   - Considere usar serviços cloud (BrowserStack, Sauce Labs)

5. **Helpers limitados**
   - Apenas `screenshot-helper.js` está implementado
   - Documentação cita outros helpers que não existem no código

## 📝 Documentação Adicional

- **[SETUP.md](SETUP.md)** - Guia detalhado de configuração de ambiente
- **[ARQUITETURA.md](ARQUITETURA.md)** - Documentação de arquitetura e padrões

## 🔗 Links Úteis

- [WebdriverIO Documentation](https://webdriver.io/docs)
- [Appium Documentation](https://appium.io/docs/en/2.0/intro/)
- [Allure Report](https://docs.qameta.io/allure/)
- [Native Demo App](https://github.com/webdriverio/native-demo-app)



