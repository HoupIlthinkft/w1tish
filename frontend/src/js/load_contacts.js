async function load_contacts() {
    const contacts = document.getElementById("contacts");
    
    contacts.innerHTML = "";

    const chats = JSON.parse(localStorage.getItem("chats"))

    let members_chats = [];

    for (let chat in chats) {
        for (let member in chats[chat].permissions) 
            members_chats.push(member);
    }

    const data_members_chats_users = await get_data_users_ids(members_chats);
    const data_members_chats = data_members_chats_users.users;
    for (let chat in chats) {
        const contact = document.createElement("div");
        contact.classList.add("contact");

        const view_contact = document.createElement("div");
        view_contact.classList.add("view_contact");
        view_contact.id = chat;

        for (let members in chats[chat].permissions) {
            if (members != localStorage.getItem("id")) {
                let member_data = {};

                data_members_chats.forEach((member) => {
                    if (member.id == members) {
                        member_data = member;
                    } 
                });

                let member_data_avatar = await get_avatar_url_by_id(members);

                contact.id += `${members} `;

                const img = document.createElement("img");
                img.classList.add("logo");
                img.alt = "logo";
                img.src = member_data_avatar;

                const name_contact = document.createElement("p");
                name_contact.classList.add("name_contact");
                name_contact.textContent = member_data.nickname;

                view_contact.append(img, name_contact);
            }
        }
        
        const view_message = document.createElement("div");
        view_message.classList.add("view_message");
        if (chats[chat].last_message.split("<br>").length > 1) {
            view_message.innerHTML = markdownit().render(chats[chat].last_message.split("<br>")[0] + "↓"); 
        } else {
            view_message.innerHTML = markdownit().render(chats[chat].last_message);
        }
        contact.append(view_contact, view_message);
        contacts.append(contact);
    }

    clicked_contacts = document.getElementsByClassName("contact");

    for (let element = 0; element < clicked_contacts.length; element++) clicked_contacts.item(element).addEventListener("click", load_chat_container, true);
}
