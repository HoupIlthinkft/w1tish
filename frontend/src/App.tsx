import { useEffect } from "react";

import { AuthRegFormComponent } from "./AuthRegPage/authRegForm.tsx";
import { AuthRegBackgroundComponent } from "./AuthRegPage/authRegBackground.tsx";

import { NotificationComponent } from "./Notification/notifications.tsx";
import { useDataStore } from "./configurationFiles/config.ts";
import { refreshToken } from "./configurationFiles/requests.ts";

import { CreateChatComponent } from "./MainPage/createChat.tsx";
import { ContactsListComponent } from "./MainPage/contactsList.tsx";
import { UserProfileComponent } from "./MainPage/userProfile.tsx";
import { ChatComponent } from "./MainPage/chat.tsx";

function App() {
    const accessToken = useDataStore((state) => state.accessToken);
    
    useEffect(() => {
        if (accessToken == null) {
            refreshToken();
        }
    }, [])

    return (
        accessToken == null ? ( 
                <>
                    <AuthRegFormComponent />
                    <AuthRegBackgroundComponent />
                    <NotificationComponent />
                </>
            ) : (
                <div className="flex flex-row gap-[clamp(5px,1vw,20px)] w-[100%] mx-[clamp(10px,1vw,20px)] my-[clamp(10px,2vh,20px)] px-[clamp(5px,1vw,20px)] py-[clamp(5px,2vh,20px)] rounded-[15px] bg-plate-accent">
                    <div className="w-[25%] h-[100%] flex flex-col gap-[clamp(5px,1vh,10px)] justify-between">
                        <CreateChatComponent />
                        <ContactsListComponent />
                        <UserProfileComponent />
                    </div>
                    <div className="w-[75%] h-[100%]">
                        <ChatComponent />
                    </div>
                </div>
            )
    )
}

export default App
