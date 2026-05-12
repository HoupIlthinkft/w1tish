import ReactMarkdown from 'react-markdown'
import { useProfileStore,  useChatStore } from "../configurationFiles/config.ts";
import { decrypt } from "../configurationFiles/encryption.ts";

export function MessageComponent({message}) {
    const profile = useProfileStore((state) => state.profile);
    const activityChat = useChatStore((state) => state.activityChat);
    
    const content = message.content;

    const oponentId = profile.chats[activityChat].permissions.find((member) => member != profile.id);   

    return (
            <div><ReactMarkdown>{decrypt(content, oponentId)}</ReactMarkdown></div>
    )
}
