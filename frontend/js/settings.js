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