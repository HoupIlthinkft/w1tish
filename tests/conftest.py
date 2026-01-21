import pytest
from httpx import AsyncClient, ASGITransport
from main import app
import os

@pytest.fixture
async def async_client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac

@pytest.fixture(scope="session", autouse=True)
def set_env_vars_for_all_tests():
    os.environ["JWT_SECRET"] = "iWjwGUtt-DUeNb_QU8Oypc4jUZJX_FQflzpDzQTF9vA="
    yield