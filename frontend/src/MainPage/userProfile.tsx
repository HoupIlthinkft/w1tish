import { useState, useRef, useEffect } from "react";
import { useProfileStore, useDataStore } from "../configurationFiles/config.ts";
import { requset_editing_nickname, requset_editing_avatar, getProtectedData, request_reset_token } from "../configurationFiles/requests.ts";


export function UserProfileComponent() {
    const [activityProfile, setActivityProfile] = useState<boolean>(false);
    const [editingNickname, setEditingNickname] = useState<boolean>(false);
    
    const editNicknameRef = useRef<HTMLElement | null>(null);

    const profile = useProfileStore((state) => state.profile);


    return (
        <>
            <div className="flex flex-row gap-[clamp(5px,0.5vw,10px)] rounded-[15px] px-[clamp(5px,1.5vw,30px)] py-[clamp(5px,2vh,20px)] bg-white border-t-1 border-border">
                <img src={profile.avatar} className="w-[clamp(16px,3vw,64px)] h-[clamp(16px,3vw,64px)] rounded-[360px]" />
                <div className="flex flex-row justify-between w-[100%]">
                    <div className="flex flex-col justify-center group transition-all duration-300 ease">
                        <p className="text-[clamp(0.75rem,1.5vw,1.5rem)]">{profile.nickname}</p>
                        <p className="hidden opacity-[0] group-hover:last:inline group-hover:last:opacity-[1] text-[clamp(0.5rem,1vw,1rem)]">{profile.username}</p>
                    </div>
                    <span className="w-fit self-center sclae-[calc(4/3)] xl:scale-[calc(8/3)] md:scale-[2] material-symbols-outlined cursor-pointer hover:text-plate-hover duration-300 transition-all ease" onClick={() => setActivityProfile(!activityProfile)}>settings</span>
                </div>
            </div>
            {
                activityProfile ? (
                    <div className="absolute z-[2] top-0 left-0 flex justify-center items-center w-screen h-screen bg-black/66">
                        <div className="flex flex-col md:flex-row bg-plate-accent w-[70vw] h-fit px-[clamp(10px,2vw,40px)] gap-[clamp(5px,2vw,40px)] justify-between py-[clamp(10px,4vh,40px)] rounded-[20px]">
                            <span className="material-symbols-outlined w-fit self-start scale-[calc(8/3)] cursor-pointer hover:text-danger-zone hover:scale-[3] duration-200 transition-all ease" onClick={() => setActivityProfile(!activityProfile)}>close</span>
                            <div className="flex flex-col justify-between w-[60%] gap-[clamp(5px,10vh,100px)]">
                                <div className="flex flex-col items-center">
                                    <p className="text-[clamp(1rem,8vw,8rem)] text-plate-hover font-medium">W1tish</p>
                                    <div className="flex flex-col w-[100%]">
                                        <div className="flex flex-row items-center gap-[clamp(1px,0.5vw,10px)] w-[100%]">
                                            <p className="text-[clamp(1rem,2vw,2rem)] font-medium">NickName: </p>
                                            <input className="px-[clamp(5px,1vw,20px)] outline-[0] py-[clamp(5px,1vh,10px)] w-[100%] rounded-[15px] bg-plate-muted border-border border-1 text-[clamp(0.5rem,1.25vw,1.25rem)]" ref={editNicknameRef} />
                                        </div>
                                        <div className="flex flex-row items-center gap-[clamp(1px,0.5vw,10px)]  w-[100%]">
                                            <p className="text-[clamp(1rem,2vw,2rem)] font-medium">UserName:</p>
                                            <p className="text-[clamp(0.5rem,1.5vw,1.5rem)] w-[100%]">{profile.username}</p>
                                        </div>
                                        <p className="text-[clamp(0.75rem,1.5vw,1.5rem)] font-medium text-plate-hover">Build identificator: 0.0.1-pre-alpha</p>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-[clamp(5px,2vw,40px)]">
                                    <button className="bg-plate-accent rounded-[20px] text-[clamp(0.75rem,1.5vw,1.5rem)] hover:bg-plate-hover font-medium border-border border-1 px-[clamp(5px,4vw,80px)] py-[clamp(5px,3vh,30px)] w-fit self-end hover:scale-[1.1] duration-300 ease" type="button" onClick={() => {
                                        requset_editing_nickname(editNicknameRef.current.value);
                                        useProfileStore.getState().setNickname(editNicknameRef.current.value);
                                        setActivityProfile(!activityProfile);
                                    }}>Сохранить</button>
                                    <button className="bg-danger-zone border-border border-1 text-[clamp(0.75rem,1.5vw,1.5rem)] font-medium rounded-[20px] px-[clamp(5px,2vw,40px)] py-[clamp(5px,3vh,30px)] w-fit self-end hover:scale-[1.1] duration-300 ease" type="button" onClick={() => {
                                        useDataStore.getState().setAccessToken(null); 
                                        useProfileStore.getState().setProfile(null);
                                        request_reset_token()
                                    }}>Выйти из аккаунта</button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-[clamp(5px,1vw,20px)] self-center">
                                <div className='flex flex-col group justify-center'>
                                    <img className="w-[clamp(64px,22vw,440px)] h-[clamp(64px,22vw,440px)] rounded-[10px]" src={profile.avatar} alt="setting_avatar_user" />
                                    <input className="w-[clamp(64px,22vw,440px)] h-[clamp(64px,22vw,440px)] absolute z-[2] text-transparent opacity-[0] bg-white/33 group-hover:opacity-[1] duration-500 transition-all ease cursor-pointer" onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;

                                        const formData = new FormData();
                                        formData.append("file", file, file.name);

                                        requset_editing_avatar(formData);
                                    }} type="file" accept=".png, .jpeg, .jpg, .webp" />
                                    <span className="material-symbols-outlined absolute w-fit self-center scale-[calc(8/3)] text-gray/66 opacity-[0] group-hover:opacity-[1] duration-300 transition-all ease">compare</span>
                                </div>
                                <p className="text-[clamp(0.75rem,1.5vw,1.5rem)] font-medium self-center text-plate-hover">{profile.id}</p>
                            </div>                
                        </div>
                    </div>
                ) : <></>
            }
        </>
    )
}
