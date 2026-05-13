import { useRef, useState } from "react";

import { useChatStore, useProfileStore, useContactStore } from "../configurationFiles/config.ts";
import { send_new_message } from "../configurationFiles/webSocketsConnection.ts";

import { MessageComponent } from "./message.tsx";

export function ChatComponent() {
    const [activityMemberProfile, setActivityMemberProfile] = useState(false);
    const inputMessage = useRef(null);

    const profile = useProfileStore((state) => state.profile);
    const chatStory = useChatStore((state) => state.chatStory);
    const activityChat = useChatStore((state) => state.activityChat);
    const membersData = useContactStore((state) => state.contacts);

    const sendMessage = () => {
        if (inputMessage.current.value.trim() != "") {
            send_new_message("1", inputMessage.current?.value, useProfileStore.getState().profile.id, profile.chats[activityChat].find((member) => member != profile.id), useChatStore.getState().activityChat);
            inputMessage.current.value = "";
        }
    }

    return (
        <div className="bg-plate-muted flex flex-col h-[100%] justify-between hidden md:flex">
            {
                activityChat == null ? (
                    <div className="flex flex-col h-[100%] items-center justify-center gap-[clamp(5px,2vh,20px)]">
                        <p className="text-[clamp(4rem,8vw,8rem)] font-[Jost] font-semibold text-plate-hover">W1tish</p>
                        <h1 className="text-[clamp(1rem,4vw,4rem)] font-bold">Здесь пока ничего нету</h1>
                        <h1 className="text-[clamp(2rem,6vw,6rem)] font-bold">{"(._. )"}</h1>
                        <h4 className="text-[clamp(0.5rem,2vw,2rem)] font-medium">Выберите чат из списка слева</h4>
                    </div>
                ) : (
                <>
                    <div className="bg-plate-muted rounded-[10px]">
                        {
                            profile.chats[activityChat].map((memberId, index) => {
                                if (memberId == profile.id) return null;
                                else {
                                    const member = membersData.find(memberData => memberData.id == memberId);
                                    
                                    return (
                                        <>  
                                            <div className="border-b-1 border-border px-[clamp(5px,0.5vw,10px)] py-[clamp(5px,1vh,10px)] flex flex-row justify-between">
                                                <div className="flex flex-row items-center gap-[clamp(1px,0.5vw,10px)]" key={index}>   
                                                    <img className="rounded-[360px] w-[clamp(32px,3vw,64px)] h-[clamp(32px,3vw,64px)]" src={profile.avatar} />
                                                    <p className="text-[clamp(1rem,1.5vw,1.5rem)]">You</p>
                                                </div>
                                                
                                                <div className="flex flex-row items-center gap-[clamp(1px,0.5vw,10px)] cursor-pointer" key={index} onClick={() => setActivityMemberProfile(!activityMemberProfile)}>   
                                                    <p className="text-[clamp(1rem,1.5vw,1.5rem)]">{member.nickname}</p>
                                                    <img className="rounded-[360px] w-[clamp(32px,3vw,64px)] h-[clamp(32px,3vw,64px)]" src={member.avatar} />
                                                </div>
                                            </div>
                                            {
                                                activityMemberProfile ? (
                                                    <div className="absolute z-[2] top-0 left-0 flex justify-center items-center w-screen h-screen bg-black/66">
                                                        <div className="flex flex-row bg-plate-accent w-[70vw] h-fit px-[clamp(10px,2vw,40px)] gap-[clamp(5px,2vw,40px)] justify-between py-[clamp(10px,4vh,40px)] rounded-[20px]">
                                                            <span className="material-symbols-outlined w-fit self-start scale-[calc(8/3)] cursor-pointer hover:text-danger-zone hover:scale-[3] duration-200 transition-all ease" onClick={() => setActivityMemberProfile(!activityMemberProfile)}>close</span>
                                                            <div className="flex flex-col items-center w-[60%]">
                                                                <p className="text-[clamp(1rem,8vw,8rem)] text-plate-hover font-medium">W1tish</p>
                                                                <div className="flex flex-col w-[100%]">
                                                                    <div className="flex flex-row items-center gap-[clamp(1px,0.5vw,10px)] w-[100%]">
                                                                        <p className="text-[clamp(1rem,2vw,2rem)] font-medium">NickName: </p>
                                                                        <p className="text-[clamp(0.5rem,1.5vw,1.5rem)] w-[100%]">{member.nickname}</p>
                                                                    </div>
                                                                    <div className="flex flex-row items-center gap-[clamp(1px,0.5vw,10px)]  w-[100%]">
                                                                        <p className="text-[clamp(1rem,2vw,2rem)] font-medium">UserName:</p>
                                                                        <p className="text-[clamp(0.5rem,1.5vw,1.5rem)] w-[100%]">{member.username}</p>
                                                                    </div>
                                                                    <p className="text-[clamp(0.75rem,1.5vw,1.5rem)] font-medium text-plate-hover">Build identificator: 0.0.1-pre-alpha</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col gap-[clamp(5px,1vw,20px)] self-center">
                                                                    <img className="w-[clamp(64px,22vw,440px)] h-[clamp(64px,22vw,440px)] rounded-[10px]" src={member.avatar} alt="setting_avatar_user" />
                                                                <p className="text-[clamp(0.75rem,1.5vw,1.5rem)] font-medium self-center text-plate-hover">{member.id}</p>
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
                    <div className="flex flex-col px-[clamp(1px,0.5vw,10px)] h-[100%] justify-end gap-[clamp(1px,1vh,10px)] overflow-auto">
                        {
                            chatStory.map((message, index) => (
                                <>
                                    {index == 0  ? <></> : <MessageComponent key={index} message={message} />}
                                </>
                            ))
                        }
                    </div>
                    <div className=" flex flex-row gap-[clamp(5px,1vw,20px)] items-center justify-between my-[clamp(5px,1vh,10px)] mx-[clamp(5px,0.5vw,10px)] mr-[clamp(5px,3vw,60px)] rounded-[20px]">
                        <textarea ref={inputMessage} placeholder="Введите сообщение..." className="border-border border-1 min-h-min max-h-[20vh] text-[clamp(0.75rem,1.5vw,1.5rem)] outline-0 w-[93%] bg-plate-accent px-[clamp(5px,1vw,20px)] py-[clamp(5px,2vh,20px)] rounded-[40px]" />
                        <span className="bg-plate-accent material-symbols-outlined cursor-pointer scale-[calc(4/3)] md:scale-[2] xl:scale-[calc(8/3)] px-[clamp(1px,0.25vw,5px)] py-[clamp(1px,0.5vh,5px)] rounded-[360px]" 
                        onClick={() => sendMessage} 
                        role="button" 
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                sendMessage();
                            }
                        }}>send</span>
                    </div>
                </>
                )
            }
        </div>
    )
}
