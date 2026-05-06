import { useProfileStore } from "./config.ts";

export function create_connection() {
    window.socket = new WebSocket(`ws${window.ENV.API_URL.slice([4])}/ws?token=${localStorage.accessToken}`);
    
    let socket = window.socket;

    socket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);

        if (data.type == "message") {
            useProfileStore.getState().addMessage(data.content);
            if (useChatStore.getState().activityChat == data.content["chat_id"]) {
                useChatStore.getState().addChatStory(data.content);
            }
        } else useProfileStore.getState().addContact(JSON.parse(event.data).content);
    });
    

    socket.addEventListener("error", () => {
        window.socket = new WebSocket(`ws${window.ENV.API_URL.slice([4])}/ws?token=${localStorage.accessToken}`);
        socket = window.socket;
    });
}

export function send_new_message(chat_id, message, user_id) {
    window.socket.send(JSON.stringify({
                        "chat_id": chat_id,
                        "content": message,
                        "sender": user_id,
                        "created_at": `${new Date(Date.now()).toJSON().slice(0, -1)}`  
    }));
}



