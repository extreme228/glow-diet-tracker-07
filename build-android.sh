
#!/bin/bash

# Script para compilar o app para Android
echo "🚀 Iniciando processo de build para Android..."

# 1. Instalar dependências
echo "📦 Instalando dependências..."
npm install

# 2. Instalar dependências do Capacitor
echo "📱 Instalando dependências do Capacitor..."
npm install @capacitor/core @capacitor/cli @capacitor/android

# 3. Build do projeto
echo "🔨 Fazendo build do projeto..."
npm run build

# 4. Inicializar Capacitor (se necessário)
echo "⚡ Inicializando Capacitor..."
npx cap init

# 5. Adicionar plataforma Android
echo "🤖 Adicionando plataforma Android..."
npx cap add android

# 6. Sincronizar projeto
echo "🔄 Sincronizando projeto..."
npx cap sync android

# 7. Abrir no Android Studio
echo "🎯 Abrindo no Android Studio..."
npx cap open android

echo "✅ Processo concluído! O Android Studio deve abrir automaticamente."
echo "📝 No Android Studio, vá em Build > Build Bundle(s) / APK(s) > Build APK(s)"
