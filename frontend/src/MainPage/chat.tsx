import { useRef } from "react";

import { useChatStore, useProfileStore } from "../configurationFiles/config.ts";

export function ChatComponent() {
    const inputMessage = useRef(null);

    const chatStory = useChatStore((state) => state.chatStory);

    return (
        <div className="flex flex-col h-[100%] justify-between">
            {
                chatStory != null ? (
                <>
                    <div>
                        {
                            chatStory.members.map((member, index) => (
                                <>
                                    {
                                        member.nickname != useProfileStore.getState().profile.nickname ? (
                                            <>
                                                <img />
                                                <p>{member.nickname}</p>
                                            </>
                                        ) : <></>
                                    }
                                </>
                            ))
                        }
                    </div>
                    <div>
                        {
                            chatStory.map((message, index) => (
                                <>
                                    <MessageComponent key={index} content={message.content} sender={message.sender} />
                                </>
                            ))
                        }
                    </div>
                    <div>
                        <textarea ref={inputMessage} className="h-fit max-h-[20vh]" placeholder="Введите сообщение..." />
                        <span className="material-symbols-outlined" onClick={send_new_message(useChatStore.getState().activityChat, inputMessage.current.value, useProfileStore.getState().profile.id)}>send</span>
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
