from backend import errors as err
from backend.utils import services
from backend import models
import pytest

@pytest.mark.asyncio
async def test_auth_service(auth_mock: services.AuthService):
    true_auth_model = models.AuthRequestModel(
        username="username",
        password="password"
    )
    wrong_auth_model = models.AuthRequestModel(
        username="wrong",
        password="wrong"
    )

    true_register_model = models.RegisterRequestModel(
        username="username",
        password="password",
        email="email"
    )
    wrong_register_model = models.RegisterRequestModel(
        username="wrong",
        password="wrong",
        email="wrong"
    )

    await auth_mock.auth_user(true_auth_model)
    with pytest.raises(err.UserNotFoundError) as exc:
        await auth_mock.auth_user(wrong_auth_model)
    assert exc.type == err.UserNotFoundError

    tokens = await auth_mock.register_user(true_register_model)
    with pytest.raises(err.UserExistError) as exc:
        await auth_mock.register_user(wrong_register_model)
    assert exc.type == err.UserExistError

    await auth_mock.update_auth_session(tokens.refresh_token)
    await auth_mock.blacklist.unvalidate_token(tokens.refresh_token)

    with pytest.raises(err.InvalidTokenError) as exc:
        await auth_mock.update_auth_session(tokens.refresh_token)
    assert exc.type == err.InvalidTokenError