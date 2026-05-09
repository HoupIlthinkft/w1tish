import { useDataStore, useProfileStore, useChatStore, useContactStore } from "./config.ts";
import { get_data_users_ids } from "./requests.ts";
import { WSClient } from "./web_interface.ts";

const client = new WSClient();

export function createConnection() {
    const accessToken = useDataStore.getState().accessToken;

    client.connect(accessToken);
    
    client.onMessage((data) => {
        data = JSON.parse(data);

        if (data.type == "message") {
            useProfileStore.getState().addMessage(data.content);
                
            if (useChatStore.getState().activityChat == data.content["chat_id"]) {               
                useChatStore.getState().addChatStory(data.content);
            }
        } else {
            get_data_users_ids(Object.keys(data.content.permissions)).then(value => {
                value.users.forEach((el) => useContactStore.getState().contacts.every(member => member.id != el.id) ? useContactStore.getState().addContact(el) : "");
                useProfileStore.getState().addContact(data.content);
            })
        }
    });
}

export function send_new_message(chat_id, message, user_id) {
    console.log("сообщение отправлено");
        
    client.send(JSON.stringify({
                        "chat_id": chat_id,
                        "content": message,
                        "sender": user_id,
                        "created_at": `${new Date(Date.now()).toJSON().slice(0, -1)}`  
    }));
}



