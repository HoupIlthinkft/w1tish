from backend import errors as err
from backend.utils import services
from backend import models
from io import BytesIO
import pytest
import datetime

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


@pytest.mark.asyncio
async def test_add_message(data_mock: services.DataService):
    true_addmessage_request = models.MessageModel(
        chat_id="52",
        sender=42,
        content="message",
        created_at=datetime.datetime.isoformat(datetime.datetime.now())
    )
    wrong_addmessage_request = models.MessageModel(
        chat_id="",
        sender=42,
        content="message",
        created_at=datetime.datetime.isoformat(datetime.datetime.now())
    )
    await data_mock.add_message(42, true_addmessage_request)
    with pytest.raises(err.InvalidArgumentsError) as exc:
        await data_mock.add_message(42, wrong_addmessage_request)
    assert exc.type == err.InvalidArgumentsError

    wrong_addmessage_request.chat_id = "1488"
    with pytest.raises(err.NoWritePermissionError) as exc:
        await data_mock.add_message(42, wrong_addmessage_request)
    assert exc.type == err.NoWritePermissionError

@pytest.mark.asyncio
async def test_data_repo(data_mock: services.DataService):
    add_chat_request = models.CreateChatRequestModel(
        members_ids=[42, 52, 67]
    )
    await data_mock.add_chat(52, add_chat_request)

    await data_mock.get_messages(52, "42", 1, 1)
    with pytest.raises(err.NoReadPermissionError) as exc:
        await data_mock.get_messages(52, "1488", 1, 1)
    assert exc.type == err.NoReadPermissionError

    await data_mock.get_user_data(52)
    await data_mock.get_users_data([52, 42])
    await data_mock.get_users_data(users_usernames=["52", "42"])

    with pytest.raises(err.InvalidArgumentsError) as exc:
        await data_mock.get_users_data([42, 52], ["42", "52"])
    assert exc.type == err.InvalidArgumentsError

    with pytest.raises(err.InvalidArgumentsError) as exc:
        await data_mock.get_users_data()
    assert exc.type == err.InvalidArgumentsError

    await data_mock.set_avatar(BytesIO(b"1"*1024*1024*5), 52)
    with pytest.raises(err.TooBigFileError) as exc:
        await data_mock.set_avatar(BytesIO(b"52"*1024*1024*5), 52)
    assert exc.type == err.TooBigFileError

    await data_mock.set_nickname("nickname", 52)
    with pytest.raises(err.TooLongError) as exc:
        await data_mock.set_nickname("nickname"*10, 52)
    assert exc.type == err.TooLongError