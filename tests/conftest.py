from httpx import AsyncClient, ASGITransport
from concurrent.futures import ThreadPoolExecutor
from backend.utils.security import password_encrypt
from tests import mocks
from backend.utils import services
from main import app
import pytest

@pytest.fixture(scope="session")
async def async_client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac

@pytest.fixture(scope="session")
def theard_pool():
    executor = ThreadPoolExecutor(1)
    return executor

@pytest.fixture(scope="function")
def auth_mock():
    mocked_service = services.AuthService(
        mocks.AuthMock(),
        mocks.BlackListMock(),
        mocks.AvatarMock()
    )
    return mocked_service

@pytest.fixture(scope="function")
def data_mock():
    mocked_service = services.DataService(
        mocks.DataMock(),
        mocks.ChatMock(),
        mocks.MessMock(),
        mocks.AvatarMock()
    )
    return mocked_service

@pytest.fixture(scope="function")
def pass_encrypter(theard_pool):
    pass_repo = password_encrypt.PasswordEncrypterRepository(theard_pool)
    return pass_repo