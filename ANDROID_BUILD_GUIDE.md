
# 📱 Guia Completo para Compilar o App Android

## 🔧 Pré-requisitos

1. **Node.js** (versão 16+)
2. **Android Studio** com Android SDK
3. **Java Development Kit (JDK)** 11 ou superior
4. **Git**

## 📋 Passo a Passo

### 1. Exportar e Clonar o Projeto

1. No Lovable, clique em **GitHub** → **Export to GitHub**
2. Clone o repositório:
```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd <NOME_DO_PROJETO>
```

### 2. Instalar Dependências

```bash
# Instalar dependências do projeto
npm install

# Instalar dependências do Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### 3. Configurar Android Studio

1. Baixe e instale o **Android Studio**
2. Durante a instalação, certifique-se de instalar:
   - Android SDK
   - Android SDK Platform-Tools
   - Android Virtual Device (AVD)

3. Configure as variáveis de ambiente:
```bash
# No Linux/Mac, adicione ao ~/.bashrc ou ~/.zshrc:
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# No Windows, configure nas Variáveis de Ambiente do Sistema:
# ANDROID_HOME = C:\Users\SeuUsuario\AppData\Local\Android\Sdk
```

### 4. Build do Projeto

```bash
# Fazer build da aplicação web
npm run build

# Inicializar Capacitor (primeira vez)
npx cap init

# Adicionar plataforma Android
npx cap add android

# Sincronizar o projeto
npx cap sync android
```

### 5. Abrir no Android Studio

```bash
# Abrir projeto no Android Studio
npx cap open android
```

### 6. Gerar APK

No Android Studio:

1. Aguarde a indexação do projeto terminar
2. Vá em **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Aguarde o build completar
4. Clique em **locate** quando aparecer a notificação
5. O APK estará em: `android/app/build/outputs/apk/debug/app-debug.apk`

### 7. Gerar APK de Release (Produção)

Para gerar um APK assinado para publicação:

1. No Android Studio, vá em **Build** → **Generate Signed Bundle / APK**
2. Selecione **APK**
3. Crie ou selecione uma keystore
4. Configure a assinatura
5. Selecione **release** como build variant
6. Clique em **Finish**

## 🛠️ Script Automático

Execute o script fornecido para automatizar o processo:

```bash
# Dar permissão de execução (Linux/Mac)
chmod +x build-android.sh

# Executar script
./build-android.sh
```

## 🐛 Resolução de Problemas

### Erro de ANDROID_HOME
```bash
# Verificar se está configurado
echo $ANDROID_HOME

# Se não estiver, configure conforme instruções acima
```

### Erro de Gradle
```bash
# Limpar cache do Gradle
cd android
./gradlew clean

# Voltar para raiz e sincronizar
cd ..
npx cap sync android
```

### Erro de SDK
No Android Studio:
1. **Tools** → **SDK Manager**
2. Instale a versão mais recente do Android SDK
3. Instale **Android SDK Build-Tools**

## 📱 Testar o App

### Em Emulador
1. No Android Studio, abra **AVD Manager**
2. Crie um novo Virtual Device
3. Execute o emulador
4. No terminal: `npx cap run android`

### Em Dispositivo Físico
1. Ative **Opções do desenvolvedor** no Android
2. Ative **Depuração USB**
3. Conecte o dispositivo via USB
4. Execute: `npx cap run android`

## 📦 Estrutura de Arquivos

```
projeto/
├── android/                 # Projeto Android nativo
├── capacitor.config.ts      # Configuração do Capacitor
├── build-android.sh         # Script de build
└── dist/                    # Build da aplicação web
```

## 🎯 Comandos Úteis

```bash
# Sincronizar após mudanças no código
npx cap sync android

# Executar no dispositivo/emulador
npx cap run android

# Abrir no Android Studio
npx cap open android

# Limpar e rebuild
npx cap sync android --force
```

## ✅ Checklist Final

- [ ] Node.js instalado
- [ ] Android Studio configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Projeto clonado do GitHub
- [ ] Dependências instaladas
- [ ] Build executado com sucesso
- [ ] APK gerado

---

🎉 **Parabéns!** Agora você tem o APK do **Dieta do Murilao** pronto para instalar!
