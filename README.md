![CI](https://github.com/KIriLOsck/w1tish/actions/workflows/build.yml/badge.svg)
![CI](https://github.com/KIriLOsck/w1tish/actions/workflows/unit.yml/badge.svg)
![License](https://img.shields.io/github/license/KIriLOsck/w1tish)
![Python Version](https://img.shields.io/badge/python-3.12+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?logo=fastapi)

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=KIriLOsck_w1tish&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=KIriLOsck_w1tish)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=KIriLOsck_w1tish&metric=coverage)](https://sonarcloud.io/summary/new_code?id=KIriLOsck_w1tish)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=KIriLOsck_w1tish&metric=bugs)](https://sonarcloud.io/summary/new_code?id=KIriLOsck_w1tish)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=KIriLOsck_w1tish&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=KIriLOsck_w1tish)

# w1tish - Легковесный, высоконагружаемый мессенджер

**Стек технологий**
- **Backend**: Python 3.12+, FastAPI (Asynchronous API)
- **Database (Core)**: PostgreSQL + SQLAlchemy 2.0 (Users, Chats, Metadata)
- **Database (History)**: MongoDB + PyMongo (Message storage)
- **Storage**: S3-compatible (via aioboto3) for media and avatars
- **Infrastructure**: Docker, Docker Compose
- **Frontend**: Vanilla JS / HTML / CSS (Mounted via FastAPI StaticFiles)

## Quick start (Docker, кросс-платформенно)

1. Клонируйте репозиторий и перейдите в папку проекта:
```bash
git clone https://github.com/KIriLOsck/w1tish.git
cd w1tish
```

2. Переименуйте файл `.env.example` в `.env` и вставьте необходимые ключи
```bash
cp .env.example .env
```

3. Поднимите сервисы:
```bash
docker-compose up --build
```

4. После старта сервисов:
- **Frontend**: http://localhost/
- **API Docs**: http://localhost/docs
- **PostgreSQL**: `localhost:5432`

5. Остановка и удаление контейнеров:
```bash
docker-compose down
```

### Архитектура данных

Проект использует гибридный подход к хранению данных для обеспечения высокой производительности:

- **PostgreSQL**: Хранит профили пользователей, настройки безопасности, структуру чатов и связи «кто в каком чате состоит».

- **MongoDB**: Оптимизирована для хранения огромного количества сообщений благодаря гибкой схеме и быстрому чтению коллекций.

- **S3 (aioboto3)**: Асинхронная загрузка изображений и документов без блокировки основного потока приложения.

### Структура backend:
```
backend
├── api                         # Содержит роутеры приложения
│   ├── auth.py                 # Ручки аутентификации
│   ├── broadcast.py            # Вебсокеты
│   └── data.py                 # Ручки взаимодействия с пользователями
│
├── core                        # Базовые настройки и управление сессиями
│   ├── config.py               # Критические настройки и подгрузка .env
│   ├── engine.py               # Создание и управление сессиями бд
│   ├── init.sql                # Инициализация таблиц PostgreSQL
│   └── logger.py               # Конфиг логгера
│
├── dependencies                # Зависимости и разделение ответственности
│   ├── annotations.py          # Анотации сервисов
│   └── dependencies.py         # Разрешение зависимостей и lifespan менеджер
│
├── errors.py                   # Кастомные исключения
├── interfaces
│   └── protocols.py            # Интерфейсы сервисов
│
├── models.py                   # Модели данных и баз
├── repositories                # Репозитории для сборки сервисов
│   ├── __init__.py
│   ├── mongo_methods.py        # Работа с NoSQL
│   └── postgress_methods.py    # Работа с PostgreSQL
│
└── utils                       # Утилиты обработки данных и исключений
    ├── cloud.py                # Загрузка данных в S3
    ├── exceptions_handlers.py  # Глобальная обработка исключений
    ├── security                # Утилиты безопасности
    │   ├── password_encrypt.py # Проверка и шифрование паролей
    │   └── token_generator.py  # Генерация и валидация JWT токенов
    │
    ├── services.py             # Определение сервисов
    └── websocket.py            # Обработка вебсокетов
```
