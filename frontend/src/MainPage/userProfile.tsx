import { useState, useRef, useEffect } from "react";
import { useProfileStore, useDataStore } from "../configurationFiles/config.ts";
import { requset_editing_nickname, getProtectedData, request_reset_token } from "../configurationFiles/requests.ts";


export function UserProfileComponent() {
    const [activityProfile, setActivityProfile] = useState<boolean>(false);
    const [editingNickname, setEditingNickname] = useState<boolean>(false);
    
    const editNicknameRef = useRef<HTMLElement | null>(null);

    let profile = useProfileStore((state) => state.profile);

    useEffect(() => {
        getProtectedData();
    }, [])
    
    if (profile == null) return;

    return (
        <>
            <div className="flex flex-row gap-[clamp(5px,0.5vw,10px)] rounded-[15px] px-[clamp(5px,1vw,20px)] py-[clamp(5px,2vh,20px)] bg-white">
                <img src={profile.avatar} className="w-[64px] h-[64px] rounded-[360px]" />
                <div className="flex flex-row justify-between w-[100%]">
                    <div className="flex flex-col justify-center group transition-all duration-300 ease">
                        <p className="text-[clamp(0.75rem,1.5vw,1.5rem)]">{profile.nickname}</p>
                        <p className="hidden opacity-[0] group-hover:last:inline group-hover:last:opacity-[1] text-[clamp(0.5rem,1vw,1rem)]">{profile.username}</p>
                    </div>
                    <span className="w-fit self-center scale-[calc(8/3)] material-symbols-outlined cursor-pointer hover:text-plate-accent duration-300 transition-all ease" onClick={() => setActivityProfile(!activityProfile)}>settings</span>
                </div>
            </div>
            {
                activityProfile ? (
                    <div className="absolute z-[2] top-0 left-0 flex justify-center items-center w-screen h-screen bg-black/66">
                        <div className="flex flex-col justify-between bg-white w-[60vw] min-h-fit h-[70vh] px-[clamp(10px,2vw,40px)] py-[clamp(10px,4vh,40px)] rounded-[20px]">
                            <div className="flex flex-col">
                                <div className="flex flex-row justify-between w-[100%]">
                                    <p className="text-[clamp(1rem,6vw,6rem)] font-medium">W1tish</p>
                                    <span className="material-symbols-outlined w-fit self-start scale-[calc(8/3)] cursor-pointer" onClick={() => setActivityProfile(!activityProfile)}>close</span>
                                </div>
                                <div className="flex flex-row gap-[clamp(5px,1vw,20px)]">
                                    <div className='flex flex-col group justify-center'>
                                        <img className="w-[clamp(64px,13vw,256px)] h-[clamp(64px,13vw,256px)] rounded-[10px]" src={profile.avatar} alt="setting_avatar_user" />
                                        <input className="absolute z-[2] text-transparent opacity-[0] bg-white/33 group-hover:opacity-[1] duration-500 transition-all ease cursor-pointer w-[256px] h-[256px]" onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;

                                            const formData = new FormData();
                                            formData.append("file", file, file.name);

                                            requset_editing_avatar(formData);
                                        }} type="file" accept=".png, .jpeg, .jpg, .webp" />
                                        <span className="material-symbols-outlined absolute text-white/33 w-fit self-center scale-[calc(8/3)] opacity-[0] group-hover:opacity-[1] duration-300 transition-all ease">compare</span>
                                    </div>
                                    <div className="flex flex-col gap-[clamp(5px,2vh,20px)]">
                                        <div className="flex flex-row gap-[clamp(5px,1vw,20px)] justify-between">
                                            {
                                                !editingNickname ? (
                                                    <>
                                                        <p className="text-[clamp(1rem,4vw,4rem)]">{profile.nickname}</p>
                                                        <span className="material-symbols-outlined w-fit self-center scale-[calc(8/3)] cursor-pointer" onClick={() => setEditingNickname(true)}>edit</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <input className="px-[clamp(5px,1vw,20px)] outline-[0] py-[clamp(5px,2vh,20px)] rounded-[30px] bg-plate-accent text-[clamp(0.5rem,1.25vw,1.25rem)]" ref={editNicknameRef} />
                                                        <div className="flex flex-row gap-[clamp(5px,1vw,20px)]">
                                                            <span className="material-symbols-outlined w-fit self-center scale-[calc(8/3)] cursor-pointer" onClick={() => setEditingNickname(false)}>close</span>
                                                            <span className="material-symbols-outlined w-fit self-center scale-[calc(8/3)] cursor-pointer" onClick={() => {
                                                                requset_editing_nickname(editNicknameRef.current.value);
                                                                setEditingNickname(false);
                                                            }}>check</span>
                                                        </div>
                                                    </>
                                                )
                                            }
                                        </div>
                                        <p className="text-[clamp(1rem,2vw,2rem)]">{profile.username}</p>
                                        <p className="text-[clamp(1rem,1vw,1rem)]">{profile.id}</p>
                                    </div>
                                </div>
                            </div>
                            <button className="bg-plate-accent rounded-[20px] px-[clamp(5px,1vw,20px)] py-[clamp(5px,2vh,20px)] w-fit self-end hover:scale-[1.1] duration-300 ease" type="button" onClick={() => {useDataStore.getState().setAccessToken(null), request_reset_token()}}>Выйти из аккаунта</button>
                        </div>
                    </div>
                ) : <></>
            }
        </>
    )
}
