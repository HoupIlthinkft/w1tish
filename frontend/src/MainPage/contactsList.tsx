import { useProfileStore } from "../configurationFiles/config.ts";

export function ContactsListComponent() {

    const userContact = useProfileStore((state) => state.contacts);

    return (
        <div className="h-[100%] w-[100%] bg-white rounded-[15px] overflow-y-auto">
            {
                userContact.chats.map((contact, index) => (
                    <>
                        <ContactComponent key={index} contact={contact}/>
                    </>
                ))
            }
        </div>
    )
}

