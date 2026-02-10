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

    with pytest.raises(err.InvalidTokenError) as exc:
        token_generator.get_id_by_jwt("INVALID TOKEN")
    assert exc.type == err.InvalidTokenError