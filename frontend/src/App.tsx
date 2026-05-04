import { AuthRegBackgroundComponent } from "./AuthRegPage/authRegBackground.tsx";
import { AuthRegFormComponent } from "./AuthRegPage/authRegForm.tsx";

import { NotificationComponent } from "./Notification/notifications.tsx";
import { useDataStore } from "./configurationFiles/config.ts";

function App() {

  return (
    useDataStore.getState().accessToken == null ? ( 
                <>
                <AuthRegFormComponent />
                <AuthRegBackgroundComponent />
                <NotificationComponent />
                </>
            ) : (
                <>
                    
                </>
            )
  )
}

export default App
