import { useEffect } from "react";

import { useProfileStore, useContactStore } from "../configurationFiles/config.ts";
import { get_data_users_ids } from "../configurationFiles/requests.ts";
import { ContactComponent } from "../MainPage/contact.tsx";

export function ContactsListComponent() {
    const profile = useProfileStore((state) => state.profile);
    const userContact = useProfileStore((state) => state.profile.chats);

    const usersData = useContactStore((state) => state.contacts);

    useEffect(() => {
        if (JSON.stringify(userContact) == "{}" || userContact == undefined) return;

        const usersInContact = Object.entries(userContact).map((chat) => chat[1].find(member => member != profile.id));
        
        get_data_users_ids(Array.from(usersInContact)).then((value) => {
            useContactStore.getState().setContacts(value.users);
            console.log(useContactStore.getState().contacts);
    });
    }, [])
    

    return (
        JSON.stringify(usersData) != '[]' ? (
        <div className="h-[100%] w-[100%] gap-[clamp(5px,1vh,10px)] flex flex-col bg-white rounded-[15px] overflow-y-auto px-[clamp(5px,1vw,20px)] py-[clamp(5px,2vh,20px)]">
            {
                Object.entries(userContact).map((contact) => (
                    <ContactComponent key={contact[0]} contact={contact}/>
                ))
            }
        </div>
        ) : <></>
    )
}

