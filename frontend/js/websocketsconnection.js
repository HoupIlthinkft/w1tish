const socket = new WebSocket(window.ENV.API_URL);

socket.addEventListener("message", (event) => {
    console.log(event.data);

    const contact = document.getElementsByClassName("contact");
        
    for (let i in contact) {
        if (contact.item(i).firstChildElement.id == event.data.chat_id) {

            contact.item(i).getElementsByClassName("view_message").item(0).innerHTML = markdownit().render(event.data.message.replaceAll("<br>", " ")), break;
            
            const contact_nicknames = [];
            contact.item(i).getElementsByClassName("contact_nickname").forEach((e) => contact_nicknames.push(e.textContact));
            
            const open_chat_nicknames = [];
            document.getElementByid("oponent_header").getElementsByClassName("oponent_name").forEach((e) => open_chat_nicknames.push(e.textContent));
            
            if (contact_nicknames.join(" ") != open_chat_nicknames.join(" ")) return;

            const chat_for_oponent = document.getElementByid("chat_for_oponent");

            const message = document.createElement("div");

            if (event.data.sender_id == localStorage.id) message.className = "user message";
                else message.className = "oponent message";


            if (document.getElementsByClassName("oponent_name").length > 1) {
                const message_sender_header = document.createElement("div");
                message_sender_header.className = "sender_header"

                const oponent_data = get_data_by_user_id(event.data.sender_id);

                const message_sender_avatar = document.createElement("img");
                message_sender_avatar.className = "logo logo_oponent";
                message_sender_avatar.src = get_url_avatar_by_id(event.data.sender_id);

                const message_sender_nickname = document.createElement("p");
                message_sender_nickname.textContent = oponent_data.users[0].id;
                message_sender_nickname.className = "sender_nickname";
        
                message_sender_header.append(message_sender_avatar, message_sender_nickname);

                message.append(message_sender_header);
            }
    

            const message_content = document.createElement("div");

            let row_format = [];
            let code = "";
            for (let row in data.messages[Number(message)].content.split("<br>")) {
                if ((data.messages[Number(message)].content.split("<br>")[row].split("```").length == 2) || (code.includes("```"))) {
                                
                    code += `${data.messages[Number(message)].content.split("<br>")[row]}`;

                    if (data.messages[Number(message)].content.split("<br>")[row] != "```") code += "<br>";

                    if ((code.split("```").length > 2) && (data.messages[Number(message)].content.split("<br>")[row].includes("```"))) row_format.push(markdownit({html: true, breaks: true}).render(code).replaceAll("&lt;br&gt;", "<br>")), code = "";
            
                    continue
                }
                row_format.push(markdownit({html: true, breaks: true}).render(data.messages[Number(message)].content.split("<br>")[row]));
            }    
    
            message_content.innerHTML = row_format.join("");
            message.append(message_content)
    
            chat_for_oponent.append(message);
        }
    }

})

function send_new_message(chat_id, message, user_id) {
    socket.send(JSON.stringify({
                        "chat_id": chat_id,
                        "content": message,
                        "sender": user_id,
                        "created_at": `${new Date(Date.now()).toJSON().slice(0, -1)}`  
            }));
}
