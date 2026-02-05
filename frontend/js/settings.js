function open_settings() {
    document.getElementById("overlay").style.visibility = "visible";
    document.getElementById("add_chat").style.visibility = "hidden";

    if (document.getElementById("setting_avatar_user").src == "") document.getElementById("setting_avatar_user").src = localStorage.getItem("avatar_url");
    if (document.getElementById("setting_nickname").childNodes.item(0).textContent == "") document.getElementById("setting_nickname").childNodes.item(0).textContent = localStorage.getItem("nickname");
}

function close_settings() {
    recovery_editing();

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
    edit_nickname_input.maxLength = 42;
    edit_nickname_input.placeholder = "Введите nickname";

    let approve_nickname = document.createElement("i");
    approve_nickname.id = "approve_nickname";
    approve_nickname.className = "fas fa-check used_logo";

    let cancellation = document.createElement("i");
    cancellation.id = "cancellation";
    cancellation.className = "fas fa-times used_logo";

    header.innerHTML = '';
    header.append(edit_nickname_input, approve_nickname, cancellation);

    approve_nickname.addEventListener("click", editing_nickname);
    cancellation.addEventListener("click", recovery_editing);
}

function editing_nickname() {
    let new_nickname = document.getElementById("edit_nickname_input").value;

    if (new_nickname == localStorage.getItem("nickname")) {
        return
    }

    requset_editing_nickname(new_nickname);

    localStorage.setItem("nickname", new_nickname);
    document.getElementById("nickname").textContent = new_nickname;

    recovery_editing();
}

function recovery_editing() {
    const header = document.getElementById("setting_nickname");
    
    const nickname_user = document.createElement("p");
    nickname_user.id = "nickname_user";
    nickname_user.textContent = localStorage.getItem("nickname");

    const edit_nickname_logo = document.createElement("i");
    edit_nickname_logo.className = "fas fa-pen fa-2x used_logo";
    edit_nickname_logo.id = "edit_nickname";
    

    header.innerHTML = '';
    header.append(nickname_user, edit_nickname_logo);

    edit_nickname_logo.addEventListener("click", edit_nickname);
}