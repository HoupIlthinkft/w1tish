![CI](https://github.com/KIriLOsck/w1tish/actions/workflows/build.yml/badge.svg)
![CI](https://github.com/KIriLOsck/w1tish/actions/workflows/unit.yml/badge.svg)
[![License: PolyForm Shield 1.0.0](https://img.shields.io/badge/License-Polyfrom_shield_1.0.0-orange)](https://polyformproject.org/licenses/shield/1.0.0)
![Python Version](https://img.shields.io/badge/python-3.12+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?logo=fastapi)

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=KIriLOsck_w1tish&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=KIriLOsck_w1tish)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=KIriLOsck_w1tish&metric=bugs)](https://sonarcloud.io/summary/new_code?id=KIriLOsck_w1tish)

# w1tish - Легковесный мессенджер

**Стек технологий**
- **Backend**: Python 3.12+, FastAPI (Asynchronous API)
- **Database (Core)**: PostgreSQL + SQLAlchemy 2.0 (Users, Chats, Metadata)
- **Database (History)**: MongoDB + PyMongo (Message storage)
- **Storage**: S3-compatible (via aioboto3) for avatars
- **Infrastructure**: Docker, Docker Compose
- **Frontend**: React + TypeScript

## Requirements
- **Rust** (Cargo)
- **Node.js 20+** (npm)
- **Docker** (Docker-compose)

## Quick start (Docker, кросс-платформенно)

1. Клонируйте репозиторий и перейдите в папку проекта:
```bash
git clone https://github.com/KIriLOsck/w1tish.git
cd w1tish
```

2. Переименуйте файл `.env.example` в `.env` и вставьте необходимые ключи
```bash
cp .env.example .env
nano .env
```

3. Поднимите бекенд:
```bash
docker-compose up --build
```

4. Если тип сборки указан `development` после старта сервисов:
- **Frontend**: http://localhost:8000
- **Docs swagger**: http://localhost:8000/docs

5. Остановка и удаление контейнеров:
```bash
docker-compose down -v
```

Если необходимо собрать frontend отдельно (для nginx):
1. Перейдите в директорию `frontend`:
```bash
cd frontend
```

2. Установите зависимости Node.js:
```bash
npm install
```

3. Соберите frontend или приложение
```bash
npm run vite build

# или для сборки под desktop (требует cargo):
npm run tauri build
```

Скомпилированные файлы frontend будут в корне проекта в каталоге `static`. Приложение будет в `frontend/src-tauri/target/release`.

### Архитектура данных

Проект использует гибридный подход к хранению данных для обеспечения высокой производительности:

- **PostgreSQL**: Хранит профили пользователей, настройки безопасности, структуру чатов и связи «кто в каком чате состоит».

- **MongoDB**: Оптимизирована для хранения огромного количества сообщений благодаря гибкой схеме и быстрому чтению коллекций.

- **S3 (aioboto3)**: Асинхронная загрузка изображений и документов без блокировки основного потока приложения.

### Структура backend:
```
backend
│
├── errors.py                   # Кастомные исключения
├── models.py                   # Датаклассы и модели БД
│
├── api
│   ├── auth.py                 # Ручки аутентификации
│   ├── broadcast.py            # Вебсокеты
│   └── data.py                 # Ручки взаимодействия с пользователями
│
├── core
│   ├── config.py               # Критические настройки и подгрузка .env
│   ├── engine.py               # Создание и управление сессиями бд
│   └── logger.py               # Конфиг логгера
│
├── dependencies
│   ├── annotations.py          # Анотации сервисов
│   └── dependencies.py         # Разрешение зависимостей и lifespan менеджер
│
├── interfaces
│   └── protocols.py            # Интерфейсы сервисов
│
├── repositories                # Репозитории для сборки сервисов
│   ├── __init__.py
│   ├── mongo_methods.py        # Работа с NoSQL
│   └── postgress_methods.py    # Работа с PostgreSQL
│
└── utils
    ├── cloud.py                # Загрузка данных в S3
    ├── exceptions_handlers.py  # Глобальная обработка исключений
    ├── security                # Утилиты безопасности
    │   ├── id_generator.py     # Генерация айди юзеров и чатов по snowflake
    │   ├── password_encrypt.py # Проверка и шифрование паролей
    │   └── token_generator.py  # Генерация и валидация JWT токенов
    │
    ├── services.py             # Определение сервисов
    └── websocket.py            # Обработка вебсокетов
```
### Примечания
Для корректной загрузки и обработки аватарок необходимо создать в вашем бакете s3 структуру:
```
bucket
├── avatars        # каталог для сохранения аватаров пользователей
└── default        # стандартные аватары (выбираются случайно)
    ├── 1.jpg      # стандартный аватар только в формате .jpg 256x256
    ├── ...
    └── n.jpg
```
> После загрузки стандартных аватаров укажите их общее колличество в `config.yml`
