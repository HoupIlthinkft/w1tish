import { useContactStore, useChatStore } from "../configurationFiles/config.ts";
import { get_avatar_url_by_id, request_get_messages } from "../configurationFiles/requests.ts";

export function ContactComponent({contact}) {
    return (
        <div onClick={async () => {useChatStore.getState().setChatStory(await request_get_messages(contact.id))}} className="bg-plate-accent flex flex-col gap-[clamp(5px,1vh,10px)] rounded-[15px] py-[clamp(5px,2vh,20px)] px-[clamp(5px,1vw,20px)]">
            <div className="flex flex-row gap-[clamp(5px,0.5vw,10px)] flex-wrap">
                {
                    contact.permissions.map((member, index) => (
                        <div key={index} className="flex flex-row">
                            <img src={get_avatar_url_by_id(member)} />
                            <p>{useContactStore.getState().contact.member.nickname}</p>
                        </div>
                    ))
                }
            </div>
            <div>{contact.last_message_text}</div>
        </div>
    )
}
