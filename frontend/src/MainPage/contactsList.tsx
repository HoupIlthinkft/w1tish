import { useEffect } from 'react';

import { useProfileStore, useContactStore } from '../configurationFiles/config.ts';
import { get_data_users_ids } from '../configurationFiles/requests.ts';
import { ContactComponent } from '../MainPage/contact.tsx';

export function ContactsListComponent() {
  const profile = useProfileStore((state) => state.profile);
  const userContact = useProfileStore((state) => state.profile.chats);
  const usersData = useContactStore((state) => state.contacts);
  useEffect(() => {
    if (JSON.stringify(userContact) == '[]' || userContact == undefined) return;

    const usersInContact = userContact.map((chat) =>
      chat.permissions.find((member: string) => member != profile.id),
    );
    get_data_users_ids(usersInContact).then((value) => {
      useContactStore.getState().setContacts(value);
    });
  }, []);

  return JSON.stringify(usersData) == '[]' ? (
    <></>
  ) : (
    <div className="bg-plate-muted flex h-full w-full flex-col gap-[clamp(5px,1vh,10px)] overflow-hidden overflow-y-auto rounded-[15px] px-[clamp(1px,0.25vw,5px)] py-[clamp(1px,0.5vh,5px)]">
      {userContact.map((contact) => (
        <ContactComponent key={contact.chat_id} contact={contact} />
      ))}
    </div>
  );
}
