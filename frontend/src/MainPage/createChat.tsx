import { useContactStore, useProfileStore } from "../configurationFiles/config.ts";
import { get_data_by_username, request_create_new_chat } from "../configurationFiles/requests.ts";
import { createSession } from "../configurationFiles/encryption.ts";
import { callNotification } from "../Notification/notifications.tsx";
import { useState, useRef } from "react";

export function CreateChatComponent() {
    const [activityCreateChat, setActivityCreateChat] = useState(false);
    const inputMember = useRef<HTMLInputElement | null>(null);

    return (
        <div>
            <div className='flex flex-col justify-between gap-[clamp(5px,1.5vh,15px)] bg-white py-[clamp(5px,1vh,10px)] px-[clamp(5px,2vw,40px)] rounded-[15px]' style={activityCreateChat ? {} : {"display": "none"}} >
                <p className="self-center font-medium text-[clamp(0.5rem,1.5vw,1.5rem)]">Пользователь:</p>
                <input ref={inputMember} className="bg-plate-muted border-border border-1 outline-[0] text-[clamp(0.5rem,1.5vw,1.5rem)] py-[clamp(5px,0.5vh,5px)] px-[clamp(5px,1vw,20px)] rounded-[15px]" type="text" placeholder="Введите username человека..." maxlength="42" />
                <button className="bg-plate-accent rounded-[15px] text-[clamp(0.75rem,1.5vw,1.5rem)] font-medium px-[clamp(5px,1vw,20px)] py-[clamp(5px,0.5vh,5px)] hover:scale-[1.05] duration-300 ease" onClick={() => {
                    if (inputMember.current != null) {
                            if (inputMember.current.value.trim() != "") {
                                if (inputMember.current.value != useProfileStore.getState().profile.username) {
                                    if (Object.values(useProfileStore.getState().profile.chats).every((chat) => JSON.stringify(chat) != inputMember.current.value)) {
                                            get_data_by_username(inputMember.current.value).then(value => {
                                              //  createSession(value.users[0].id, );
                                                request_create_new_chat(value.users[0].id);
                                                useContactStore.getState().addContact(value.users[0]);
                                                //  useProfileStore.getState().addContact({})  
                                                setActivityCreateChat(!activityCreateChat);

                                            })
                                    } else callNotification("К сожалению нельзя сделать два одиннаковых чата, многопоточность запрещена на территории w1tish", "error");
                                } else callNotification("К сожалению нельзя общаться со своей шизой :(", "error");  
                            } else callNotification("К сожалению нельзя общаться с пустотой, админ запретил", "error");
                }}}>Созидать</button>
            </div>
            <div onClick={() => setActivityCreateChat(!activityCreateChat)} className="border-border border-b-1 py-[clamp(5px,2vh,20px)] hover:bg-plate-hover hover:text-plate-accent    duration-200 transition-all ease w-[100%] cursor-pointer h-fit px-[clamp(5px,1vw,20px)] rounded-[15px] bg-white flex flex-row rounded-[15px]">
                <p className="text-[clamp(0.5rem,1.5vw,1.5rem)] self-center w-[100%] text-center">Новый чат</p>
                <span className="material-symbols-outlined scale-[calc(4/3)] md:scale-[2] xl:scale-[calc(8/3)] w-fit self-center cursor-pointer">add</span>
            </div>
            
        </div>
    )
}
