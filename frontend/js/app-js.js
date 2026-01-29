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


function load_profile() {
    document.getElementById("logo_user").src = localStorage.getItem("avatar"); 
    document.getElementById("nickname").textContent = localStorage.getItem("nickname");
    document.getElementById("user_id").textContent = localStorage.getItem("id");
    document.getElementById("setting_avatar_user").src =localStorage.getItem("avatar");
    document.getElementById("nickname_user").textContent = localStorage.getItem("nickname")
    document.getElementById("setting_user_username").textContent = localStorage.getItem("username");
    document.getElementById("setting_user_id").textContent = localStorage.getItem("id"); 
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

    request_add_new_message(chat_id, message, user_id);

    load_chat(user_id, chat_id, localStorage.getItem("chat_members").split(","));
}
