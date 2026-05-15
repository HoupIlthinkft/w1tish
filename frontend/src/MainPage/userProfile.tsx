import { useState, useRef } from 'react';
import { useProfileStore, useDataStore } from '../configurationFiles/config.ts';
import {
  requset_editing_nickname,
  requset_editing_avatar,
  request_reset_token,
} from '../configurationFiles/requests.ts';
import { closeConnection } from '../configurationFiles/webSocketsConnection.ts';

export function UserProfileComponent() {
  const [activityProfile, setActivityProfile] = useState<boolean>(false);

  const editNicknameRef = useRef<HTMLInputElement | null>(null);

  const profile = useProfileStore((state) => state.profile);

  return (
    <>
      <div className="border-border flex flex-row gap-[clamp(5px,0.5vw,10px)] rounded-[15px] border-t bg-white px-[clamp(5px,1.5vw,30px)] py-[clamp(5px,2vh,20px)]">
        <img
          src={profile.avatar_url}
          alt="avatar"
          className="h-4 w-4 rounded-[360px] md:h-8 md:w-8 xl:h-16 xl:w-16"
        />
        <div className="flex w-full flex-row justify-between">
          <div className="group ease flex flex-col justify-center transition-all duration-300">
            <p className="text-[clamp(0.75rem,1.5vw,1.5rem)]">{profile.nickname}</p>
            <p className="hidden text-[clamp(0.5rem,1vw,1rem)] opacity-[0] group-hover:last:inline group-hover:last:opacity-[1]">
              {profile.username}
            </p>
          </div>
          <span
            className="material-symbols-outlined hover:text-plate-hover ease w-fit scale-[1.33] cursor-pointer self-center transition-all duration-300 md:scale-[2] xl:scale-[2.67]"
            onClick={() => setActivityProfile(!activityProfile)}
          >
            settings
          </span>
        </div>
      </div>
      {activityProfile ? (
        <div className="absolute top-0 left-0 z-2 flex h-screen w-screen items-center justify-center bg-black/66">
          <div className="bg-plate-accent flex h-fit w-[70vw] flex-col justify-between gap-[clamp(5px,2vw,40px)] rounded-[20px] px-[clamp(10px,2vw,40px)] py-[clamp(10px,4vh,40px)] md:flex-row">
            <span
              className="material-symbols-outlined hover:text-danger-zone ease w-fit scale-[2.67] cursor-pointer self-start transition-all duration-200 hover:scale-[3]"
              onClick={() => setActivityProfile(!activityProfile)}
            >
              close
            </span>
            <div className="flex flex-col gap-[clamp(5px,1vw,20px)] self-center">
              <div className="group flex flex-col justify-center">
                <img
                  className="h-[clamp(64px,22vw,440px)] w-[clamp(64px,22vw,440px)] rounded-[10px]"
                  src={profile.avatar_url}
                  alt="setting_avatar_user"
                />
                <input
                  className="ease absolute z-2 h-[clamp(64px,22vw,440px)] w-[clamp(64px,22vw,440px)] cursor-pointer bg-white/33 text-transparent opacity-[0] transition-all duration-500 group-hover:opacity-[1]"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const formData = new FormData();
                    formData.append('file', file, file.name);

                    requset_editing_avatar(formData);
                  }}
                  type="file"
                  accept=".png, .jpeg, .jpg, .webp"
                />
                <span className="material-symbols-outlined text-gray/66 ease absolute w-fit scale-[2.67] self-center opacity-[0] transition-all duration-300 group-hover:opacity-[1]">
                  compare
                </span>
              </div>
              <p className="text-plate-hover self-center text-[clamp(0.75rem,1.5vw,1.5rem)] font-medium">
                {profile.id}
              </p>
            </div>
            <div className="flex w-[60%] flex-col justify-between gap-[clamp(5px,10vh,100px)]">
              <div className="flex flex-col items-center">
                <p className="text-plate-hover text-[clamp(1rem,8vw,8rem)] font-medium">W1tish</p>
                <div className="flex w-full flex-col">
                  <div className="flex w-full flex-row items-center gap-[clamp(1px,0.5vw,10px)]">
                    <p className="text-[clamp(1rem,2vw,2rem)] font-medium">NickName: </p>
                    <input
                      className="bg-plate-muted border-border w-full rounded-[15px] border px-[clamp(5px,1vw,20px)] py-[clamp(5px,1vh,10px)] text-[clamp(0.5rem,1.25vw,1.25rem)] outline-0"
                      ref={editNicknameRef}
                      value={profile.nickname}
                    />
                  </div>
                  <div className="flex w-full flex-row items-center gap-[clamp(1px,0.5vw,10px)]">
                    <p className="text-[clamp(1rem,2vw,2rem)] font-medium">UserName:</p>
                    <p className="w-full text-[clamp(0.5rem,1.5vw,1.5rem)]">{profile.username}</p>
                  </div>
                  <p className="text-plate-hover text-[clamp(0.75rem,1.5vw,1.5rem)] font-medium">
                    Build identificator: 0.0.1-pre-alpha
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-[clamp(5px,2vw,40px)] self-end">
                <button
                  className="bg-plate-accent hover:bg-plate-hover border-border ease w-fit self-end rounded-[20px] border px-[clamp(5px,4vw,80px)] py-[clamp(5px,3vh,30px)] text-[clamp(0.75rem,1.5vw,1.5rem)] font-medium duration-300 hover:scale-[1.1]"
                  type="button"
                  onClick={() => {
                    if (editNicknameRef.current.value != profile.nickname) {
                      requset_editing_nickname(editNicknameRef.current.value);
                      useProfileStore.getState().setNickname(editNicknameRef.current.value);
                    }
                    setActivityProfile(!activityProfile);
                  }}
                >
                  Сохранить
                </button>
                <button
                  className="bg-danger-zone border-border ease w-fit self-end rounded-[20px] border px-[clamp(5px,2vw,40px)] py-[clamp(5px,3vh,30px)] text-[clamp(0.75rem,1.5vw,1.5rem)] font-medium duration-300 hover:scale-[1.1]"
                  type="button"
                  onClick={() => {
                    useDataStore.getState().setAccessToken(null);
                    useProfileStore.getState().setProfile(null);
                    closeConnection();
                    request_reset_token();
                  }}
                >
                  Выйти из аккаунта
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
