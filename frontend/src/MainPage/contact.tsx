import ReactMarkdown from 'react-markdown'

import { useContactStore, useChatStore, useProfileStore } from "../configurationFiles/config.ts";
import { createSession } from "../configurationFiles/encryption.ts";
import { request_get_messages } from "../configurationFiles/requests.ts";

export function ContactComponent({contact}) {
    const profile = useProfileStore((state) => state.profile);
    const membersData = useContactStore((state) => state.contacts);
    const activeChat = useChatStore((state) => state.activityChat);

    return (
        <div onClick={async () => {
            const chatStory = await request_get_messages(contact[0]);
            
            createSession(contact[1].find((member) => member != profile.id), "chat", contact[0]);

            useChatStore.getState().setChatStory(chatStory.messages);
            useChatStore.getState().setActivityChat(contact[0]);
        }} className="bg-plate-accent hover:bg-plate-hover duration-300 transition-all ease cursor-pointer flex flex-col gap-[clamp(5px,1vh,10px)] rounded-[15px] py-[clamp(5px,2vh,20px)] px-[clamp(5px,1vw,20px)]"
            style={ activeChat == contact[0] ? {'background-color': "#E5E5E5"} : {}}
        >
                {
                    contact[1].map((member, index) => (
                        member != profile.id ? (
                        <div key={index} className="flex flex-row items-center gap-[clamp(5px,1vw,20px)]">
                            <img className="w-[clamp(32px,6vw,64px)] h-[clamp(32px,6vw,64px)] rounded-[360px]" src={membersData.find(element => element.id == member).avatar} />
                            <p className="text-[clamp(1rem,2.5vw,2rem)] self-center">{membersData.find(element => element.id == member).nickname}</p>
                        </div>
                        ) : <></>
                    ))
                }
        </div>
    )
}
