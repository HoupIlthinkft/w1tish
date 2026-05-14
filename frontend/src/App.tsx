import { useEffect } from 'react';

import { AuthRegFormComponent } from './AuthRegPage/authRegForm.tsx';
import { AuthRegBackgroundComponent } from './AuthRegPage/authRegBackground.tsx';

import { NotificationComponent } from './Notification/notifications.tsx';
import { useDataStore, useProfileStore } from './configurationFiles/config.ts';
import { getProtectedData } from './configurationFiles/requests.ts';

import { CreateChatComponent } from './MainPage/createChat.tsx';
import { ContactsListComponent } from './MainPage/contactsList.tsx';
import { UserProfileComponent } from './MainPage/userProfile.tsx';
import { ChatComponent } from './MainPage/chat.tsx';

function App() {
  const accessToken = useDataStore((state) => state.accessToken);
  const profile = useProfileStore((state) => state.profile);

  useEffect(() => {
    if (accessToken == null || profile == null) {
      getProtectedData();
    }
  }, [accessToken, profile]);

  return accessToken == null || profile == null ? (
    <>
      <AuthRegFormComponent />
      <AuthRegBackgroundComponent />
      <NotificationComponent />
    </>
  ) : (
    <div className="bg-plate-accent flex w-full flex-row">
      <div className="border-border bg-plate-muted flex h-full w-full flex-col justify-between gap-[clamp(5px,1vh,10px)] border md:w-[25%]">
        <CreateChatComponent />
        <ContactsListComponent />
        <UserProfileComponent />
      </div>
      <div className="h-full md:w-[75%]">
        <ChatComponent />
      </div>
      <NotificationComponent />
    </div>
  );
}

export default App;
