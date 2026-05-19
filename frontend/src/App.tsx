import { useEffect } from 'react';

import { AuthRegFormComponent } from './AuthRegPage/authRegForm.tsx';
import { BackgroundComponent } from './AuthRegPage/authRegBackground.tsx';

import { NotificationComponent } from './Notification/notifications.tsx';
import { useChatStore, useDataStore, useProfileStore } from './configurationFiles/config.ts';
import { getProtectedData } from './configurationFiles/requests.ts';

import { CreateChatComponent } from './MainPage/createChat.tsx';
import { ContactsListComponent } from './MainPage/contactsList.tsx';
import { UserProfileComponent } from './MainPage/userProfile.tsx';
import { ChatComponent } from './MainPage/chat.tsx';

function App() {
  const accessToken = useDataStore((state) => state.accessToken);
  const profile = useProfileStore((state) => state.profile);
  const activeChat = useChatStore((state) => state.activityChat);
  useEffect(() => {
    if (accessToken == null || profile == null) {
      getProtectedData();
    }
  }, [accessToken, profile]);

  return accessToken == null || profile == null ? (
    <>
      <AuthRegFormComponent />
      <BackgroundComponent typeBG="AuthRegForm" />
      <NotificationComponent />
    </>
  ) : (
    <div className="bg-plate-accent z-1 flex w-full flex-row">
      <div
        className={`border-border bg-plate-muted relative h-full w-full flex-col justify-between gap-[clamp(5px,1vh,10px)] border md:flex md:w-[25%] ${activeChat == null ? 'flex' : 'hidden'}`}
      >
        <CreateChatComponent />
        <ContactsListComponent />
        <UserProfileComponent />
      </div>
      <div
        className={`h-full w-full md:inline md:w-[75%] ${activeChat == null ? 'hidden' : 'flex'}`}
      >
        <ChatComponent />
      </div>
      <NotificationComponent />
    </div>
  );
}

export default App;
