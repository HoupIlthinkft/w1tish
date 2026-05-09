import { useContactStore, useChatStore, useProfileStore } from "../configurationFiles/config.ts";
import { get_avatar_url_by_id, request_get_messages } from "../configurationFiles/requests.ts";

export function ContactComponent({contact}) {
    const profile = useProfileStore((state) => state.profile);
    const membersData = useContactStore((state) => state.contacts);

    return (
        <div onClick={async () => {
            const chatStory = await request_get_messages(contact[0]);

            useChatStore.getState().setChatStory(chatStory.messages);
            useChatStore.getState().setActivityChat(contact[0]);
        }} className="bg-plate-accent flex flex-col gap-[clamp(5px,1vh,10px)] rounded-[15px] py-[clamp(5px,2vh,20px)] px-[clamp(5px,1vw,20px)]">
            <div className="flex flex-row gap-[clamp(5px,0.5vw,10px)] flex-wrap">
                {
                    Object.keys(contact[1].permissions).map((member, index) => (
                        member != profile.id ? (
                        <div key={index} className="flex flex-row">
                            <img src={get_avatar_url_by_id(member)} />
                            <p>{membersData.find(element => element.id == member).nickname}</p>
                        </div>
                        ) : <></>
                    ))
                }
            </div>
            <div>{contact[1].last_message}</div>
        </div>
    )
}
