function starting_after() {
    autosize(document.getElementById("send_message"));
    document.getElementById("add_new_chat").addEventListener("click", open_add_chat);
    document.getElementById("close_btn").addEventListener("click", close_add_chat);
    document.getElementById("add_btn").addEventListener("click", add_user_in_invitation);
    document.getElementById("send_invitation").addEventListener("click", create_new_chat);
    document.getElementById("setting").addEventListener("click", open_settings);
    document.getElementById("close_btn_settings").addEventListener("click", close_settings);
    document.getElementById("btn_leave_account").addEventListener("click", exit_account);
    document.getElementById("edit_nickname").addEventListener("click", edit_nickname);
    document.getElementById("edit_avatar").addEventListener("change", edit_avatar);
}


function load_profile() {
    document.getElementById("logo_user").src = localStorage.getItem("avatar"); 
    document.getElementById("nickname").textContent = localStorage.getItem("nickname");
    document.getElementById("user_username").textContent = "  " + localStorage.getItem("username");
    document.getElementById("setting_avatar_user").src = localStorage.getItem("avatar");
    document.getElementById("nickname_user").textContent = localStorage.getItem("nickname")
    document.getElementById("setting_user_username").textContent = localStorage.getItem("username");
    document.getElementById("setting_user_id").textContent = localStorage.getItem("id"); 
}

async function send_message() {
    var user_id = localStorage.id; 
    var chat_id = "";

    let contact_names = []; 
    let chat_names = [];

    for (let i = 0; i < document.getElementsByClassName("contact").length; i++) {
        for (let j = 0; j < document.getElementsByClassName("contact").item(i).getElementsByClassName("name_contact").length; j++) contact_names.push(document.getElementsByClassName("contact").item(i).getElementsByClassName("name_contact").item(j).textContent);
        for (let c = 0; c < document.getElementsByClassName("oponent_name").length; c++) chat_names.push(document.getElementsByClassName("oponent_name").item(c).textContent);
         
        if (JSON.stringify(contact_names) == JSON.stringify(chat_names)) {
            chat_id = document.getElementsByClassName("contact").item(i).firstElementChild.id;
            break;
        }
        
        contact_names = [];
        chat_names = [];
    }   

    const input = document.getElementById("send_message");

    if (input.value.trim().length === 0) {
        input.value = "";
        return
    }

    var message = input.value;
    message = DOMPurify.sanitize(message, { ALLOWED_TAGS: [] });
    message = message.replaceAll("\n", "<br>");

    for (let i = 0; i < message.length / 4; i++) {
        if (message.slice(0, 4) == "<br>") message = message.slice(4, );  
            else if (message.slice(-4) == "<br>") message = message.slice(0, -4);
                else break;
    }

    input.value = "";

    send_new_message(chat_id, message, user_id);

    setTimeout(() => {
        load_chat(user_id, chat_id, localStorage.getItem("chat_members").split(","))
    }, 50);
}


