function create_connection() {
    window.socket = new WebSocket(`ws${window.ENV.API_URL.slice([4])}/ws?token=${localStorage.accessToken}`);
    
    const socket = window.socket;

    socket.addEventListener("message", (event) => {

        if (JSON.parse(event.data).type == "message") {
            
            const data = JSON.parse(event.data).content;
            
            const contact = document.getElementsByClassName("contact");

            for (let i in contact) {
                if (contact.item(i).firstChild.id == data["chat_id"]) {
                    if (data.content.split("<br>").length > 1) {
                        contact.item(i).getElementsByClassName("view_message").item(0).innerHTML = markdownit().render(data.content.split("<br>")[0] + "↓");
                    }
                    else {
                        contact.item(i).getElementsByClassName("view_message").item(0).innerHTML = markdownit().render(data.content);
                    };
                                    
                    if (document.getElementById("chat").value == data.chat_id) {
                    
                        const chat_for_oponent = document.getElementById("chat_for_oponent");

                        const message = document.createElement("div");

                        if (data.sender == localStorage.id) message.className = "user message";
                            else {
                                message.className = "oponent message";

                                if (document.getElementsByClassName("oponent_name").length > 1) {
                                    const message_sender_header = document.createElement("div");
                                    message_sender_header.className = "sender_header"

                                    get_data_by_user_id(data.sender).then((oponent_data) => {

                                    const message_sender_avatar = document.createElement("img");
                                    message_sender_avatar.className = "logo logo_oponent";
                                    get_avatar_url_by_id(data.sender).then((url) => message_sender_avatar.src = url);

                                    const message_sender_nickname = document.createElement("p");
                                    message_sender_nickname.textContent = oponent_data.users[0].nickname;
                                    message_sender_nickname.className = "sender_nickname";
                            
                                    message_sender_header.append(message_sender_avatar, message_sender_nickname);

                                    message.append(message_sender_header);
                                    });
                                }
                            }


                        const message_content = document.createElement("div");

                        let row_format = [];
                        let code = "";
                        for (let row in data.content.split("<br>")) {
                            if ((data.content.split("<br>")[row].split("```").length == 2) || (code.includes("```"))) {
                                                                    
                                code += `${data.content.split("<br>")[row]}`;

                                if (data.content.split("<br>")[row] != "```") code += "<br>";

                                if ((code.split("```").length > 2) && (data.content.split("<br>")[row].includes("```"))) row_format.push(markdownit({html: true, breaks: true}).render(code).replaceAll("&lt;br&gt;", "<br>")), code = "";
                                                
                                continue
                            }
                            row_format.push(markdownit({html: true, breaks: true}).render(data.content.split("<br>")[row]));
                        }    

                        message_content.innerHTML = row_format.join("");
                        message.append(message_content);

                        chat_for_oponent.append(message);
                    }
                    scrollBottom();
                    break 
            
                }
            }
        }

        else create_contact(JSON.parse(event.data).content);
    });
}

function send_new_message(chat_id, message, user_id) {
    window.socket.send(JSON.stringify({
                        "chat_id": chat_id,
                        "content": message,
                        "sender": user_id,
                        "created_at": `${new Date(Date.now()).toJSON().slice(0, -1)}`  
    }));
}


async function create_contact(data) {
    const contacts = document.getElementById("contacts");

    const contact = document.createElement("div");
    contact.className = "contact";

    let contact_id = [];

    for (let id in data.permissions) if (document.getElementById("setting_user_id").textContent != id) contact_id.push(id);

    contact.id = contact_id.join(" ") + " ";
    
    const data_members_chat = await get_data_users_ids(contact_id);

    const view_contact = document.createElement("div");
    view_contact.className = "view_contact";
    view_contact.id = data.id;

    for (let member in data_members_chat["users"]) {
        const logo = document.createElement("img");
        logo.className = "logo";
        logo.alt = "logo";
        logo.src = await get_avatar_url_by_id(data_members_chat.users[member].id);

        const name_contact = document.createElement("p");
        name_contact.className = "name_contact";
        name_contact.textContent = data_members_chat.users[member].nickname;


        view_contact.append(logo, name_contact);
    }

    const view_message = document.createElement("div");
    view_message.className = "view_message";

    const view_message_content = document.createElement("p");
    view_message_content.innerHTML = "<i>Чат создан</i>";

    view_message.append(view_message_content);

    contact.append(view_contact, view_message);

    contacts.append(contact);

    contact.addEventListener("click", load_chat_container, true);
}
