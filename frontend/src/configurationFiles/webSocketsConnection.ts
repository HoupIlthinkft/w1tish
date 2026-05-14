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
    if (data.type == 1) {
      if (useChatStore.getState().activityChat == data.chat_id) {
        useChatStore.getState().addChatStory(data);
      }
    } else if (data.type == 'error') {
      console.log(data);
    } else {
      get_data_users_ids(Object.keys(data.content.permissions)).then((value) => {
        value.users.forEach((el) =>
          useContactStore.getState().contacts.every((member) => member.id != el.id)
            ? useContactStore.getState().addContact(el)
            : '',
        );
        useProfileStore.getState().addContact(data.content);
      });
    }
  });
}

export function send_new_message(
  type: string,
  content: string,
  sender: string,
  reciver: string,
  chat_id: string,
) {
  console.log('сообщение отправлено');

  client.send(
    JSON.stringify({
      type: type,
      content: content,
      sender: sender,
      reciver: reciver,
      chat_id: chat_id,
    }),
  );

  if (useChatStore.getState().activityChat == chat_id) {
    useChatStore.getState().addChatStory({
      type: type,
      content: content,
      sender: sender,
      reciver: reciver,
      chat_id: chat_id,
    });
  }
}
