import { useRef, useState } from "react";

import { useChatStore, useProfileStore, useContactStore } from "../configurationFiles/config.ts";
import { encrypt } from "../configurationFiles/encryption.ts"
import { send_new_message } from "../configurationFiles/webSocketsConnection.ts";

import { MessageComponent } from "./message.tsx";

export function ChatComponent() {
    const [activityMemberProfile, setActivityMemberProfile] = useState(false);
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
                    <div className="bg-plate-muted rounded-[10px] px-[clamp(10px,1vw,20px)] py-[clamp(10px,2vh,20px)]">
                        {
                            profile.chats[activityChat].map((memberId, index) => {
                                if (memberId == profile.id) return null;
                                else {
                                    const member = membersData.find(memberData => memberData.id == memberId);
                                    console.log(member, membersData.find(memberData => memberData.id == memberId), memberId, membersData);
                                    console.log(profile?.chats, activityChat);
                                    
                                    return (
                                        <>
                                            <div className="flex flex-row items-center gap-[clamp(5px,0.5vw,10px))]" key={index} onClick={() => setActivityMemberProfile(!activityMemberProfile)}>   
                                                <img className="rounded-b w-[clamp(32px,3vw,64px)] h-[clamp(32px,3vw,64px)]" src={member.avatar} />
                                                <p className="text-[clamp(1rem,1.5vw,1.5rem)]">{member.nickname}</p>
                                            </div>
                                            {
                                                activityMemberProfile ? (
                                                    <div className="absolute z-[2] top-0 left-0 flex justify-center items-center w-screen h-screen bg-black/66">
                                                        <div className="flex flex-col justify-start bg-white w-[50vw] h-[50vh] px-[clamp(10px,2vw,40px)] py-[clamp(10px,4vh,40px)] rounded-[20px]">
                                                            <div className="flex flex-row justify-between w-[100%]">
                                                                <p className="text-[clamp(1rem,6vw,6rem)] font-medium">W1tish</p>
                                                                <span className="material-symbols-outlined w-fit self-start scale-[calc(8/3)] cursor-pointer" onClick={() => setActivityMemberProfile(!activityMemberProfile)}>close</span>
                                                            </div>
                                                            <div className="flex flex-row gap-[clamp(5px,1vw,20px)]">
                                                                <img className="w-[clamp(64px,13vw,256px)] h-[clamp(64px,13vw,256px)] rounded-[10px]" src={member.avatar} />
                                                                <div className="flex flex-col gap-[clamp(5px,2vh,20px)]">
                                                                    <p className="text-[clamp(1rem,4vw,4rem)]">{member.nickname}</p>
                                                                    <p className="text-[clamp(1rem,2vw,2rem)]">{member.username}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : <></>
                                            }
                                        </>
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
                    <div className="bg-plate-muted flex flex-row gap-[clamp(5px,1vw,20px)] items-center justify-between px-[clamp(5px,1vw,20px)] py-[clamp(5px,1vh,10px)] rounded-[20px]">
                        <textarea ref={inputMessage} className="min-h-fit max-h-[20vh] outline-0 w-[100%]" placeholder="Введите сообщение..." />
                        <span className="material-symbols-outlined cursor-pointer mx-[clamp(5px,0.5vw,10px)] scale-[calc(4/3)] md:scale-[2] xl:scale-[calc(8/3)]" onClick={() => {
                            send_new_message("1", encrypt(inputMessage.current?.value, useProfileStore.getState().profile.id, profile.chats[activityChat].find((member) => member != profile.id)), useChatStore.getState().activityChat);
                            inputMessage.current.value = "";
                        }}>send</span>
                    </div>
                </>
                ) : (
                    <div className="flex flex-col h-[100%] items-center justify-center gap-[clamp(5px,2vh,20px)]">
                        <span className="material-symbols-outlined w-fit self-center scale-[2] md:scale-[4] xl:scale-[6]">cloud_alert</span>
                        <h1 className="text-[clamp(1rem,3vw,3rem)] font-semibold">Здесь пока что ничего нету</h1>
                        <h1 className="text-[clamp(2rem,6vw,6rem)] font-bold">._.</h1>
                        <h4 className="text-[clamp(0.5rem,1.5vw,1.5rem)] font-medium">Выберите контакт из левого столбца</h4>
                    </div>
                )
            }
        </div>
    )
}
