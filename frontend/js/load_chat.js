async function load_chat(user_id, chat_id, members_chat) {
    var data = await request_get_messages(chat_id);

    const chat_for_oponent = document.createElement("div");
    chat_for_oponent.id = "chat_for_oponent";

    if (members_chat.length == 1) {
        for (let message in data.messages) {
            const message_container = document.createElement("div") 

            if (data.messages[Number(message)].sender != user_id) message_container.className = "oponent message";
                else message_container.className = "user message";

            message_container.textContent = data.messages[Number(message)].content;
            chat_for_oponent.append(message_container);
        }
    }
    else {
        var data_members = await get_data_users_ids(members_chat);
        for (let message in data.messages) {
            const message_container = document.createElement("div") 
            if (data.messages[Number(message)].sender == user_id) {
                message_container.className = "user message";
                message_container.textContent = data.messages[Number(message)].content;
            } else {
                message_container.className = "oponent message";
             
                var sender_data = {};

                for (let i in data_members.users) {
                    if (data_members.users[i].id == data.messages[Number(message)].sender) sender_data = data_members.users[i];
                }

                const message_content = document.createElement("p");
                message_content.id = "message_content";
                message_content.textContent = data.messages[Number(message)].content
                
                const sender_header = document.createElement("div");
                sender_header.classList.add("sender_header")
                
                const sender_avatar = document.createElement("img");
                sender_avatar.className = "logo logo_oponent";
                sender_avatar.src = await get_avatar_url_by_id(sender_data.id);

                const sender_nickname = document.createElement("p")
                sender_nickname.classList.add("sender_nickname");
                sender_nickname.textContent = sender_data.nickname;

                sender_header.append(sender_avatar, sender_nickname);

                message_container.append(sender_header, message_content);
            }
            
            chat_for_oponent.append(message_container);
        }
    }
    
    const chat = document.getElementById("chat");

    setTimeout(() => {
        chat.innerHTML = '';
        chat.append(chat_for_oponent);
        
        scrollBottom();
    }, 100);
}

async function load_chat_container() {
    // Создание контейнера чата
    const chat_container = document.createElement("div");
    chat_container.id = "chat_container";


    const oponent_header = document.createElement("div");
    oponent_header.classList.add("oponent_header");
    
    const contact_id = this.id.split(" ").slice(0, -1);
    localStorage.setItem("chat_members", contact_id);

    for (let i in contact_id) {
        let response_user_avatar = await get_avatar_url_by_id(contact_id[i]);
        let response_user_nickname = await get_nickname_by_id(contact_id[i]);
        
        const logo_oponent = document.createElement("img");
        logo_oponent.src = response_user_avatar;
        logo_oponent.alt = "logo_oponent";
        logo_oponent.className = "logo logo_oponent";
        logo_oponent.id = "logo_oponent";

        const oponent_info = document.createElement("div");
        oponent_info.classList.add("oponent_info")
        
        const oponent_name = document.createElement("p");
        oponent_name.classList.add("oponent_name");
        oponent_name.id = "oponent_name";
        oponent_name.textContent = response_user_nickname;

        const oponent_state = document.createElement("p");
        oponent_state.classList.add("state_oponent");
        oponent_state.textContent = ""; // TODO получать состояние опонента из запроса

        oponent_info.append(oponent_name, oponent_state);
        oponent_header.append(logo_oponent, oponent_info);
    }

    const chat = document.createElement("div");
    chat.id = "chat";

    load_chat(document.getElementById("user_id").textContent, document.getElementById(this.id).firstElementChild.id, contact_id);

    const send = document.createElement("div");
    send.id = "send";

    const message_send = document.createElement("textarea");
    message_send.id = "send_message";
    message_send.placeholder = "Сообщение...";
    message_send.maxlength = "1000";
    message_send.rows = "1";

    const send_img = document.createElement("i");
    send_img.alt = "send";
    send_img.classList.add("fas", "fa-solid", "fa-paper-plane", "fa-2x", "used_logo");
    send_img.id = "message_send";

    send.append(message_send, send_img);


    chat_container.append(oponent_header, chat, send);

    const parent = document.getElementById("main_container");
    
    setTimeout(parent.append(chat_container), 1000);
    
    scrollBottom();

    if (document.getElementById("wait_event")) parent.removeChild(document.getElementById("wait_event"));
        else parent.removeChild(document.getElementById("chat_container"));

    document.getElementById("send_message").addEventListener('keyup', function onEvent(event) {
        this.style.height = "";

        if (((event.key === "Enter") && event.ctrlKey) || ((event.key === "Enter") && !(event.shiftKey))) send_message();
            else if ((event.key === "Enter") && (event.shiftKey)) this.style.height = this.scrollHeight + "px";

    });

    document.getElementById("message_send").addEventListener("click", send_message);
}


function scrollBottom() {
    const chat = document.getElementById("chat");

    const messages = chat.querySelectorAll('.message');
    
    if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        lastMessage.scrollIntoView({ behavior: 'instant', block: 'end' });
    }
}