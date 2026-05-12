import ReactMarkdown from 'react-markdown'
import { useProfileStore,  useChatStore } from "../configurationFiles/config.ts";
import { decrypt } from "../configurationFiles/encryption.ts";

export function MessageComponent({message}) {
    const profile = useProfileStore((state) => state.profile);
    const activityChat = useChatStore((state) => state.activityChat);
    
    const oponentId = profile.chats[activityChat].find((member) => member != profile.id);   

    console.log(message);
    let decryptMessage;
    decrypt({type: message.type, body: message.content}, oponentId).then(value => decryptMessage = value);

    return (
            <div><ReactMarkdown>{decryptMessage}</ReactMarkdown></div>
    )
}
