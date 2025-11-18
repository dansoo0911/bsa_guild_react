#!/usr/bin/env node

/**
 * Скрипт для создания нового React приложения в workspace
 * Использование: node create-app.js app2
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const appName = process.argv[2];

if (!appName) {
  console.error('Ошибка: Укажите имя приложения');
  console.log('Использование: node create-app.js <имя-приложения>');
  process.exit(1);
}

const appsDir = path.join(__dirname, 'apps');
const appDir = path.join(appsDir, appName);

if (fs.existsSync(appDir)) {
  console.error(`Ошибка: Приложение "${appName}" уже существует`);
  process.exit(1);
}

console.log(`Создание нового приложения "${appName}"...`);

try {
  // Создаем приложение с помощью Vite
  execSync(`npm create vite@latest ${appName} -- --template react`, {
    cwd: appsDir,
    stdio: 'inherit'
  });

  // Устанавливаем зависимости
  console.log(`\nУстановка зависимостей для ${appName}...`);
  execSync('npm install', {
    cwd: appDir,
    stdio: 'inherit'
  });

  // Обновляем корневой package.json
  const rootPackageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  
  rootPackageJson.scripts[`dev:${appName}`] = `npm run dev --workspace=apps/${appName}`;
  rootPackageJson.scripts[`build:${appName}`] = `npm run build --workspace=apps/${appName}`;
  rootPackageJson.scripts[`preview:${appName}`] = `npm run preview --workspace=apps/${appName}`;

  fs.writeFileSync(
    path.join(__dirname, 'package.json'),
    JSON.stringify(rootPackageJson, null, 2) + '\n'
  );

  console.log(`\n✅ Приложение "${appName}" успешно создано!`);
  console.log(`\nДля запуска используйте:`);
  console.log(`  npm run dev:${appName}`);
  console.log(`  npm run build:${appName}`);
  console.log(`  npm run preview:${appName}`);
} catch (error) {
  console.error('Ошибка при создании приложения:', error.message);
  process.exit(1);
}

