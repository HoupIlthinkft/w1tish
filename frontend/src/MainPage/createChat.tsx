import { useContactStore, useProfileStore } from "../configurationFiles/config.ts";
import { get_data_by_username } from "../configurationFiles/requests.ts";
import { createSession } from "../configurationFiles/encryption.ts";
import { callNotification } from "../Notification/notifications.tsx";
import { useState, useRef } from "react";

export function CreateChatComponent() {
    const [activityCreateChat, setActivityCreateChat] = useState(false);
    const inputMember = useRef<HTMLInputElement | null>(null);

    return (
        <>
            <div onClick={() => setActivityCreateChat(!activityCreateChat)} className="py-[clamp(5px,2vh,20px)] w-[100%] cursor-pointer h-fit px-[clamp(5px,1vw,20px)] rounded-[15px] bg-white flex flex-row justify-between rounded-[15px] hover:bg-text-bg hover:text-white hover:scale-[1.05] transition-all duration-400 ease">
                <p className="text-[clamp(0.5rem,1.5vw,1.5rem)] self-center">Создать чат</p>
                <span className="material-symbols-outlined scale-[calc(4/3)] md:scale-[2] xl:scale-[calc(8/3)] w-fit self-center cursor-pointer">add</span>
            </div>
            {
                activityCreateChat ? (
                    <div className="absolute z-[2] w-screen h-screen top-0 right-0 flex items-center justify-center bg-black/66">
                        <div className='flex flex-col justify-between w-[30%] gap-[clamp(5px,2vh,20px)] h-fit min-h-[35%] bg-white py-[clamp(5px,4vh,40px)] px-[clamp(5px,2vw,40px)] rounded-[15px]'>
                            <div className="flex flex-row justify-between">
                                <p className="text-[clamp(0.5rem,3vw,3rem)]">W1tish</p>
                                <span className="w-fit self-center scale-[calc(4/3)] md:scale-[2] xl:scale-[calc(8/3)] cursor-pointer material-symbols-outlined" onClick={() => setActivityCreateChat(!activityCreateChat)}>close</span>
                            </div>
                            <div className="flex flex-col align-center gap-[clamp(5px,3vh,30px)]">
                                <p className="self-center text-[clamp(0.5rem,1.5vw,1.5rem)]">Создать чат/группу</p>
                                <input ref={inputMember} className="bg-plate-accent outline-[0] py-[clamp(5px,2vh,20px)] px-[clamp(5px,1vw,20px)] rounded-[20px]" type="text" placeholder="Введите username человека..." maxlength="42" />
                            </div>
                                <button className="bg-plate-accent rounded-[20px] px-[clamp(5px,1vw,20px)] py-[clamp(5px,2vh,20px)] hover:scale-[1.1] duration-300 ease" onClick={() => {
                                    if (inputMember.current != null) {
                                            if (inputMember.current.value.trim() != "") {
                                                if (inputMember.current.value != useProfileStore.getState().profile.username) {
                                                    if (Object.values(useProfileStore.getState().profile.chats).every((chat) => JSON.stringify(chat) != inputMember.current.value)) {
                                                            get_data_by_username(inputMember.current.value).then(value => {
                                                                createSession(value.users[0].id, "contact");
                                                                useContactStore.getState().addContact(value.users[0]);
                                                              //  useProfileStore.getState().addContact({})  
                                                                setActivityCreateChat(!activityCreateChat);
                                                            })
                                                    } else callNotification("К сожалению нельзя сделать два одиннаковых чата, многопоточность запрещена на территории w1tish", "error");
                                                } else callNotification("К сожалению нельзя общаться со своей шизой :(", "error");  
                                            } else callNotification("К сожалению нельзя общаться с пустотой, админ запретил", "error");
                                }}}>Созидать</button>
                        </div>
                    </div>
                ) : <></>
            }
        </>
    )
}
