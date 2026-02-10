from backend.utils.security import password_encrypt, token_generator
from backend import errors as err
import pytest
import time

def test_token_generation():
    user_id = 52
    tokens = token_generator.generate_tokens(user_id, 1, 52)
    assert user_id == token_generator.get_id_by_jwt(tokens.access_token)

    with pytest.raises(err.InvalidTokenError) as exc:
        token_generator.refresh_tokens(tokens.access_token)
    assert exc.type == err.InvalidTokenError

    time.sleep(1)    # ждём пока токен просрочится

    with pytest.raises(err.ExpiredTokenError) as exc:
        token_generator.get_id_by_jwt(tokens.access_token)
    assert exc.type == err.ExpiredTokenError

    token_generator.refresh_tokens(tokens.refresh_token)

    with pytest.raises(err.InvalidTokenError) as exc:
        token_generator.get_id_by_jwt("INVALID TOKEN")
    assert exc.type == err.InvalidTokenError


@pytest.mark.asyncio
async def test_pass_encoder(pass_encrypter: password_encrypt.PasswordEncrypterRepository):
    password = "fake_password"
    hash_pass = await pass_encrypter.encrypt_password(password)
    assert await pass_encrypter.validate_password(password, hash_pass)
