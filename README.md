![CI](https://github.com/KIriLOsck/w1tish/actions/workflows/build.yml/badge.svg)
![CI](https://github.com/KIriLOsck/w1tish/actions/workflows/unit.yml/badge.svg)
![License](https://img.shields.io/github/license/KIriLOsck/w1tish)
![Python Version](https://img.shields.io/badge/python-3.12+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?logo=fastapi)

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=KIriLOsck_w1tish&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=KIriLOsck_w1tish)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=KIriLOsck_w1tish&metric=bugs)](https://sonarcloud.io/summary/new_code?id=KIriLOsck_w1tish)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=KIriLOsck_w1tish&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=KIriLOsck_w1tish)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=KIriLOsck_w1tish&metric=coverage)](https://sonarcloud.io/summary/new_code?id=KIriLOsck_w1tish)

# w1tish - Легковесный, высоконагружаемый мессенджер

**Стек технологий**
- **Backend**: Python 3.12+, FastAPI (Asynchronous API)
- **Database (Core)**: PostgreSQL + SQLAlchemy 2.0 (Users, Chats, Metadata)
- **Database (History)**: MongoDB + PyMongo (Message storage)
- **Storage**: S3-compatible (via aioboto3) for media and avatars
- **Infrastructure**: Docker, Docker Compose
- **Frontend**: Vanilla JS / HTML / CSS (Mounted via FastAPI StaticFiles)

**Quick start (Docker, кросс-платформенно)**

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
