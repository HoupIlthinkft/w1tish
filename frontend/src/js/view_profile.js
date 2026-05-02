async function view_profile_user() {
    const view_profile = document.createElement("div");
    view_profile.id = "view_profile";

    const view_profile_header = document.createElement("div");
    view_profile_header.id = "view_profile_header";

    const view_profile_header_content = document.createElement("p");
    view_profile_header_content.id = "view_profile_header_content";
    view_profile_header_content.textContent = "W1tish";

    const close = document.createElement("i");
    close.className = "fas fa-solid fa-times fa-2x used_logo";
    close.id = "close_view_profile";
    
    const profile_content = document.createElement("div");
    profile_content.className = "profile_content";
    
    const data_users = await get_data_by_user_id(this.id);
    const data = data_users.users[0];

    const profile_user_logo = document.createElement("img");
    profile_user_logo.className = "profile_user_logo";
    profile_user_logo.src = await get_avatar_url_by_id(this.id);


    const profile_header_user = document.createElement("div");
    profile_header_user.className = "profile_header_user";

    const profile_nickname = document.createElement("p");
    profile_nickname.className = "profile_nickname";
    profile_nickname.textContent = data.nickname;
    
    const profile_username = document.createElement("p");
    profile_username.className = "profile_username";
    profile_username.textContent = data.username;

    const profile_id = document.createElement("p");
    profile_id.className = "profile_id";
    profile_id.textContent = data.id;


    profile_header_user.append(profile_nickname, profile_username, profile_id);
    profile_content.append(profile_user_logo, profile_header_user);
    
    view_profile_header.append(view_profile_header_content, close);
    view_profile.append(view_profile_header, profile_content);

    document.getElementById("overlay").append(view_profile);
    overlay.style.visibility = "visible";

    close.addEventListener("click", close_view_profile);
}

async function close_view_profile() {
    const overlay = document.getElementById("overlay");

    overlay.removeChild(document.getElementById("view_profile"));
    overlay.style.visibility = "hidden";
}
