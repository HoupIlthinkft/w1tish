import ReactMarkdown from 'react-markdown'
import { useProfileStore, useContactStore } from "../configurationFiles/config.ts";
import { get_avatar_url_by_id } from "../configurationFiles/requests.ts";

export function MessageComponent({message}) {
    const profile = useProfileStore((state) => state.profile);
    
    const sender = message.sender;
    const content = message.content;

    return (
        <div>
            {
                profile.id != sender ? (
                    <div>
                        <img href={get_avatar_url_by_id(sender)} />
                        <p>{useContactStore.getState().contacts[sender].nickname}</p>
                    </div>
                ) : <></>
            }
            <div><ReactMarkdown>{content}</ReactMarkdown></div>
        </div>
    )
}
