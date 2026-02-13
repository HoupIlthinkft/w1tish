const socket = new WebSocket(`ws${window.ENV.API_URL.slice([4])}/ws?token=${localStorage.accessToken}`);

socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);

    const contact = document.getElementsByClassName("contact");
        
    for (let i in contact) {
        if (contact.item(i).firstChild.id == data["chat_id"]) {
            contact.item(i).getElementsByClassName("view_message").item(0).innerHTML = markdownit().render(data.content.replaceAll("<br>", " "));
            
            const contact_nicknames = [];
            for (let j in contact.item(i).getElementsByClassName("contact_nickname")) contact_nicknames.push(contact.item(i).getElementsByClassName("name_contact").item(j).textContent);
            
            const open_chat_nicknames = [];
            for (let j in document.getElementById("chat_container").getElementsByClassName("oponent_name")) open_chat_nicknames.push(document.getElementById("chat_container").getElementsByClassName("oponent_name").item(j).textContent);
            
            if ((contact_nicknames.join(" ") == open_chat_nicknames.join(" ")) && (data.sender != localStorage.id)) {

                const chat_for_oponent = document.getElementByid("chat_for_oponent");

                const message = document.createElement("div");

                if (data.sender == localStorage.id) message.className = "user message";
                    else message.className = "oponent message";


                if (document.getElementsByClassName("oponent_name").length > 1) {
                    const message_sender_header = document.createElement("div");
                    message_sender_header.className = "sender_header"

                    const oponent_data = get_data_by_user_id(data.sender);

                    const message_sender_avatar = document.createElement("img");
                    message_sender_avatar.className = "logo logo_oponent";
                    message_sender_avatar.src = get_url_avatar_by_id(data.sender);

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
