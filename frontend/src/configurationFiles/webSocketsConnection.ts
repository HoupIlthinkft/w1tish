import { useDataStore, useProfileStore, useChatStore, useContactStore } from './config.ts';
import { get_data_users_ids } from './requests.ts';
import { WSClient } from './web_interface.ts';

const client = new WSClient();

export function createConnection() {
  const accessToken = useDataStore.getState().accessToken;
  client.connect(accessToken);

  client.onMessage((data) => {
    data = JSON.parse(data);

    console.log(data);
    if (data.type == 'message') {
      if (useChatStore.getState().activityChat == data.content.chat_id) {
        useChatStore.getState().addChatStory(data.content);
        useProfileStore.getState().setLastMessage(data.content.content, data.content.chat_id);
      }
    } else if (data.type == 'error') {
      console.log(data);
    } else if (data.type == 'chat') {
      get_data_users_ids([
        Object.keys(data.content.permissions).find(
          (el) => el != useProfileStore.getState().profile.id,
        ),
      ]).then((value) => {
        useContactStore.getState().addContact(value[0]);
        useProfileStore.getState().addContact({
          chat_id: data.content.id,
          last_message: '_Чат создан_',
          last_message_time: new Date().toJSON(),
          last_message_author: '0',
          permissions: Object.keys(data.content.permissions),
        });
        console.log(useProfileStore.getState().profile.chats);
      });
    }
  });
}

export function closeConnection() {
  client.close();
}

export function send_new_message(chat_id: string, content: string) {
  console.log('сообщение отправлено');

  client.send(
    JSON.stringify({
      chat_id: chat_id,
      content: content,
    }),
  );
}
