import { useEffect } from "react";

import { useProfileStore, useContactStore } from "../configurationFiles/config.ts";
import { get_data_users_ids } from "../configurationFiles/requests.ts";
import { ContactComponent } from "../MainPage/contact.tsx";

export function ContactsListComponent() {
    const userContact = useProfileStore((state) => state.profile.chats);

    const usersData = useContactStore((state) => state.contacts);

    useEffect(() => {
        if (userContact == undefined || userContact == null) return;

        const usersInContact = new Set(
            Object.entries(userContact).flatMap(
                (chat) => Object.entries(chat[1].permissions).flatMap(
                    (member) => {
                        if (member[0] != useProfileStore.getState().profile.id) return [member[0]];
                        else return [];
                    }
                )
            )
        );
        
        get_data_users_ids(Array.from(usersInContact)).then((value) => useContactStore.getState().setContacts(value.users));
    }, [])
    

    return (
        usersData != null ? (
        <div className="h-[100%] w-[100%] bg-white rounded-[15px] overflow-y-auto">
            {
                Object.entries(userContact).map((contact, index) => (
                    <>
                        <ContactComponent key={index} contact={contact}/>
                    </>
                ))
            }
        </div>
        ) : <></>
    )
}

