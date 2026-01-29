function starting_after() {
    autosize(document.getElementById("send_message"));
    document.getElementById("add_new_chat").addEventListener("click", open_add_chat);
    document.getElementById("close_btn").addEventListener("click", close_add_chat);
    document.getElementById("add_btn").addEventListener("click", add_user_in_invitation);
    document.getElementById("send_invitation").addEventListener("click", create_new_chat);
    document.getElementById("setting").addEventListener("click", open_settings);
    document.getElementById("close_btn_settings").addEventListener("click", close_settings);
    document.getElementById("btn_leave_account").addEventListener("click", exit_account);
}

async function get_data_by_user_id(user_id) {
    const data = await fetch((`http://localhost/api/data/user?user_id=${user_id}`), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (data.status === 200) {
        return data.json();
    } else if (data.status === 404) {
    }
}

async function get_data_users_ids(users_ids) {
    user_id = []
    for (let i in users_ids) {
        user_id.push(`user_id=${users_ids[i]}`)
    }

    const data = await fetch((`http://localhost/api/data/user?${user_id.join("&")}`), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (data.status === 200) {
        return data.json();
    } else if (data.status === 404) {
    }
}

async function get_data_by_username(username) {
    const data = await fetch((`http://localhost/api/data/user?username=${username}`), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (data.status === 200) {
        return data.json();
    } else if (data.status === 404) {
    }
}


async function load_chat(user_id, chat_id, members_chat) {
    var data = await fetch((`http://localhost/api/data/messages?chat_id=${Number(chat_id)}&offset=0&limit=50`), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
         }
    });
    data = await data.json();
    const chat_for_oponent = document.createElement("div");
    chat_for_oponent.id = "chat_for_oponent";

    if (members_chat.length == 1) {
        for (message in data.messages) {
            const message_container = document.createElement("div") 
            if (data.messages[Number(message)].sender != user_id) {
                message_container.className = "oponent message";
            } else {
                message_container.className = "user message";
            }
            message_container.textContent = data.messages[Number(message)].content;
            chat_for_oponent.append(message_container);
        }
    }
    else {
        var data_members = await get_data_users_ids(members_chat);
        for (message in data.messages) {
            const message_container = document.createElement("div") 
            if (data.messages[Number(message)].sender == user_id) {
                message_container.className = "user message";
                message_container.textContent = data.messages[Number(message)].content;
            } else {
                message_container.className = "oponent message";
             
                var sender_data = {};

                for (let i in data_members.users) {
                    if (data_members.users[i].id == data.messages[Number(message)].sender) {
                        sender_data = data_members.users[i];
                    }
                }

                const message_content = document.createElement("p");
                message_content.id = "message_content";
                message_content.textContent = data.messages[Number(message)].content
                
                const sender_header = document.createElement("div");
                sender_header.classList.add("sender_header")
                
                const sender_avatar = document.createElement("img");
                sender_avatar.className = "logo logo_oponent";
                sender_avatar.src = sender_data.avatar_url;

                const sender_nickname = document.createElement("p")
                sender_nickname.classList.add("sender_nickname");
                sender_nickname.textContent = sender_data.nickname;

                sender_header.append(sender_avatar, sender_nickname);

                message_container.append(sender_header, message_content);
            }
            
            chat_for_oponent.append(message_container);
        }
    }

    chat.innerHTML = '';
    chat.append(chat_for_oponent);

    setTimeout(() => {
        const messages = chat.querySelectorAll('.message');
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, 50);
    
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
        let response_user_info = await get_data_by_user_id(contact_id[i]);
        response_user_info = response_user_info["users"][0];
        
        const logo_oponent = document.createElement("img");
        logo_oponent.src = response_user_info.avatar_url;
        logo_oponent.alt = "logo_oponent";
        logo_oponent.className = "logo logo_oponent";
        logo_oponent.id = "logo_oponent";

        const oponent_info = document.createElement("div");
        oponent_info.classList.add("oponent_info")
        
        const oponent_name = document.createElement("p");
        oponent_name.classList.add("oponent_name");
        oponent_name.id = "oponent_name";
        oponent_name.textContent = response_user_info.nickname;

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
    parent.append(chat_container);
    if (document.getElementById("wait_event")) {
        parent.removeChild(document.getElementById("wait_event"));
    } else {
        parent.removeChild(document.getElementById("chat_container"));
    }

    document.getElementById("send_message").addEventListener('keyup', function onEvent(event) {
        if (((event.key === "Enter") && event.ctrlKey) || ((event.key === "Enter") && !(event.shiftKey))) {
            send_message()
            this.style.height = "";
        } else if ((event.key === "Enter") && (event.shiftKey)) {
            this.style.height = "";
            this.style.height = this.scrollHeight + "px"
        }
    });

    document.getElementById("message_send").addEventListener("click", send_message);
}


function load_profile() {
    document.getElementById("logo_user").src = localStorage.getItem("avatar"); 
    document.getElementById("nickname").textContent = localStorage.getItem("nickname");
    document.getElementById("user_id").textContent = localStorage.getItem("id");
    document.getElementById("setting_avatar_user").src =localStorage.getItem("avatar");
    document.getElementById("nickname_user").textContent = localStorage.getItem("nickname")
    document.getElementById("setting_user_username").textContent = localStorage.getItem("username");
    document.getElementById("setting_user_id").textContent = localStorage.getItem("id"); 
}


async function load_contacts() {
    const contacts = document.getElementById("contacts");
    
    contacts.innerHTML = "";

    const chats = JSON.parse(localStorage.getItem("chats"))

    for (let chat in chats) {
        const contact = document.createElement("div");
        contact.classList.add("contact");

        const view_contact = document.createElement("div");
        view_contact.classList.add("view_contact");
        view_contact.id = chat;

        for (let members in chats[chat].permissions) {
            if (members != localStorage.getItem("id")) {
                let member_data = await get_data_by_user_id(members);
                member_data = member_data["users"][0];
                contact.id += `${members} `;

                const img = document.createElement("img");
                img.classList.add("logo");
                img.alt = "logo";
                img.src = member_data.avatar_url;

                const name_contact = document.createElement("p");
                name_contact.classList.add("name_contact");
                name_contact.textContent = member_data.nickname;

                view_contact.append(img, name_contact);
            }
        }
        const view_message = document.createElement("div");
        view_message.classList.add("view_message");
        view_message.textContent = chats[chat].last_message; 

        contact.append(view_contact, view_message);
        contacts.append(contact);
    }

    clicked_contacts = document.getElementsByClassName("contact");

    for (let element = 0; element < clicked_contacts.length; element++) {
        clicked_contacts.item(element).addEventListener("click", load_chat_container, true);
    }
}


async function get_avatar_url_by_id(id) {
    const response = await get_data_by_user_id(id);

    if (response.status == 200) {
        const data = await response.json();
        return data["users"][0].avatar_url;
    }
}

async function get_nickname_by_id(id) {
    const response = await get_data_by_user_id(id);

    if (response.status == 200) {
        const data = await response.json();
        return data["users"][0].nickname;
    }
}


async function create_chat(oponents_id) {

    await fetch(('http://localhost/api/data/chats'), {
        method: 'POST',
        headers: {  'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
                    'Content-Type': 'application/json' },
        body: JSON.stringify({
            "members_ids": oponents_id
        })
    });
    getProtectedData();
}


async function send_message() {
    var user_id = document.getElementById("user_id").textContent; 
    var chat_id = "";
    for (let i = 0; i < document.getElementsByClassName("name_contact").length; i++) {
        if (document.getElementsByClassName("name_contact").item(i).textContent == document.getElementById("oponent_name").textContent){
            chat_id = document.getElementsByClassName("name_contact").item(i).parentNode.id;
            break;
        }
    }

    const input = document.getElementById("send_message");

    if (input.value.trim().length === 0) {
        input.value = ""
        return
    }

    const message = input.value;
    input.value = "";

    await fetch(('http://localhost/api/data/messages'), {
        method: 'POST',
        headers: {  'accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
                    'Content-Type': 'application/json' },
        body: JSON.stringify({
                    "chat_id": chat_id,
                    "content": message,
                    "sender": user_id,
                    "created_at": `${new Date(Date.now()).toJSON().slice(0, -1)}`  
                })
    });

    await load_chat(user_id, chat_id, localStorage.getItem("chat_members").split(","));
}


function open_add_chat() {
    document.getElementById("overlay").style.visibility = "visible";
    document.getElementById("settings").style.visibility = "hidden";
}

function close_add_chat() {
    let len = document.querySelectorAll(".added_user").length;
    for (let i = 0; i < len; i++) {
        document.getElementById("add_users").removeChild(document.querySelectorAll(".added_user").item(0));
    }
    document.getElementById("input_id").value = ""
    document.getElementById("overlay").style.visibility = "";
    document.getElementById("settings").style.visibility = "";
}

async function add_user_in_invitation() {
    var input_value = document.getElementById("input_id").value;
    if (input_value != "" && document.getElementById("add_users").childElementCount < 8 && input_value != document.getElementById("nickname").textContent) {
        for (let i = 0; i < document.getElementsByClassName("added_user").length; i++) {
            if (input_value == document.getElementsByClassName("added_user").item(i).getElementsByClassName("nickname_added_user").item(0).textContent){
                return
            }
        }
        for (let i = 0; i < document.getElementsByClassName("contact").length; i++){
            if (input_value == document.getElementsByClassName("name_contact").item(i).textContent) {
                return
            }
        }

        var response_user_info = await get_data_by_username(input_value);
        response_user_info = response_user_info.users[0];

        const added_user = document.createElement("div");
        added_user.classList.add("added_user");
        
        const avatar_added_user = document.createElement("img");
        avatar_added_user.src = response_user_info.avatar_url;
        avatar_added_user.classList.add("logo");

        const nickname_added_user = document.createElement("p")
        nickname_added_user.classList.add("nickname_added_user");
        nickname_added_user.textContent = response_user_info.nickname;
        nickname_added_user.value = response_user_info.id;

        const delete_user = document.createElement("i");
        delete_user.classList.add("fas", "fa-solid", "fa-times", "used_logo", "fa-2x", "delete_user");
        delete_user.alt = "delete";

        added_user.append(avatar_added_user, nickname_added_user, delete_user);
        document.getElementById("add_users").append(added_user);
        delete_user.addEventListener("click", delete_added_user);
    }
}

function create_new_chat() {
    if (document.getElementsByClassName("added_user").length != 0){
        let list = [];
        add_users = document.getElementById("add_users");
        for (let i = 0; i < add_users.childElementCount; i++) {
                list.push(add_users.getElementsByClassName("nickname_added_user").item(i).value);
            }
        create_chat(list);
        close_add_chat();
    }
}

function delete_added_user() {
    document.getElementById("add_users").removeChild(this.parentNode);
}

function open_settings() {
    document.getElementById("overlay").style.visibility = "visible";
    document.getElementById("add_chat").style.visibility = "hidden";
    if (document.getElementById("setting_avatar_user").src == "") document.getElementById("setting_avatar_user").src = localStorage.getItem("avatar_url");
    if (document.getElementById("setting_nickname").childNodes.item(0).textContent == "") document.getElementById("setting_nickname").childNodes.item(0).textContent = localStorage.getItem("nickname");
}

function close_settings() {
    document.getElementById("overlay").style.visibility = "";
    document.getElementById("add_chat").style.visibility = "";
}

async function exit_account() {
    await fetch((`http://localhost/auth/session/logout`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    localStorage.clear();
    getProtectedData();
}
