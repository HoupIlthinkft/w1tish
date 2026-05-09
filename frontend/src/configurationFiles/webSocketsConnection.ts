import { useDataStore, useProfileStore, useChatStore } from "./config.ts";
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
        } else useProfileStore.getState().addContact(data.content);
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



