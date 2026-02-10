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

@pytest.mark.asyncio
async def test_load_swagger(async_client: AsyncClient):
    response = await async_client.get("/docs")
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_load_config(async_client: AsyncClient):
    response = await async_client.get("/config.js")
    assert response.status_code == 200
    assert response.headers.get("content-type") == "application/javascript"