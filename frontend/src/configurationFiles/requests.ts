import { useDataStore, useProfileStore } from './config.ts';
import { createConnection } from './webSocketsConnection.ts';
import { callNotification } from '../Notification/notifications.tsx';
import { makeRequest } from '@api';

export async function register_user(username, email, password) {
  const response = await makeRequest('/web/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  if (response.status === 201) {
    const data = await response.json();
    useDataStore.getState().setAccessToken(data.access_token);
    getProtectedData();
  } else if (response.status === 409)
    callNotification('Вы ввели занятый логин/почту, введите другие значения', 'error');
  else callNotification('Ошибка сервера: ' + response.status, 'error');
}

export async function login(username, password) {
  const response = await makeRequest('/web/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (response.status === 422) console.log('Виноват фронтендер');
  else if (response.status === 404)
    callNotification('Данного юзера не существует, зарегистрируйтесь', 'error');
  else if (response.status === 500)
    callNotification('Сервер лег поспать, попробуйте позже', 'error');
  else if (response.status === 200) {
    const data = await response.json();

    useDataStore.getState().setAccessToken(data.access_token);
    getProtectedData();
  } else if (response.status === 401) {
    callNotification(
      'Введен неверный логин или пароль, попробуйте ввести правильный логин/пароль',
      'error',
    );
  } else callNotification('Ошибка сервера: ' + response.status, 'error');
}

export async function getProtectedData() {
  const accessToken = useDataStore.getState().accessToken;
  if (accessToken == null) await refreshToken();
  else {
    useProfileStore.getState().setProfile(null);
    useDataStore.getState().setAccessToken(accessToken);

    const response = await makeRequest('/web/data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401 || response.status === 422) {
      await refreshToken();
    } else if (response.status === 500) {
      callNotification('Сервер лег поспать, попробуйте позже', 'error');
    } else if (response.status === 404) {
      useDataStore.getState().setAccessToken(null);
      callNotification(
        'Пользователя с данным логином/почтой не существует, попробуйте зарегистрироваться',
        'error',
      );
    } else {
      const data = await response.json();

      useProfileStore.getState().setProfile({
        username: data.username,
        nickname: data.nickname,
        avatar_url: data.avatar_url,
        chats: data.chats,
        id: data.id,
      });

      createConnection();
    }
  }
}

export async function refreshToken() {
  const response = await makeRequest('/web/auth/session/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  console.log(response.status);
  if (response.status === 200) {
    const data = await response.json();
    useDataStore.getState().setAccessToken(data.access_token);
    getProtectedData();
  } else if (response.status === 500) {
    callNotification('Сервер лег поспать, попробуйте позже', 'error');
  } else if (response.status === 422 || response.status === 401) {
    useDataStore.getState().setAccessToken(null);
  }
}

export async function request_add_new_message(chat_id, message, user_id) {
  const data = await makeRequest('/web/data/messages', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${useDataStore.getState().accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });

  if (data.status === 401 || data.status === 422) {
    await refreshToken();
    request_add_new_message(chat_id, message, user_id);
  }
}

export async function request_get_messages(chat_id, offset = 0) {
  const data = await makeRequest(
    `/web/data/messages?chat_id=${String(chat_id)}&offset=${offset}&limit=50`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${useDataStore.getState().accessToken}`,
      },
    },
  );

  if (data.status === 200) return data.json();
  else if (data.status === 422) console.log('422 Validation Error');
  else if (data.status === 401) refreshToken();
  else console.log(data.status, data.statusText);
}

export async function request_create_new_chat(oponents_id) {
  const profile = useProfileStore.getState().profile;

  const response = await makeRequest('/web/data/chats', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${useDataStore.getState().accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      members_ids: [profile.id, oponents_id],
    }),
  });

  if (response.status === 401 || response.status === 422) {
    await refreshToken();
    await request_create_new_chat(oponents_id);
  } else if (response.status === 409) {
    callNotification(
      'Чат с таким набором пользователей уже существует, добавьте иного пользователя/удалите ненужного',
      'error',
    );
  } else if (response.status === 201) {
    callNotification('Чат создан, желаем плодотворного общения :)', 'success');
  }
}

export async function request_reset_token() {
  await makeRequest('/web/auth/session/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function requset_editing_nickname(new_nickname) {
  if (new_nickname != useProfileStore.getState().profile.nickname) {
    await makeRequest('/web/data/nickname', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${useDataStore.getState().accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nickname: new_nickname,
      }),
    });
  }
}

export async function requset_editing_avatar(new_avatar) {
  const response = await makeRequest('/web/data/avatar', {
    method: 'PATCH',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${useDataStore.getState().accessToken}`,
    },
    body: new_avatar,
  });

  if (response.status === 422 || response.status === 401) getProtectedData();
  if (response.status == 200)
    callNotification(
      'Ваша новая, новаторская, современная, наикрутейшая аватарка успешно поставлена',
      'success',
    );
  else return response.status;
}

export async function get_data_by_user_id(user_id) {
  const data = await makeRequest(`/web/data/user?user_id=${user_id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (data.status === 200) return data.json();
  else if (data.status === 404) return null;
  else callNotification(`Ошибка сервера: ${data.status}`, 'error');
}

export async function get_data_users_ids(users_ids) {
  const user_id = [];

  for (const i in users_ids) {
    user_id.push(`user_id=${users_ids[i]}`);
  }

  const data = await makeRequest(`/web/data/user?${user_id.join('&')}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (data.status === 200) return data.json();
  else if (data.status === 404) return null;
  else callNotification(`Ошибка сервера: ${data.status}`, 'error');
}

export async function get_data_by_username(username) {
  const data = await makeRequest(`/web/data/user?username=${username}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (data.status === 200) return data.json();
  else if (data.status === 404)
    callNotification('Пользователя с данным username не существует', 'error');
  else callNotification(`Ошибка сервера: ${data.status}`, 'error');
}

export function get_avatar_url_by_id(id) {
  return `/avatars/${id}.jpeg`;
}

export async function get_nickname_by_id(id) {
  const data = await get_data_by_user_id(id);
  return data['users'][0].nickname;
}
