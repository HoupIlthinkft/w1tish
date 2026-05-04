import { useState } from "react";

import { useProfileStore } from "../configurationFiles/config.ts";

import { get_data_users_ids, get_avatar_url_by_id } from "../configurationFiles/requests.ts";

async function load_contacts() {
    const [count, setCount] = useState(-1);

    const userData = useProfileStore.getState().profile;

    let members_chats = [];

    for (let chat in userData.chats) {
        for (let member in userData.chats[chat].permissions) 
            members_chats.push(member);
    }
    
    const data_members_chats_users = await get_data_users_ids(members_chats);
    const data_members_chats = data_members_chats_users.users;


    return (
        <div>
            {
                userData.chats.map((el, index) => (
                    <div key={index}>
                        <div>
                            {
                                el.permissions.map((member, index) => (
                                    setCount(count + 1),
                                    member != userData.id ? (
                                        <div>
                                            <img src={await get_avatar_url_by_id(member)} />
                                            <p>{data_members_chats[count]}</p>
                                        </div>
                                    ) : ""
                                ))
                            }
                        </div>
                        <div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
        
        const view_message = document.createElement("div");
        view_message.classList.add("view_message");
        if (chats[chat].last_message.split("<br>").length > 1) {
            view_message.innerHTML = markdownit().render(chats[chat].last_message.split("<br>")[0] + "↓"); 
        } else {
            view_message.innerHTML = markdownit().render(chats[chat].last_message);
        }
        contact.append(view_contact, view_message);
        contacts.append(contact);

    clicked_contacts = document.getElementsByClassName("contact");

    for (let element = 0; element < clicked_contacts.length; element++) clicked_contacts.item(element).addEventListener("click", load_chat_container, true);
}

