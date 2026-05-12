import { useEffect } from "react";

import { AuthRegFormComponent } from "./AuthRegPage/authRegForm.tsx";
import { AuthRegBackgroundComponent } from "./AuthRegPage/authRegBackground.tsx";

import { NotificationComponent } from "./Notification/notifications.tsx";
import { useChatStore, useDataStore, useProfileStore } from "./configurationFiles/config.ts";
import { getProtectedData } from "./configurationFiles/requests.ts";

import { CreateChatComponent } from "./MainPage/createChat.tsx";
import { ContactsListComponent } from "./MainPage/contactsList.tsx";
import { UserProfileComponent } from "./MainPage/userProfile.tsx";
import { ChatComponent } from "./MainPage/chat.tsx";

function App() {
    const accessToken = useDataStore((state) => state.accessToken);
    const profile = useProfileStore((state) => state.profile);
    
    useEffect(() => {
        if (accessToken == null || profile == null) {
            getProtectedData();
        }
    }, [])

    return (
        accessToken == null || profile == null ? ( 
                <>
                    <AuthRegFormComponent />
                    <AuthRegBackgroundComponent />
                    <NotificationComponent />
                </>
            ) : (
                <div className="flex flex-row w-[100%] bg-plate-accent">
                    <div className="h-[100%] w-[100%] md:w-[25%] flex flex-col gap-[clamp(5px,1vh,10px)] border-1 border-border justify-between bg-plate-muted">
                        <CreateChatComponent />
                        <ContactsListComponent />
                        <UserProfileComponent />
                    </div>
                    <div className="md:w-[75%] h-[100%]">
                        <ChatComponent />
                    </div>
                    <NotificationComponent />
                </div>
            )
    )
}

export default App
