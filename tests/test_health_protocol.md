**Модуль:** `main.py`

**Версия кода:** `6c7186a`

**Дата:** `28.01.2026`

**Инструменты:** pytest, httpx

**Цель:** Проверить корректность монтирования статики фронтенда и корректность запуска приложения.

**Окружение:**
 - Python 3.12.
 - Зависимости: `pytest==9.0.2`, `httpx==0.28.1`.

**Тест-кейсы:**
1. - **Вход:** `GET - "http://localhost/health"`
   - **Ожидается:** `{"status": "ok"}`
   - **Описание:** Проверка запуска приложения.
2. - **Вход:** `GET - "http://localhost/index.html"`
   - **Ожидaется:** `<DOCTYPE html><html>...`
   - **Описание:** Проверка правильного монтирования файлов фронтенда

**Код тестов:**
```python
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_health(async_client: AsyncClient):
    response = await async_client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status":"ok"}

@pytest.mark.asyncio
async def test_load_site(async_client: AsyncClient):
    response = await async_client.get("/index.html")
    assert response.status_code == 200
```

**Результаты:**
| Тест-кейс             | Статус | Ошибка                |  
|-----------------------|--------|-----------------------|  
| test_health           | Pass   | —                     |  
| test_load_site        | Pass   | —                     |

**Покрытие кода:**
- Общее покрытие: **33%**.  
- Непокрыты роутеры
