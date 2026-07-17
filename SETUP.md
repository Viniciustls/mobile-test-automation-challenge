# Setup do Ambiente

## Pré-requisitos

### Para Desenvolvimento Local

1. **Node.js** (v18 ou superior)
   ```bash
   # Verificar versão
   node --version

   # Instalar via nvm (recomendado)
   nvm install 18
   nvm use 18
   ```

2. **Java** (v11 ou superior - para Android)
   ```bash
   # Verificar versão
   java -version

   # Instalar via SDKMAN (Linux/Mac)
   sdk install java 11.0.17-tem

   # Ou baixar de: https://www.oracle.com/java/technologies/downloads/
   ```

3. **Android SDK** (para Android)
   ```bash
   # Instalar Android Studio ou Android SDK separadamente
   # Variáveis de ambiente necessárias:
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
   ```

4. **Xcode** (para iOS - apenas Mac)
   ```bash
   # Instalar via Mac App Store
   # Aceitar licença:
   sudo xcodebuild -license accept
   ```

## Instalação

### 1. Clonar Repositório
```bash
git clone <seu-repositorio>
cd mobile-test-automation-challenge
```

### 2. Instalar Dependências NPM
```bash
npm install
```

### 3. Instalar Appium
```bash
# Appium 2.x
npm install -g appium

# Verificar instalação
appium --version

# Instalar drivers
appium driver install uiautomator2  # Android
appium driver install xcuitest      # iOS
```

### 4. Instalar Allure Commandline
```bash
# Via NPM
npm install -g allure-commandline

# Ou baixar diretamente
# https://github.com/allure-framework/allure2/releases
```

## Configuração Android

### 1. Criar Emulador
```bash
# Listar imagens disponíveis
sdkmanager --list | grep system-images

# Instalar imagem (ex: API 29)
sdkmanager "system-images;android-29;default;x86_64"

# Criar AVD
avdmanager create avd -n test_emulator -k "system-images;android-29;default;x86_64"

# Listar emuladores
emulator -list-avds
```

### 2. Iniciar Emulador
```bash
# Via linha de comando
emulator -avd test_emulator &

# Ou via Android Studio
# Tools > AVD Manager > Start
```

### 3. Verificar Conexão
```bash
# Verificar dispositivos conectados
adb devices

# Deve mostrar seu emulador
```

## Configuração iOS (Apenas Mac)

### 1. Verificar Simuladores
```bash
# Listar simuladores disponíveis
xcrun simctl list devices

# Exemplo de saída:
# iPhone 14 (E5ABCD) (Shutdown)
# iPhone 14 Pro (F12345) (Booted)
```

### 2. Iniciar Simulador
```bash
# Via linha de comando
xcrun simctl boot "iPhone 14"

# Ou via Xcode
# Open > Device > Select Device > Run
```

### 3. Verificar Conexão
```bash
# Verificar dispositivos conectados
xcrun simctl list devices booted
```

## Download do App de Teste

### Android APK
```bash
# Criar diretório
mkdir -p apps/android

# Baixar native-demo-app
curl -L https://github.com/webdriverio/native-demo-app/releases/download/v1.0.6/android-natives-demo-1.0.6.apk \
  -o apps/android/Android-NativeDemoApp.apk
```

### iOS .app
```bash
# Criar diretório
mkdir -p apps/ios

# Baixar e extrair native-demo-app
# Nota: Para iOS, você precisa compilar o app ou usar .app já compilado
# Veja: https://github.com/webdriverio/native-demo-app
```

## Configuração do Ambiente

### 1. Variáveis de Ambiente
```bash
# Criar arquivo .env
cat > .env << EOF
# Android
ANDROID_HOME=/path/to/android/sdk
ANDROID_APP_PATH=./apps/android/Android-NativeDemoApp.apgk

# iOS (apenas Mac)
IOS_APP_PATH=./apps/ios/NativeDemoApp.app

# Appium
APPIUM_URL=http://localhost:4723/wd/hub
EOF
```

### 2. Atualizar Caminhos do App
Edite os arquivos de configuração se necessário:

**config/wdio.android.conf.js:**
```javascript
const APP_PATH = process.env.ANDROID_APP_PATH ||
  join(process.cwd(), 'apps', 'android', 'Android-NativeDemoApp.apk');
```

