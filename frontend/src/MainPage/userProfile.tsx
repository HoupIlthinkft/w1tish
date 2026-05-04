import { useState, useRef } from "react";
import { useProfileStore, useDataStore } from "../configurationFiles/config.ts";
import { requset_editing_nickname } from "../configurationFiles/requests.ts";


export function userProfileComponent() {
    const [editingNickname, setEditingNickname] = useState<boolean>(false);
    
    const editNicknamRef = useRef<HTMLElement | null>(null);

    const profile = useProfileStore((state) => state.profile);

    return (
        <div>
            <div>
                <p id="settings_header_content">W1tish</p>
                <span className="materil-symbols-logo">close</span>
            </div>
            <div>
                <div>
                    <img src={profile.avatar} alt="setting_avatar_user" id="setting_avatar_user" />
                    <input onChange={(this) => {
                        requset_editing_avatar(this);
                    }} type="file" accept=".png, .jpeg, .jpg, .webp" />
                    <span className="materil-symbols-logo"></span>
                </div>
                <div>
                    <div>
                        {
                            !editingNickname ? (
                                <>
                                    <p>{profile.nickname}</p>
                                    <span class="materil-symbols-logo" OnClick={() => setEditingNickname(true)}></span>
                                </>
                            ) : (
                                <>
                                    <input ref={editNicknameRef} />
                                    <div>
                                        <span className="materil-symbols-logo" onClick={() => setEditingNickname(false)}>close</span>
                                        <span className="materil-symbols-logo" onClick={() => {
                                            requset_editing_nickname(editNicknameRef.current.value);
                                            setEditingNickname(false);
                                        }}></span>
                                    </div>
                                </>
                            )
                        }
                    </div>
                    <p>{profile.username}</p>
                    <p>{profile.id}</p>
                </div>
            </div>
            <div>
                <button type="button" onClick={() => useDataStore.getState().setAccessToken(null)}>Выйти из аккаунта</button>
            </div>
        </div>
    )
}
