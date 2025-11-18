# React Apps Workspace

Это workspace для управления несколькими независимыми React приложениями.

## Структура проекта

```
react_app/
├── apps/                    # Папка с приложениями
│   ├── app1/               # Первое приложение
│   │   ├── src/
│   │   ├── public/
│   │   ├── index.html
│   │   ├── vite.config.js
│   │   └── package.json
│   └── app2/               # Второе приложение (создайте при необходимости)
│       └── ...
├── package.json            # Корневой package.json для управления всеми приложениями
└── README.md
```

## Установка

Перед началом работы убедитесь, что у вас установлен Node.js (версия 18 или выше).

```bash
# Установите зависимости для всех приложений
npm install
```

## Запуск приложений

### Запуск конкретного приложения

```bash
# Запуск app1
npm run dev:app1

# Сборка app1
npm run build:app1

# Предпросмотр собранного app1
npm run preview:app1
```

### Запуск по умолчанию (app1)

```bash
# Запуск сервера разработки
npm run dev

# Сборка проекта
npm run build

# Предпросмотр
npm run preview
```

## Создание нового приложения

Чтобы создать новое приложение в этом workspace:

1. Создайте новую папку в `apps/`, например `apps/app2/`
2. Создайте React приложение с помощью Vite:
   ```bash
   cd apps
   npm create vite@latest app2 -- --template react
   cd app2
   npm install
   ```
3. Добавьте скрипты в корневой `package.json`:
   ```json
   "dev:app2": "npm run dev --workspace=apps/app2",
   "build:app2": "npm run build --workspace=apps/app2",
   "preview:app2": "npm run preview --workspace=apps/app2"
   ```
4. Обновите скрипты по умолчанию, если нужно

## Полезные команды

- `npm run dev:app1` - запуск сервера разработки для app1
- `npm run build:app1` - сборка app1 для продакшена
- `npm run preview:app1` - предпросмотр собранного app1
- `npm install` - установка зависимостей для всех приложений

## Начало работы

Каждое приложение независимо и имеет свою структуру. Откройте нужное приложение в `apps/[название]/` и начните редактировать код.