**config/wdio.ios.conf.js:**
```javascript
const APP_PATH = process.env.IOS_APP_PATH ||
  join(process.cwd(), 'apps', 'ios', 'NativeDemoApp.app');
```

## Execução dos Testes

### Android
```bash
# Executar todos os testes
npm run test:android

# Testes específicos
npm run test:android -- --spec login.spec.js

# Com grep
npm run test:android -- --grep "login com sucesso"
```

### iOS
```bash
# Executar todos os testes
npm run test:ios

# Testes específicos
npm run test:ios -- --spec cadastro.spec.js
```

### Com Filtros
```bash
# Por nome de teste
npm run test:android -- --grep "cadastro"

# Por exclusão
npm run test:android -- --grep "^((?!login).)*$"

# Smoke tests (se marcado)
npm run test:android -- --grep "@smoke"
```

## Gerar Relatório

### 1. Executar Testes
```bash
npm run test:android
```

### 2. Gerar Relatório Allure
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

## Troubleshooting

### Problemas Comuns

1. **Emulador não inicia**
   ```bash
   # Solução 1: Reiniciar ADB
   adb kill-server
   adb start-server

   # Solução 2: Verificar hardware virtualização
   # BIOS > Virtualization Technology > Enabled
   ```

2. **Appium não conecta**
   ```bash
   # Verificar se Appium está rodando
   curl http://localhost:4723/wd/hub/status

   # Reiniciar Appium
   pkill -f appium
   appium &
   ```

3. **Testes falham com "element not found"**
   ```bash
   # Solução: Verificar selectors para sua plataforma
   # Android vs iOS usam selectors diferentes
   ```

4. **Erro de permissões**
   ```bash
   # Android: Aceitar permissões manualmente primeira vez
   adb shell pm grant com.wdiodemoapp android.permission.WRITE_EXTERNAL_STORAGE
   ```

5. **WebDriverAgent não compila (iOS)**
   ```bash
   # Solução 1: Primeira execução pode demorar (10+ minutos)
   # Solução 2: Assinar código (development team)
   # Solução 3: Use app pre-compilado
   ```

### Debug Mode
```bash
# Habilitar debug mode
DEBUG=true npm run test:android

# Ver logs detalhados
APPIUM_DEBUG=true npm run test:android
```

### Logs
```bash
# Ver logs da execução
cat logs/android-*.log

# Ver screenshots
ls -la screenshots/
```

## Configuração IDE (VS Code)

### Extensões Recomendadas
- JavaScript (ES6) code snippets
- Mocha Test Explorer
- Allure Report
- REST Client

### .vscode/settings.json
```json
{
  "mocha.files.glob": "tests/specs/**/*.js",
  "mocha.options.timeout": 60000,
  "editor.formatOnSave": true
}
```

## Integração CI/CD

### GitLab CI
Veja `.gitlab-ci.yml` para configuração completa.

### Variáveis GitLab
Configure em: Settings > CI/CD > Variables
- `ANDROID_HOME`
- `ANDROID_APP_PATH`
- `BROWSERSTACK_USERNAME` (opcional)
- `BROWSERSTACK_ACCESS_KEY` (opcional)

## BrowserStack (Opcional)

### 1. Instalar Dependências
```bash
npm install --save-dev browserstack-local
```

### 2. Configurar
```javascript
// config/browserstack.conf.js
exports.config = {
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,
  services: [['browserstack', {
    app: 'bs://<app-id>',
    // ...
  }]]
};
```

### 3. Executar
```bash
# Upload app para BrowserStack primeiro
# Depois executar testes
npm run test:browserstack
```

## Limpeza

### LIMPAR RESULTADOS
```bash
# Limpar screenshots
rm -rf screenshots/*

# Limpar relatórios
rm -rf allure-report allure-results

# Limpar logs
rm -rf logs/*
```

### REINICIAR TUDO
```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Limpar cache
npm cache clean --force
```

## Suporte

### Links Úteis
- [WebdriverIO Docs](https://webdriver.io/docs)
- [Appium Docs](https://appium.io/docs/en/2.0/intro/)
- [Allure Report](https://docs.qameta.io/allure/)
- [Mocha Docs](https://mochajs.org/)

### Comunidade
- WebdriverIO Discord
- Appium Discord
- Stack Overflow: [webdriverio] [appium]
