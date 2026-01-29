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

function delete_added_user() {
    document.getElementById("add_users").removeChild(this.parentNode);
}

function create_new_chat() {
    if (document.getElementsByClassName("added_user").length != 0) {
        let list = [];
        add_users = document.getElementById("add_users");

        for (let i = 0; i < add_users.childElementCount; i++) list.push(add_users.getElementsByClassName("nickname_added_user").item(i).value);
        
        create_chat(list);
        close_add_chat();
    }
}

async function create_chat(oponents_id) {
    request_create_new_chat(oponents_id);
    getProtectedData();
}