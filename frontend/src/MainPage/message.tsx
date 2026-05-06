import { useProfileStore, useContactStore } from "../configurationFiles/config.ts";
import { get_avatart_url_by_id } from "../configurationFiles/requests.ts";

export function MessageComponent() {
    const profile = useProfileStore.getState().profile;
    
    return (
        <div>
            {
                profile.id != sender ? (
                    <div>
                        <img href={get_avatar_url_by_id(sender)} />
                        <p>{useContactStore.getState().contact.sender.nickname}</p>
                    </div>
                ) : <></>
            }
            <div>{content}</div>
        </div>
    )
}
