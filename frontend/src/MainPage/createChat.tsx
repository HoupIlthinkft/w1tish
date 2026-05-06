import { useProfileStore } from "../configurationFiles/config.ts";
import { get_data_by_username, get_avatar_url_by_id, request_create_new_chat } from "../configurationFiles/requests.ts";
import { callNotification } from "../Notification/notifications.tsx";
import { useState, useRef, useEffect } from "react";

export function CreateChatComponent() {
    const [activityCreateChat, setActivityCreateChat] = useState(false);
    const [members, setMembers] = useState([]);
    const inputMember = useRef<HTMLInputElement | null>(null);

    const addMember = async () => {
        if (inputMember.current.value.trim() != "") {
            if (inputMember.current.value != useProfileStore.getState().profile.username) {
                if (members.every((el) => el.username != inputMember.current.value)) { 
                    const response = await get_data_by_username(inputMember.current.value);
                    setMembers([...members, response.users[0]]);
                } else callNotification("Собеседник один, создать его клона нельзя, как минимум в пределах w1tish", "error");
            } else callNotification("К сожалению нельзя общаться со своей шизой :(", "error");
        } else callNotification("К сожалению нельзя общаться с пустотой, админ запретил", "error");
    }

    return (
        <>
            <div onClick={() => setActivityCreateChat(!activityCreateChat)} className="py-[clamp(5px,2vh,20px)] w-[100%] h-fit px-[clamp(5px,1vw,20px)] rounded-[15px] bg-white flex flex-row justify-between rounded-[15px] hover:bg-text-bg hover:text-white hover:scale-[1.05] transition-all duration-400 ease">
                <p className="text-[clamp(0.5rem,1.5vw,1.5rem)]">Создать чат</p>
                <span className="material-symbols-outlined w-fit self-center scale-[calc(8/3)] cursor-pointer">add</span>
            </div>
            {
                activityCreateChat ? (
                    <div className="absolute z-[2] w-screen h-screen top-0 right-0 flex items-center justify-center bg-black/66">
                        <div className='flex flex-col justify-between w-[30%] gap-[clamp(5px,2vh,20px)] h-fit min-h-[35%] bg-white py-[clamp(5px,4vh,40px)] px-[clamp(5px,2vw,40px)] rounded-[15px]'>
                            <div className="flex flex-row justify-between">
                                <p className="text-[clamp(0.5rem,3vw,3rem)]">W1tish</p>
                                <span className="w-fit self-center scale-[calc(8/3)] cursor-pointer material-symbols-outlined" onClick={() => setActivityCreateChat(!activityCreateChat)}>close</span>
                            </div>
                            <div className="flex flex-col align-center gap-[clamp(5px,3vh,30px)]">
                                <p className="self-center text-[clamp(0.5rem,1.5vw,1.5rem)]">Создать чат/группу</p>
                                <input ref={inputMember} className="bg-plate-accent outline-[0] py-[clamp(5px,2vh,20px)] px-[clamp(5px,1vw,20px)] rounded-[20px]" type="text" placeholder="Введите username человека..." maxlength="42" />
                                <div className="flex flex-col gap-[clamp(5px,2vh,20px)]">
                                    {
                                        members.map((member, index) => (
                                            <div key={index} className="flex flex-row justify-between px-[clamp(5px,0.5vw,10px)] py-[clamp(5px,1vh,10px)] bg-plate-accent rounded-[20px]">
                                                <div className="flex flex-row gap-[clamp(5px,0.5vw,10px)] items-center">
                                                    <img className="w-[32px] h-[32px] rounded-[360px]" src={get_avatar_url_by_id(member.id)} />
                                                    <p className="text-[clamp(0.5rem,1vw,1rem)]">{member.nickname}</p>
                                                </div>
                                                <span className="w-fit self-center scale-[calc(4/3)] cursor-pointer material-symbols-outlined" onClick={() => {setMembers([...members.slice(0, index), ...members.slice(index + 1)])}}>close</span>
                                           </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="flex flex-row justify-between">
                                <button className="bg-plate-accent rounded-[20px] px-[clamp(5px,1vw,20px)] py-[clamp(5px,2vh,20px)] hover:scale-[1.1] duration-300 ease" onClick={() => addMember()}>Добавить участника</button>
                                <button className="bg-plate-accent rounded-[20px] px-[clamp(5px,1vw,20px)] py-[clamp(5px,2vh,20px)] hover:scale-[1.1] duration-300 ease" onClick={() => {
                                    request_create_new_chat(members.map((member) => member.id));
                                    setMembers([]);
                                    setActivityCreateChat(!activityCreateChat);
                                }}>Созидать</button>
                            </div>
                        </div>
                    </div>
                ) : <></>
            }
        </>
    )
}
