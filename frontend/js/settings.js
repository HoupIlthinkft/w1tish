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
    request_reset_token();
    localStorage.clear();
    
    setTimeout(getProtectedData, 50);
}

function edit_nickname() {
    const header = document.getElementById("setting_nickname");

    let edit_nickname_input = document.createElement("input");
    edit_nickname_input.id = "edit_nickname_input";
    edit_nickname_input.type = "text";
    edit_nickname_input.value = localStorage.getItem("nickname");

    let approve_nickname = document.createElement("button");
    approve_nickname.id = "approve_nickname";
    approve_nickname.textContent = "Утвердить";

    header.innerHTML = '';
    header.append(edit_nickname_input, approve_nickname);

    approve_nickname.addEventListener("click", editing_nickname);
}

function editing_nickname() {
    let new_nickname = document.getElementById("edit_nickname_input").value;

    requset_editing_nickname(new_nickname);

    localStorage.setItem("nickname", new_nickname);
    document.getElementById("nickname").textContent = new_nickname;

    const header = document.getElementById("setting_nickname");

    let nickname_user = document.createElement("p");
    nickname_user.id = "nickname_user";
    nickname_user.textContent = new_nickname;

    let icon_edit_nickname = document.createElement("i");
    icon_edit_nickname.className = "fas fa-pen fa-2x used_logo";

    header.innerHTML = '';
    header.append(nickname_user, icon_edit_nickname);
}