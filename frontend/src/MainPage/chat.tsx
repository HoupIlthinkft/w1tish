import { useRef } from "react";

import { useChatStore, useProfileStore, useContactStore } from "../configurationFiles/config.ts";
import { get_avatar_url_by_id } from "../configurationFiles/requests.ts";
import { send_new_message } from "../configurationFiles/webSocketsConnection.ts";

import { MessageComponent } from "./message.tsx";

export function ChatComponent() {
    const inputMessage = useRef(null);

    const profile = useProfileStore((state) => state.profile);
    const chatStory = useChatStore((state) => state.chatStory);
    const activityChat = useChatStore((state) => state.activityChat);
    const membersData = useContactStore((state) => state.contacts);

    return (
        <div className="flex flex-col h-[100%] justify-between">
            {
                activityChat != null ? (
                <>
                    <div>
                        {
                            Object.keys(profile.chats[activityChat].permissions).map((memberId, index) => {
                                if (memberId == profile.id) return null;
                                else {
                                    const member = membersData.find(memberData => memberData.id == memberId);

                                    return (
                                        <div key={index}>   
                                            <img src={get_avatar_url_by_id(memberId)} />
                                            <p>{member.nickname}</p>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                    <div>
                        {
                            chatStory.map((message, index) => (
                                <>
                                    <MessageComponent key={index} message={message} />
                                </>
                            ))
                        }
                    </div>
                    <div>
                        <textarea ref={inputMessage} className="h-fit max-h-[20vh]" placeholder="Введите сообщение..." />
                        <span className="material-symbols-outlined" onClick={() => {
                            send_new_message(useChatStore.getState().activityChat, inputMessage.current?.value, useProfileStore.getState().profile.id);
                            inputMessage.current.value = "";
                        }}>send</span>
                    </div>
                </>
                ) : (
                    <div className="flex flex-col h-[100%] items-center justify-center gap-[clamp(5px,2vh,20px)]">
                        <span className="material-symbols-outlined w-fit self-center scale-[6]">cloud_alert</span>
                        <h1 className="text-[clamp(1rem,3vw,3rem)] font-semibold">Здесь пока что ничего нету</h1>
                        <h1 className="text-[clamp(2rem,6vw,6rem)] font-bold">._.</h1>
                        <h4 className="text-[clamp(0.5rem,1.5vw,1.5rem)] font-medium">Выберите контакт из левого столбца</h4>
                    </div>
                )
            }
        </div>
    )
}
