import ReactMarkdown from 'react-markdown'
import { useProfileStore,  useChatStore } from "../configurationFiles/config.ts";
import { decrypt } from "../configurationFiles/encryption.ts";

export function MessageComponent({message}) {
    const profile = useProfileStore((state) => state.profile);
    const activityChat = useChatStore((state) => state.activityChat);
    
//    const oponentId = profile.chats[activityChat].find((member) => member != profile.id);   

    console.log(message);
    //let decryptMessage;
    //decrypt({type: message.type, body: message.content}, oponentId).then(value => decryptMessage = value);

    return (
            <div className="rounded-[15px] py-[clamp(5px,1vh,10px)] px-[clamp(5px,0.5vw,10px)] bg-plate-bg w-fit" style={message.sender == profile.id ? {"border-bottom-right-radius": 0, "align-self": "end"} : {"border-bottom-left-radius": 0, "align-self": "start"}}
            ><ReactMarkdown>{message.content}</ReactMarkdown></div>
    )
}
