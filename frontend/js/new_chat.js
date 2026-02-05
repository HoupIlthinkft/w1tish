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


        var response_user_info = await get_data_by_username(input_value);
        if (response_user_info == null) return

        response_user_info = response_user_info.users[0];

        var user_avatar = await get_avatar_url_by_id(response_user_info.id);


        const added_user = document.createElement("div");
        added_user.classList.add("added_user");
        
        const avatar_added_user = document.createElement("img");
        avatar_added_user.src = user_avatar;
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
        let list_id = [];
        let list_nickname = [];
        add_users = document.getElementById("add_users");

        for (let i = 0; i < add_users.childElementCount; i++) {
            list_id.push(add_users.getElementsByClassName("nickname_added_user").item(i).value);
            list_nickname.push(add_users.getElementsByClassName("nickname_added_user").item(i).textContent);
        }


        var list_contact = [];

        for (let i = 0; i < document.getElementsByClassName("contact").length; i++){
            for (let j = 0; j < document.getElementsByClassName("contact").item(i).getElementsByClassName("name_contact").length; j++) {
                list_contact.push(document.getElementsByClassName("contact").item(i).getElementsByClassName("name_contact").item(j).textContent);
            }

            if (JSON.stringify(list_contact.sort()) == JSON.stringify(list_nickname.sort())) {
                return
            }

            list_contact = [];
        }
        

        create_chat(list_id);
        close_add_chat();
    }
}

async function create_chat(oponents_id) {
    request_create_new_chat(oponents_id);
    getProtectedData();
}